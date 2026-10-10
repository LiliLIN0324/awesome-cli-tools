#!/usr/bin/env node
/**
 * 替换仓库所有者占位符 / Replace the owner placeholder
 *
 * 用于 fork 或复用本仓库时，把文档里的所有者占位符一次性改掉。
 * 显式以 UTF-8 读写，避免 Windows PowerShell 的默认编码破坏中文。
 *
 * 用法 / Usage:
 *   node scripts/set-owner.mjs <owner>            # 替换并写入
 *   node scripts/set-owner.mjs <owner> --dry-run  # 只列出会改哪些文件
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
// 拆开写，避免本脚本在批量替换时把自己也改掉
const PLACEHOLDER = ['<your', 'org>'].join('-');

const [, , owner, ...rest] = process.argv;
const DRY_RUN = rest.includes('--dry-run');

if (!owner || owner.startsWith('-')) {
  console.error('用法 / Usage: node scripts/set-owner.mjs <owner> [--dry-run]');
  process.exit(2);
}
if (!/^[A-Za-z0-9-]+$/.test(owner)) {
  console.error(`❌ owner 只能包含字母、数字与连字符：${owner}`);
  process.exit(2);
}

const EXTENSIONS = new Set(['.md', '.yml', '.yaml', '.json', '.mjs']);
const SKIP_DIRS = new Set(['.git', 'node_modules']);

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTENSIONS.has(name.slice(name.lastIndexOf('.')))) out.push(full);
  }
  return out;
}

let changed = 0;
let occurrences = 0;

for (const file of walk(ROOT)) {
  const text = readFileSync(file, 'utf8');
  if (!text.includes(PLACEHOLDER)) continue;

  const count = text.split(PLACEHOLDER).length - 1;
  const display = relative(ROOT, file).split('\\').join('/');
  const next = text.split(PLACEHOLDER).join(owner);

  if (DRY_RUN) {
    console.log(`• ${display}  (${count} 处)`);
  } else {
    writeFileSync(file, next, 'utf8');
    console.log(`✅ ${display}  (${count} 处)`);
  }
  changed += 1;
  occurrences += count;
}

if (changed === 0) {
  console.log(`没有发现 ${PLACEHOLDER}，无需修改 / Nothing to replace.`);
} else {
  console.log(
    `\n${DRY_RUN ? '将修改' : '已修改'} ${changed} 个文件，共 ${occurrences} 处 → ${owner}`,
  );
}
