# 仓库初始化清单 / Repo Setup Checklist

> 这份文档只在一个新克隆/新仓库上需要执行一次。执行完可以保留，
> 也可以删掉（删的时候记得同时删掉 README 里的链接）。

## 1. 替换所有者占位符（本仓库已完成）

本仓库的所有者已设置为 **LiliLIN0324**。

如果你是 **fork 或 clone 后复用**这个模板，用自带脚本一次性改掉占位符
（显式 UTF-8 读写，不会像 PowerShell 的 `-replace` 那样中英混排时破坏编码）：

```bash
# 先预览会改哪些文件
node scripts/set-owner.mjs YOUR_ORG --dry-run

# 确认后写入
node scripts/set-owner.mjs YOUR_ORG
```

脚本会替换以下位置（共 12 处，分布在 5 个文件）：

| 文件 | 位置 |
| --- | --- |
| `README.md` / `README.en.md` | `git clone` 示例 |
| `.github/ISSUE_TEMPLATE/config.yml` | `contact_links` 的 URL 与注释 |
| `docs/meta/repo-setup.md` | 本节示例 |
| `scripts/set-owner.mjs` | 脚本自身文档（常量已拆开写，不会被自替换） |

> ⚠️ 不要用 Windows PowerShell 5.1 的 `Get-Content`/`Set-Content` 做这件事：
> 它默认按 ANSI 读写，会把中文变成乱码。用上面的脚本，或者
> `Set-Content -Encoding utf8` 显式指定编码。

## 2. 本地首次提交

```bash
cd awesome-cli-tools
git init -b main
git add -A
git commit -m "chore: initial commit of awesome-cli-tools"

# 本地自检（零依赖，不需要 npm install）
node scripts/validate-entries.mjs --stats
```

## 3. 创建远程仓库并推送

两种方式任选：

```bash
# A) 有 gh CLI（推荐，会顺带设置 remote）
gh repo create awesome-cli-tools --public --source=. --remote=origin --push

# B) 纯 git（先在网页上建好空仓库，不要勾选 README/LICENSE）
git remote add origin https://github.com/LiliLIN0324/awesome-cli-tools.git
git push -u origin main
```

> 网络不稳时的技巧：若直连被重置，可临时覆盖代理而不改全局配置：
> `git -c http.version=HTTP/1.1 push -u origin main`

## 4. 仓库设置

| 项 | 建议值 | 为什么 |
| --- | --- | --- |
| Topics | `awesome-list`, `cli`, `command-line`, `ai-cli`, `developer-tools`, `zh-cn` | 唯一的免费发现渠道 |
| Description | 精选命令行工具文档库，中英双语，结构化可校验 | 一句话说清 + 关键词 |
| Website | 可留空，或指向 `docs/` 的渲染页 | |
| Features → Issues | 开启 | 收录建议走 issue |
| Features → Discussions | 可选开启 | 「这个工具好不好」类讨论放这里 |
| Features → Wiki | 关闭 | 文档已在仓库里，避免双份真相 |

## 5. 分支保护（可选但推荐）

`Settings → Branches → Add rule`（`main`）：

- ✅ Require a pull request before merging
- ✅ Require status checks to pass → 选择 **Validate entries**
- ❌ 不要要求 **Check external links** 必须通过（外链会因网络波动误报，
  工作流里已设 `continue-on-error`）

## 6. Actions

- 推送到 `main` 后确认 `CI` 工作流运行成功。
- 工作流**没有任何依赖安装步骤**（零依赖脚本），所以不需要缓存配置。
- 外链巡检只在 push / 手动触发时运行，PR 上不跑，避免贡献者被限流误导。

## 7. 可选：发布为网页

`docs/` 目录本身就是可读的 Markdown。若想要一个好看的站点：

- **最简单**：`Settings → Pages` 选 `main` 分支的 `/docs` 目录
  —— 但根 `README.md` 不在 `docs/` 下，需要额外做一个入口文件。
- **更完整**：用 MkDocs Material 或 VitePress 渲染。这需要把内容从
  `docs/` 迁移或加一层配置，属于后续可选项，不影响当前结构。

## 8. 首次贡献者体验自检

把自己当成陌生人走一遍：

- [ ] 打开 README，30 秒内能知道「这是什么、怎么开始用」
- [ ] 想加一个工具时，能在 2 次点击内找到分类文件和模板
- [ ] 本地跑 `node scripts/validate-entries.mjs` 无需安装任何依赖
- [ ] 报错信息能指出**具体文件与行号**
- [ ] PR 模板里的检查清单与 CI 实际检查项一致（不一致会让人困惑）

## 相关 / See also

- [收录标准](./criteria.md) —— 什么内容会被接受
- [分类体系](./taxonomy.md) —— 新条目放哪里
- [贡献指南](../../CONTRIBUTING.md) —— 提交格式要求
