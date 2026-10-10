# 👀 查看与预览 / Viewers

> 把文件、差异、Markdown、二进制内容**看清楚**。这一类工具的共同点是：
> 不改变数据，只改善你读取它的体验，而且几乎都能安全地放进管道。

## 精选 / Top picks

- **[bat](https://github.com/sharkdp/bat)** —— `cat` 的替代品，带语法高亮、
  行号、Git 改动标记。**代价**：输出给别的程序时要 `--plain`，否则会带上
  行号与装饰，破坏下游解析。
- **[delta](https://github.com/dandavison/delta)** —— 把 `git diff`
  渲染成带高亮与并排视图的样子，是 `git diff` 可读性提升最明显的一步。
  **代价**：要配置 `core.pager`，且窄终端下并排视图反而更难读。
- **[glow](https://github.com/charmbracelet/glow)** —— 在终端渲染 Markdown，
  读 README 与笔记不再靠编辑器。**代价**：复杂表格/HTML 支持有限。
- **[eza](https://github.com/eza-community/eza)** —— `ls` 的现代替代，图标、
  树状、Git 状态、按时间/大小分组。**代价**：图标字体与别名配置有一点门槛。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [bat](https://github.com/sharkdp/bat) | `cat` 的替代品，带语法高亮、行号与 Git 改动标记 | `cat` replacement with syntax highlighting, line numbers and Git markers | `rust`, `cat`, `pipe-friendly` | MIT OR Apache-2.0 |
| [delta](https://github.com/dandavison/delta) | 作为 Git pager 强化 diff 显示，支持并排视图与语法高亮 | Git pager that upgrades diffs with side-by-side views and highlighting | `rust`, `git`, `diff` | MIT |
| [glow](https://github.com/charmbracelet/glow) | 在终端渲染 Markdown，支持从标准输入直接读 | Renders Markdown in the terminal, can read straight from stdin | `go`, `markdown`, `tui` | MIT |
| [eza](https://github.com/eza-community/eza) | `ls` 的现代替代，支持树状、图标与 Git 状态列 | Modern `ls` replacement with tree mode, icons and Git status | `rust`, `ls`, `icons` | MIT |
| [yazi](https://github.com/sxyazi/yazi) | 异步文件管理器 TUI，浏览大目录不卡顿，可预览多种格式 | Async file manager TUI that stays responsive and previews many formats | `rust`, `tui`, `file-manager` | MIT |
| [nnn](https://github.com/jarun/nnn) | 轻量文件管理器，几乎零依赖，适合老旧或最小化环境 | Tiny, dependency-light file manager for minimal or old systems | `c`, `tui`, `file-manager` | BSD-2-Clause |
| [ouch](https://github.com/ouch-org/ouch) | 统一的解压/压缩命令，忘记 `tar` 参数时的救星 | One command to decompress and compress, no more `tar` flag trivia | `rust`, `archive`, `cli` | MIT OR Apache-2.0 |
| [hexyl](https://github.com/sharkdp/hexyl) | 带颜色分区的十六进制查看器，定位二进制字段方便 | Colored hex viewer that makes binary field boundaries obvious | `rust`, `hex`, `binary` | MIT OR Apache-2.0 |

## 组合用法 / Combinations

```bash
# 1) 预览用 bat，但要给下游留干净的输出
fzf --preview 'bat --style=numbers --color=always {}'
jq -r '.result' out.json | bat --plain --language=json

# 2) 让 diff 长期生效
git config --global core.pager delta
git config --global interactive.diffFilter 'delta --color-only'

# 3) 读文档不离开终端
glow README.md
curl -s https://example.com/notes.md | glow -

# 4) 忘记 tar 参数时
ouch decompress archive.tar.zst
```

## 注意事项 / Notes

- **`bat` 会自动降级为 `cat`**：当输出不是 TTY 时它不加装饰。但如果你用了
  `--color=always` 又要管道给程序，务必加 `--plain`。
- `delta` 需要 Git ≥ 2.20 的 pager 支持；同时建议设置
  `delta.navigate=true` 才能用 `n`/`N` 在 diff 块之间跳。
- 图标字体（Nerd Font）不是必须的，`eza --icons=never` 可关掉；
  CI 或日志里关掉图标能避免乱码。
- `yazi` 会写自己的状态目录（`~/.local/state/yazi`），容器里跑要注意挂载。

## 相关 / See also

- [查找与导航](search.md) —— 先用 `fd`/`rg` 找到文件
- [文本与数据](text-and-data.md) —— 结构化的内容交给 `jq` / `jless`
- [Shell 与提示符](shell-and-prompt.md) —— 用别名替换 `cat`/`ls`
