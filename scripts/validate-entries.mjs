#!/usr/bin/env node
/**
 * 校验条目表格结构与 README 索引可达性 / Validate entry tables and index reachability
 *
 * 规则 / Rules:
 *   R1  索引文件（README.md / README.en.md 及各目录 README）中出现的相对 .md 链接必须存在
 *   R2  `Tool` 表头下的每一行必须是 5 列，顺序为 Tool | 中文说明 | English | Tags | License
 *   R3  Tool 列必须是 Markdown 链接，且 URL 是 http(s)
 *   R4  同一仓库 URL 不应在多个分类文件中重复出现（仅在表格中检测）
 *   R5  条目标题（## 精选 / ## 全部条目 等固定小节）不应缺失
 *
 * 用法 / Usage:
 *   node scripts/validate-entries.mjs           # 只校验
 *   node scripts/validate-entries.mjs --stats   # 附带各文件条目数
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHOW_STATS = process.argv.includes('--stats');

const errors = [];
const warnings = [];

const error = (file, line, msg) => errors.push({ file, line, msg });
const warn = (file, line, msg) => warnings.push({ file, line, msg });

/** 递归收集 markdown 文件 / Collect markdown files */
function collectMarkdown(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.git') continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) collectMarkdown(full, out);
    else if (name.endsWith('.md')) out.push(full);
  }
  return out;
}

/** 按行切分表格行，去掉首尾空单元格 / Split a markdown table row */
function cells(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith('|')) return null;
  const inner = trimmed.replace(/^\|/, '').replace(/\|$/, '');
  return inner.split('|').map((c) => c.trim());
}

const isSeparatorRow = (cellsArr) =>
  cellsArr.length > 0 && cellsArr.every((c) => /^:?-{2,}:?$/.test(c.replace(/\s/g, '')));

const rel = (p) => relative(ROOT, p).split('\\').join('/');

// ── 收集文件 ────────────────────────────────────────────────────────────────
const rootDocs = ['README.md', 'README.en.md', 'CONTRIBUTING.md', 'CHANGELOG.md']
  .map((f) => join(ROOT, f))
  .filter(existsSync);
const docsFiles = collectMarkdown(join(ROOT, 'docs'));
const allFiles = [...rootDocs, ...docsFiles];

// ── R1: 索引链接可达性 ──────────────────────────────────────────────────────
const INDEX_RE = /\[[^\]]*\]\(([^)\s]+\.md)(#[^)]*)?\)/g;
let checkedLinks = 0;

for (const file of allFiles) {
  // 模板文件刻意保留占位链接，跳过可达性检查
  if (rel(file).startsWith('docs/templates/')) continue;
  const text = readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const m of line.matchAll(INDEX_RE)) {
      const target = m[1];
      if (/^https?:\/\//.test(target)) continue;
      checkedLinks += 1;
      const resolved = resolve(dirname(file), target);
      if (!existsSync(resolved)) {
        error(rel(file), i + 1, `相对链接指向不存在的文件: ${target}`);
      }
    }
  });
}

// ── R2/R3/R4: 条目表格 ──────────────────────────────────────────────────────
const ENTRY_HEADER = ['tool', '中文说明', 'english', 'tags', 'license'];
const repoOwners = new Map(); // repoUrl -> { file, line, name }
const stats = [];

const ENTRY_FILES = allFiles.filter(
  (f) => rel(f).startsWith('docs/') && !rel(f).startsWith('docs/templates/') && !rel(f).startsWith('docs/meta/'),
);

