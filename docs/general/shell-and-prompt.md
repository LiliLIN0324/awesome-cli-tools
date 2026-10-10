# 🐚 Shell 与提示符 / Shell & Prompt

> 提示符、目录跳转、命令历史、Shell 本体与终端复用。
> 这是**一次性投入、长期收益**的一类：配置好之后的收益体现在每一次回车。

## 精选 / Top picks

- **[starship](https://github.com/starship/starship)** —— 跨 Shell 的提示符，
  用一份 TOML 配置，开箱即用地显示 Git 状态、语言版本、耗时。
  **代价**：为「每条提示符都要跑一遍」的进程，在慢速机器上需要调
  `command_timeout` 或精简模块。
- **[zoxide](https://github.com/ajeetdsouza/zoxide)** —— 用 `z 关键词` 跳到
  常去的目录，按访问频率自动学习。**代价**：需要几天适应期，
  且 `zi` 的交互选择依赖 `fzf`。
- **[atuin](https://github.com/atuinsh/atuin)** —— 把历史记录存进 SQLite，
  支持 `Ctrl-R` 模糊搜索、按目录/退出码过滤，可选端到端加密同步。
  **代价**：⚠️ 默认会上报匿名使用统计（可关）；同步功能需要账号。
- **[tmux](https://github.com/tmux/tmux)** —— 终端复用的事实标准：
  断开 SSH 也不丢会话，多窗口多分屏。**代价**：快捷键需要记忆曲线，
  配置文件建议纳入 dotfiles 版本管理。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [starship](https://github.com/starship/starship) | 跨 Shell 的可定制提示符，单文件 TOML 配置 | Cross-shell customizable prompt driven by a single TOML file | `rust`, `prompt`, `cross-shell` | ISC |
| [zoxide](https://github.com/ajeetdsouza/zoxide) | 按访问频率跳转目录，替代反复 `cd` | Jumps to directories by frecency, replacing repeated `cd` | `rust`, `navigation`, `shell` | MIT |
| [atuin](https://github.com/atuinsh/atuin) | SQLite 支撑的 shell 历史，支持模糊搜索与可选加密同步 | SQLite-backed shell history with fuzzy search and optional E2E sync | `rust`, `history`, `search`, `telemetry` | MIT |
| [fish](https://github.com/fish-shell/fish-shell) | 开箱即用的交互式 Shell：自动建议、语法高亮、补全 | Batteries-included interactive shell: autosuggestions, highlighting, completions | `c++`, `shell`, `interactive` | GPL-2.0 |
| [Nushell](https://github.com/nushell/nushell) | 结构化数据的 Shell，管道传递的是表而不是文本 | A structured-data shell where pipelines carry tables, not text | `rust`, `shell`, `structured-data` | MIT |
| [tmux](https://github.com/tmux/tmux) | 终端复用器：会话持久化、分屏与脚本化窗口管理 | Terminal multiplexer with persistent sessions, panes and scripting | `c`, `terminal`, `multiplexer` | ISC |
| [Zellij](https://github.com/zellij-org/zellij) | 对新手更友好的终端复用器，内置提示与可恢复会话 | Friendlier terminal multiplexer with on-screen hints and session resurrection | `rust`, `terminal`, `multiplexer` | MIT |
| [mise](https://github.com/jdx/mise) | 统一的运行时/工具版本管理器，替代 asdf 与部分 nvm/pyenv 场景 | Unified runtime and tool version manager, replacing asdf and parts of nvm/pyenv | `rust`, `versions`, `env` | MIT |
| [asdf](https://github.com/asdf-vm/asdf) | 插件式的多语言版本管理，生态与插件数量大 | Plugin-based multi-language version manager with a large plugin ecosystem | `shell`, `versions`, `plugin-system` | MIT |
| [thefuck](https://github.com/nvbn/thefuck) | 命令报错后输入 `fuck` 自动给出修正并执行 | Suggests and runs a corrected command after a typo via `fuck` | `python`, `shell`, `productivity` | MIT |
| [carapace](https://github.com/carapace-sh/carapace-bin) | 为上百个命令提供一致的补全，终结「每个工具补全配置都不同」 | Consistent completions for hundreds of commands across shells | `go`, `completion`, `shell` | MIT |
| [Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh) | zsh 的配置框架与插件合集，降低初始配置成本 | Configuration framework and plugin bundle for zsh | `shell`, `zsh`, `framework` | MIT |

## 组合用法 / Combinations

```bash
# 1) 提示符 + 跳转 + 历史：日常效率的三个基本盘
# ~/.zshrc
eval "$(starship init zsh)"
eval "$(zoxide init zsh)"
eval "$(atuin init zsh)"

z proj            # 跳到最常去的 proj* 目录
z -               # 回到上一个目录
# Ctrl-R 走 atuin 的模糊搜索

# 2) 用 fzf 给 zoxide 提供交互选择
export _ZO_FZF_OPTS='--height 40% --preview "eza --tree --level=1 {}"'
zi

# 3) tmux：SSH 断开也不丢工作
tmux new -As work        # 有则 attach，无则新建
# Ctrl-b d 分离；下次 tmux a -t work 继续

# 4) 新机器上一条命令装齐运行时版本
mise install && mise use node@22 python@3.12

# 5) 补全统一交给 carapace，减少 per-tool 配置
eval "$(carapace _carapace zsh)"
```

## 注意事项 / Notes

- **改 Shell 配置前先备份并 `git init`**。dotfiles 用 Git 管理，
  出错时能一键回退，这比任何技巧都重要。
- **提示符会影响交互延迟**。如果感觉「按回车后要等一下」，
  先排查提示符里的外部命令（Git 状态、语言版本探测）。
- ⚠️ `atuin` 的统计上报可用 `atuin config set auto_sync false` 等配置关闭；
  同步到官方服务意味着历史记录离开本机，敏感环境请自建服务或关闭。
- **`Nushell` 不兼容 POSIX shell 脚本**。它是「更好的交互环境」，
  不是 `bash` 的替代品；别直接把 `sh` 脚本改成 `.nu`。
- `tmux` 里的 `$TERM` 与剪贴板需要配置（`set -g mouse on`、
  平台相关的 `copy-pipe`），跨平台 dotfiles 里应做条件分支。
- 自动建议/自动纠错类插件（含 `thefuck`）会**执行重构后的命令**，
  破坏性命令（`rm`、`dd`、`git reset --hard`）务必先看清楚再回车。

## 相关 / See also

- [查找与导航](search.md) —— `fzf` 是很多 Shell 工具的前置依赖
- [开发工作流](dev-workflow.md) —— `direnv` 处理环境变量
- [AI · 对话与模型调用](../ai-cli/chat-and-llm.md) —— 给模型调用设置别名
