#!/usr/bin/env node
/**
 * 外链巡检 / External link checker
 *
 * 取仓库内所有 markdown 中的 http(s) 链接，去重后并发探测。
 * 零依赖，使用 Node 18+ 内置 fetch。设置 GITHUB_TOKEN 可提高 GitHub 限额。
 *
 * 用法 / Usage:
 *   node scripts/check-links.mjs              # 全部链接
 *   node scripts/check-links.mjs --only docs  # 只查 docs/ 目录
 *   node scripts/check-links.mjs --json       # 输出 JSON 报告
 *   node scripts/check-links.mjs --ignore img.shields.io
 */

import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const valueOf = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

const ONLY = valueOf('--only');
const AS_JSON = flag('--json');
const EXTRA_IGNORES = args
  .map((a, i) => (args[i - 1] === '--ignore' ? a : null))
  .filter(Boolean);

/** 默认跳过的域名（徽章、示例、本地地址） */
const DEFAULT_IGNORES = [
  'img.shields.io',
  'shields.io',
  'badgen.net',
  'localhost',
  '127.0.0.1',
  'example.com',
  'example.org',
];

const CONCURRENCY = 6;
const TIMEOUT_MS = 15_000;
const RETRIES = 2;

const collectMarkdown = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectMarkdown(full, out);
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
};

const shouldIgnore = (url) => {
  const lower = url.toLowerCase();
  return [...DEFAULT_IGNORES, ...EXTRA_IGNORES].some((d) => d && lower.includes(d.toLowerCase()));
};

// ── 收集 URL ────────────────────────────────────────────────────────────────
const searchRoots = ONLY ? [join(ROOT, ONLY)] : [join(ROOT, 'docs'), ...['README.md', 'README.en.md', 'CONTRIBUTING.md', 'CHANGELOG.md'].map((f) => join(ROOT, f))];

const files = searchRoots.flatMap((p) => {
  if (!existsSync(p)) return [];
  return statSync(p).isDirectory() ? collectMarkdown(p) : p.endsWith('.md') ? [p] : [];
});

const URL_RE = /https?:\/\/[^\s"'<>)\]]+/g;
/** url -> Set("file:line") */
const references = new Map();

for (const file of files) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    for (const raw of line.match(URL_RE) ?? []) {
      const url = raw.replace(/[.,;:]+$/, '').replace(/\/+$/, '') || raw;
      if (shouldIgnore(url)) continue;
      if (!references.has(url)) references.set(url, new Set());
      references.get(url).add(`${relative(ROOT, file).split('\\').join('/')}:${idx + 1}`);
    }
  });
}

// ── 探测 ────────────────────────────────────────────────────────────────────
async function probe(url) {
  const headers = {
    'user-agent': 'awesome-cli-tools-link-check/0.1 (+https://github.com/)',
    accept: '*/*',
  };
  if (url.includes('github.com') && process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  for (let attempt = 0; attempt <= RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', headers, signal: controller.signal });
      // 部分站点不支持 HEAD，或对 HEAD 返回 405/403
      if ([403, 405, 501].includes(res.status)) {
        res = await fetch(url, { method: 'GET', redirect: 'follow', headers, signal: controller.signal });
      }
      clearTimeout(timer);
      return { status: res.status, ok: res.status < 400, finalUrl: res.url };
    } catch (err) {
      clearTimeout(timer);
      if (attempt === RETRIES) {
        return { status: 0, ok: false, error: err?.name === 'AbortError' ? 'timeout' : String(err?.message ?? err) };
      }
      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }
  return { status: 0, ok: false, error: 'unreachable' };
}

async function mapWithLimit(items, limit, worker) {
  const results = [];
  let cursor = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index]);
    }
  });
  await Promise.all(runners);
  return results;
}

const urls = [...references.keys()].sort();
if (urls.length === 0) {
  console.log('没有需要检查的链接 / No links to check.');
  process.exit(0);
}

console.log(`🔗 检查 ${urls.length} 个唯一链接（并发 ${CONCURRENCY}）…\n`);

const results = await mapWithLimit(urls, CONCURRENCY, async (url) => ({ url, ...(await probe(url)) }));

const failed = results.filter((r) => !r.ok);
const rateLimited = failed.filter((r) => r.status === 429 || r.status === 403);

if (AS_JSON) {
  const report = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    failed: failed.map((r) => ({ ...r, refs: [...(references.get(r.url) ?? [])] })),
    ok: results.filter((r) => r.ok).length,
  };
  writeFileSync(join(ROOT, '.link-check-report.json'), JSON.stringify(report, null, 2));
}

for (const r of failed.sort((a, b) => (a.status || 0) - (b.status || 0))) {
  const status = r.status === 0 ? r.error : String(r.status);
  console.log(`❌ [${status}] ${r.url}`);
  for (const ref of [...(references.get(r.url) ?? [])].slice(0, 3)) console.log(`      ↳ ${ref}`);
}

console.log(
  `\n结果 / Result: ${results.length - failed.length}/${results.length} 可达` +
    (failed.length ? `，${failed.length} 个失败（其中 ${rateLimited.length} 个疑似限流/被拒）` : ''),
);

// 限流导致的失败不视为硬错误（CI 中由 job 的 continue-on-error 兜底）
process.exit(failed.length === 0 ? 0 : 1);