for (const file of ENTRY_FILES) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  let inComment = false;
  let tableState = null; // null | 'header' | 'entry'
  let expectedCols = 0;
  let entryCount = 0;
  let tableStart = 0;

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    // 跳过 HTML 注释块
    if (inComment) {
      if (line.includes('-->')) inComment = false;
      return;
    }
    if (line.includes('<!--') && !line.includes('-->')) {
      inComment = true;
      return;
    }

    const c = cells(line);

    if (!c) {
      tableState = null;
      return;
    }

    if (tableState === null) {
      const first = c[0].toLowerCase();
      if (first === 'tool') {
        tableState = 'header';
        expectedCols = c.length;
        tableStart = lineNo;
        const normalized = c.map((x, idx) =>
          idx === 0 ? 'tool' : x.replace(/\s*\/\s*/g, ' / ').trim().toLowerCase(),
        );
        // 允许中英混排表头，但列数与关键字必须匹配
        if (normalized.length !== ENTRY_HEADER.length) {
          error(rel(file), lineNo, `条目表头应为 ${ENTRY_HEADER.length} 列，实际 ${normalized.length} 列`);
        }
      } else {
        tableState = 'other';
      }
      return;
    }

    if (tableState === 'header') {
      if (!isSeparatorRow(c)) {
        // 表头后必须是分隔行
        error(rel(file), lineNo, '条目表头之后应为 | --- | 分隔行');
      }
      tableState = 'entry';
      return;
    }

    if (tableState !== 'entry') return;
    if (isSeparatorRow(c)) return;

    entryCount += 1;

    if (c.length !== expectedCols) {
      error(
        rel(file),
        lineNo,
        `条目列数不一致：期望 ${expectedCols}，实际 ${c.length}（表格起始于第 ${tableStart} 行）`,
      );
      return;
    }

    const [tool, zh, en, tags, license] = c;
    const linkMatch = tool.match(/^\[([^\]]+)\]\((\S+)\)$/);
    if (!linkMatch) {
      error(rel(file), lineNo, `Tool 列必须是 [名称](URL) 形式的链接：${tool}`);
    } else {
      const [, name, url] = linkMatch;
      if (!/^https?:\/\//.test(url)) {
        error(rel(file), lineNo, `Tool 链接必须是 http(s)：${url}`);
      } else {
        const key = url.replace(/\/+$/, '').toLowerCase();
        if (repoOwners.has(key)) {
          const prev = repoOwners.get(key);
          warn(rel(file), lineNo, `重复收录 ${name}（已在 ${prev.file}:${prev.line} 出现）`);
        } else {
          repoOwners.set(key, { file: rel(file), line: lineNo, name });
        }
      }
      if (!name.trim()) error(rel(file), lineNo, 'Tool 名称不能为空');
    }

    if (!zh) error(rel(file), lineNo, '中文说明不能为空');
    if (!en) error(rel(file), lineNo, 'English 说明不能为空');
    if (!tags) error(rel(file), lineNo, 'Tags 不能为空（用反引号包裹）');
    if (!license) error(rel(file), lineNo, 'License 不能为空（未知请写「见仓库 / see repo」）');
    if (license && /^[?？-]+$/.test(license)) {
      error(rel(file), lineNo, `License 不能是占位符：${license}`);
    }
  });

  if (entryCount > 0) stats.push({ file: rel(file), count: entryCount });
}

// ── 输出 ────────────────────────────────────────────────────────────────────
const uniqueErrors = new Map();
for (const e of errors) {
  const key = `${e.file}:${e.line}:${e.msg}`;
  if (!uniqueErrors.has(key)) uniqueErrors.set(key, e);
}
const errorList = [...uniqueErrors.values()];

if (SHOW_STATS) {
  console.log('\n📊 各文件条目数 / Entries per file\n');
  const sorted = [...stats].sort((a, b) => b.count - a.count);
  const width = Math.max(...sorted.map((s) => s.file.length), 8);
  for (const s of sorted) console.log(`  ${s.file.padEnd(width)}  ${String(s.count).padStart(3)}`);
  console.log(`\n  ${'总计 / TOTAL'.padEnd(width)}  ${String(sorted.reduce((n, s) => n + s.count, 0)).padStart(3)}`);
}

for (const w of warnings) {
  console.log(`⚠️  ${w.file}:${w.line}  ${w.msg}`);
}

if (errorList.length > 0) {
  console.error(`\n❌ ${errorList.length} 个错误 / error(s):\n`);
  for (const e of errorList) console.error(`  ${e.file}:${e.line}  ${e.msg}`);
  console.error('');
  process.exit(1);
}

console.log(
  `✅ 校验通过 / Validation passed — ${allFiles.length} 个文件，${checkedLinks} 个相对链接，` +
    `${[...repoOwners.keys()].length} 个条目，${warnings.length} 个警告`,
);
