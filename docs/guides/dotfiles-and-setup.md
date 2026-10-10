# 搭建终端环境 / Building a Terminal Environment

> 从零开始换一套顺手的 CLI 环境。核心原则：**分批引入、每批可回退**。
> 一次改十几个工具的结果是不知道哪天开始 shell 变慢了。

## 0. 先建立安全网

```bash
# dotfiles 用 Git 管起来（这是本指南最重要的一步）
mkdir -p ~/dotfiles && cd ~/dotfiles && git init
cp ~/.zshrc ~/dotfiles/zshrc      # 或 .bashrc
git add -A && git commit -m "chore: snapshot before refactor"
```

后续每次改配置都 `git commit`，出问题 `git diff` / `git checkout -- .` 即可。

> 注意：**不要把密钥放进 dotfiles**。用 `direnv` 或密钥管理器注入，
> 见 [安全与加密](../general/security.md)。

## 1. 第 1 批：观察型工具（零风险）

只读类替换，随时可以退回原命令。

| 原命令 | 替换 | 收益 |
| --- | --- | --- |
| `cat` | [bat](../general/viewers.md) | 语法高亮，读日志快 |
| `ls` | [eza](../general/viewers.md) | 树状、Git 状态 |
| `grep -r` | [ripgrep](../tools/ripgrep.md) | 默认忽略规则正确 |
| `find` | [fd](../general/search.md) | 语法短、默认并行 |
| `git diff` | [delta](../general/viewers.md) | 并排视图与高亮 |

```bash
# 别名（zsh）
alias cat='bat --paging=never'
alias ls='eza --group-directories-first'
alias ll='eza -alh --git'
alias grep='rg'          # ⚠️ 注意：脚本里请用 `command grep`
```

**坑**：给 `cat`/`grep` 加别名后，管道里的行为会变（高亮注入）。
在脚本中始终写 `command grep` 或直接 `rg`，不要依赖别名。

## 2. 第 2 批：提示符与导航

```bash
# ~/.zshrc
eval "$(starship init zsh)"
eval "$(zoxide init zsh)"
eval "$(atuin init zsh)"
```

配置提示符时关注**延迟**：

```bash
# 测量 shell 启动时间（连续跑，看波动）
for i in 1 2 3; do
  /usr/bin/time -f '%e s' zsh -i -c exit
done
```

超过 ~150ms 就该精简提示符模块或检查哪些插件在每次启动时联网。

## 3. 第 3 批：交互增强

```bash
# 模糊查找三件套（fzf 是很多工具的前置依赖）
export FZF_DEFAULT_COMMAND='fd --type f --hidden --exclude .git'
export FZF_CTRL_T_OPTS="--preview 'bat --color=always {}'"

# 统一补全
eval "$(carapace _carapace zsh)"
```

## 4. 第 4 批：项目级自动化

- 用 [just](../general/dev-workflow.md) 或 `task` 给项目加一个统一入口，
  避免「每个仓库跑法都不一样」。
- 用 [direnv](../general/dev-workflow.md) 管环境变量。
- 用 [pre-commit](../general/dev-workflow.md) 管提交钩子，统一格式化与扫描。

```bash
# .envrc（会被自动加载，克隆陌生仓库时先读一遍再 direnv allow）
export NODE_ENV=development
layout node
```

## 5. 第 5 批：终端复用

```bash
tmux new -As main          # 会话持久化，SSH 掉线不丢工作
```

`tmux`/`zellij` 的配置建议放在 dotfiles 里，并做平台条件分支
（剪贴板、`$TERM`、字体）。

## 跨平台注意事项

| 场景 | 建议 |
| --- | --- |
| macOS + Linux 共用 dotfiles | 用 `uname` / `$OSTYPE` 分支，避免只在一端存在的命令 |
| Windows | 优先 WSL 里跑这套；原生 PowerShell 需另配（别名语法不同） |
| 服务器上没装新工具 | 让别名**优雅降级**：`alias cat='bat 2>/dev/null \|\| cat'` 之类 |
| 公司机器不能装东西 | 只做纯 shell 的改动（提示符用纯函数实现、历史用 `fzf` 的离线版） |

## 检查清单

- [ ] dotfiles 已纳入 Git，且**不含密钥**
- [ ] shell 启动时间已测量，改动前后有对比
- [ ] 每个别名都有逃生路径（`command` / `\` 前缀）
- [ ] 服务器环境下所有别名都能降级或跳过
- [ ] 新增工具都能被 `--help` 和 README 说清楚用途
- [ ] 配置集中在家目录的少数几个路径（便于备份与迁移）

## 相关 / See also

- [如何评测一个 CLI](./evaluate-a-cli.md) —— 决定是否引入某个工具的流程
- [Shell 与提示符](../general/shell-and-prompt.md) —— 本指南用到的工具
- [开发工作流](../general/dev-workflow.md) —— 项目级自动化
