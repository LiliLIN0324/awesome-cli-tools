# ripgrep · ripgrep

> 递归搜索文件内容的现代 `grep`。默认遵守 `.gitignore`、跳过二进制文件、
> 自动识别 UTF-16，并且速度通常比 `grep -r` 快一个数量级。

## 速览 / At a glance

| 项目 | 内容 |
| --- | --- |
| 仓库 / Repo | https://github.com/BurntSushi/ripgrep |
| 官网 / Site | https://github.com/BurntSushi/ripgrep |
| 许可 / License | MIT OR Unlicense |
| 语言 / Language | Rust |
| 平台 / Platform | macOS, Linux, Windows |
| 分类 / Category | [docs/general/search.md](../general/search.md) |
| 标签 / Tags | `rust`, `grep`, `pipe-friendly`, `cross-platform` |
| 最后复核 / Last reviewed | 2026-10 |

## 为什么值得收录 / Why it's here

`grep -r` 有三个长期问题：默认会搜进 `node_modules` 和 `.git`、默认不忽略
二进制、默认不支持正则的现代语法（除非加 `-P`）。ripgrep 把「开发者真正想要
的默认值」做成了默认值，同时保留了完整的开关让你回到 `grep` 的行为。

它最值得用的地方不是快，而是**不需要反复加 `--exclude-dir`**。在一万次搜索里，
省下的输入比省下的毫秒更值钱。

什么时候别用：需要 POSIX 严格兼容的脚本（`grep` 在最小化容器里一定存在，
ripgrep 不一定）；需要 `grep` 特有的 `-z`/`--mmap` 语义；或者你其实想搜的是
**文件名**而不是内容 —— 那属于 `fd`/`rg --files` 的领域。

## 安装 / Install

优先用系统包管理器（更新及时、有签名）：

```bash
# macOS
brew install ripgrep

# Debian / Ubuntu（注意：发行版仓库里的版本可能偏旧）
apt-get install ripgrep

# Fedora / RHEL
dnf install ripgrep

# Arch
pacman -S ripgrep

# Windows
winget install BurntSushi.ripgrep.MSVC
scoop install ripgrep

# Rust 生态（需要工具链）
cargo install ripgrep
```

验证：

```bash
rg --version
```

## 常用命令 / Common usage

```bash
# 递归搜索，输出行号
rg -n 'pattern'

# 忽略大小写；智能大小写（有大小写则区分）用 -S
rg -i 'pattern'
rg -S 'Pattern'

# 只看文件名，不看匹配行
rg -l 'pattern'

# 只看匹配到的片段（便于管道二次处理）
rg -o 'v[0-9]+\.[0-9]+\.[0-9]+'

# 按文件类型过滤：只搜 JS/TS，或排除某类
rg -t js -t ts 'useEffect'
rg -T js 'TODO'            # 反选

# 用 glob 排除/包含（覆盖默认忽略规则）
rg 'secret' -g '!*.min.js' -g '!vendor/**'
rg 'pattern' --hidden        # 也搜索 .env 这类隐藏文件
rg 'pattern' -uu             # 完全不遵守忽略规则（慎用，会进 .git 与 node_modules）

# 上下文：后 2 行、前 3 行、前后 2 行
rg -A 2 'panic'
rg -B 3 'panic'
rg -C 2 'panic'

# 列出可用类型名（写 -t 参数时查这个）
rg --type-list | head -40

# 只列出会被搜索到的文件（替代 find）
rg --files
rg --files -g '*.md'

# 多行匹配：跨行匹配整个函数体（-U 打开多行模式）
rg -U 'fn \w+\([\s\S]*?\n\}'

# 机器可读输出（每行一个 JSON 对象）
rg --json 'pattern' | jq -r 'select(.type=="match") | .data.path.text'

# 用词边界 + 固定字符串（不用正则，防止特殊字符被解释）
rg -w -F 'a.b(c)'
```

## 配置 / Configuration

默认值已经足够好，唯一值得加的是一个配置文件，用来固化团队/个人偏好。

| 文件 | 用途 |
| --- | --- |
| `$RIPGREP_CONFIG_PATH` 指向的文件（惯例 `~/.ripgreprc`） | 每次运行自动附加的默认参数 |

```bash
# ~/.ripgreprc
# 总是显示行号与列号
--line-number
--column

# 尊重 NO_COLOR / 管道时不着色
--color=auto

# 隐藏目录里仍要搜的（例如 CI 配置）
--hidden
--glob=!.git/

# 自定义类型，方便 -t 使用
--type-add=web:*.{html,css,js,ts,tsx,jsx}
```

启用：

```bash
export RIPGREP_CONFIG_PATH="$HOME/.ripgreprc"
```

注意：配置文件里的参数会在命令行参数**之前**生效，所以命令行仍然可以覆盖它。

## 与同类工具的取舍 / Alternatives & trade-offs

| 工具 | 优势 | 劣势 / 什么时候别选 |
| --- | --- | --- |
| ripgrep | 默认忽略规则正确、速度快、`--json` 好接管道、跨平台 | 不是 POSIX `grep`，脚本可移植性差；正则语法与 GNU grep 有差异 |
| GNU grep | 任何环境都有、POSIX 兼容、行为稳定 | 默认不递归不忽略，需要一堆 `--exclude-dir`；PCRE 需要显式 `-P` |
| git grep | 只搜 Git 跟踪的文件，天然忽略未跟踪垃圾 | 只能搜 Git 仓库；历史搜索需要额外参数 |
| ag（The Silver Searcher） | 曾经是主流，输出友好 | 基本停止维护，性能与现代默认值都被 ripgrep 超过 |

## 坑与注意事项 / Caveats

- **退出码**：`0` = 至少一处匹配，`1` = 无匹配，`2` = 出错。
  这意味着 `rg pattern || echo "not found"` 是可行的，但在 `set -e` 脚本里
  无匹配会让脚本失败 —— 用 `rg pattern || true` 或 `if rg -q pattern; then`。
- **`-uu` 很危险**：它会连 `.git`、`node_modules`、`.venv` 一起搜，输出量爆炸；
  要搜隐藏文件但保留忽略规则，用 `--hidden` 而不是 `-uu`。
- **正则语法**：默认是 Rust 正则引擎，不支持后行断言等特性；需要 PCRE2 功能
  用 `-P`（但会慢一些，且不再保证线性时间）。
- **大文件**：默认会跳过二进制文件。要强制搜二进制用 `-a`（会把终端刷爆，
  先重定向到文件）。
- **`-o` 与 `--json` 不要混用**后再去猜列号，`--json` 里 offsets 是字节偏移，
  在多字节字符（中文）文件中与列号不同。
- **跨平台换行**：搜 Windows 上生成的 CRLF 文件时，行尾可能带 `\r`，
  用 `-o` 提取出来的值需要 `.trim()`。

## 参考 / References

- 官方用户指南：https://github.com/BurntSushi/ripgrep/blob/master/GUIDE.md
- MAN 页（含完整 flag 列表）：https://man.archlinux.org/man/rg.1
- 相关条目：[fd](../general/search.md)（尚未撰写深度页）、
  [docs/general/search.md](../general/search.md)
