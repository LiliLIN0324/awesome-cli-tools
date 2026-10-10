# 🔍 查找与导航 / Search & Navigation

> 解决「文件在哪」「这行代码在哪」「这个命令怎么用」。这一类是投入产出比最高的
> 替换：`grep`/`find`/`ls` 的使用频率决定了你每天省下多少击键。

## 精选 / Top picks

- **[ripgrep](https://github.com/BurntSushi/ripgrep)** —— 搜内容的事实标准，默认
  遵守 `.gitignore`、跳过二进制。**代价**：不是 POSIX `grep`，脚本里要留意退出码。
  见[深度页](../tools/ripgrep.md)。
- **[fd](https://github.com/sharkdp/fd)** —— 按名字找文件的现代 `find`，语法短、
  默认并行、默认忽略隐藏与版本库垃圾。**代价**：`find` 那套 `-exec`/`-newer`
  复杂表达式不完全对应，老脚本别照搬。
- **[fzf](https://github.com/junegunn/fzf)** —— 模糊查找器，本身不是搜索工具，
  而是「把任何列表变成可交互选择器」；`Ctrl-R` / `Ctrl-T` / `Alt-C` 三个绑定
  是最常见的终端体验升级。**代价**：要花点时间配 shell 集成和预览命令。
- **[zoxide](https://github.com/ajeetdsouza/zoxide)** —— 按访问频率跳目录，
  替代 `cd`，跨会话学习（条目收录在 [Shell 与提示符](shell-and-prompt.md)）。
  **代价**：需要几天习惯，且要接受「不总是跳到你想要的目录」。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [ripgrep](https://github.com/BurntSushi/ripgrep) | 递归搜索文件内容，默认遵守 `.gitignore` 并跳过二进制 | Recursive content search that respects `.gitignore` and skips binaries by default | `rust`, `grep`, `pipe-friendly` | MIT OR Unlicense |
| [fd](https://github.com/sharkdp/fd) | 按文件名查找，语法简短、默认并行、默认忽略隐藏与忽略文件 | Filename search with terse syntax, parallel traversal and smart defaults | `rust`, `find`, `pipe-friendly` | MIT OR Apache-2.0 |
| [fzf](https://github.com/junegunn/fzf) | 通用模糊查找器，可把任意列表变成交互式选择器 | General-purpose fuzzy finder that turns any list into an interactive picker | `go`, `tui`, `interactive` | MIT |
| [skim](https://github.com/skim-rs/skim) | fzf 的 Rust 重写版，可作为库嵌入，性能取向 | Rust rewrite of fzf that can be embedded as a library | `rust`, `tui`, `library` | MIT |
| [ugrep](https://github.com/Genivia/ugrep) | 功能极全的 grep 替代，支持归档文件内搜索与交互查询 | Feature-rich grep replacement with archive search and interactive query UI | `c`, `grep`, `archive` | BSD-3-Clause |
| [broot](https://github.com/Canop/broot) | 目录树浏览器，用模糊搜索代替层层 `cd` 与 `ls` | Directory tree explorer that replaces repeated `cd` and `ls` with fuzzy search | `rust`, `tui`, `navigation` | MIT |
| [tealdeer](https://github.com/tealdeer-rs/tealdeer) | `tldr` 客户端：查命令的实用示例而非完整手册 | A fast `tldr` client: practical examples instead of full man pages | `rust`, `docs`, `man` | MIT OR Apache-2.0 |
| [navi](https://github.com/denisidoro/navi) | 可交互的 cheatsheet 浏览器，从示例中直接执行命令 | Interactive cheatsheet browser that runs the selected snippet | `rust`, `cheatsheet`, `interactive` | Apache-2.0 |
| [tree](https://gitlab.com/OldManProgrammer/unix-tree) | 以树状图列出目录结构，输出可读性好 | Lists directory structure as a tree with readable output | `c`, `ls`, `report` | GPL-2.0 |
| [dust](https://github.com/bootandy/dust) | 直观显示哪个目录/文件占空间最多 | Shows which directories and files consume the most disk space | `rust`, `du`, `report` | MIT OR Apache-2.0 |

## 组合用法 / Combinations

```bash
# 1) fzf 包住 fd：交互式选文件，再交给编辑器
fd -t f | fzf --preview 'bat --color=always {}'

# 2) ripgrep 给 fzf 供数据：先把候选缩小，再人工挑
rg -l 'TODO' | fzf --multi

# 3) 在「哪个文件定义了 X」这类问题上，先定位再跳转
rg -n 'def parse_' -g '*.py'

# 4) 磁盘告急时从大到小排查
dust -r -n 20

# 5) 忘记某个命令的参数时，别翻 man，先看例子
tldr rsync
```

## 注意事项 / Notes

- **`fd` 与 `rg` 都会读 `.gitignore`**。在**不是** Git 仓库的目录里行为会不同
  （没有忽略文件可读），排查「为什么搜不到」时先确认这一点。
- `fd` 默认不列隐藏文件，需要时加 `-H`；`rg` 对应的是 `--hidden`。
- `fzf` 的 shell 集成必须显式启用（`eval "$(fzf --zsh)"` 之类），否则快捷键不存在。
- `tree`/`dust` 在大目录上输出量巨大，先 `| head` 看清楚再决定是否落盘。

## 相关 / See also

- [查看与预览](viewers.md) —— 找到文件之后怎么看
- [文本与数据](text-and-data.md) —— 找到之后怎么批量处理
- [Shell 与提示符](shell-and-prompt.md) —— `zoxide` 与快捷键集成
