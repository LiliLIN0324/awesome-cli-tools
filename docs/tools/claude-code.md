# Claude Code · Claude Code

> Anthropic 官方的终端编程智能体：在 shell 里直接读代码库、改文件、跑测试、
> 执行 Git 操作，并把「项目记忆」沉淀成仓库里的 `CLAUDE.md`。

## 速览 / At a glance

| 项目 | 内容 |
| --- | --- |
| 仓库 / Repo | https://github.com/anthropics/claude-code |
| 官网 / Site | https://docs.claude.com/en/docs/claude-code/overview |
| 许可 / License | 专有 / proprietary（使用条款见官方文档） |
| 语言 / Language | Node.js（npm 分发） |
| 平台 / Platform | macOS, Linux, Windows |
| 分类 / Category | [docs/ai-cli/coding-agents.md](../ai-cli/coding-agents.md) |
| 标签 / Tags | `node`, `ai`, `agent`, `mcp`, `requires-login` |
| 最后复核 / Last reviewed | 2026-10 |

## 为什么值得收录 / Why it's here

它是把「AI 改代码」这件事从 IDE 插件里搬到终端的一类工具的代表：工作目录就是
它的上下文，`git diff` 就是它的产出。对习惯 shell 的人来说，省掉了「在编辑器
和聊天窗口之间复制粘贴」这一步。

真正决定体验的不是模型，而是**上下文管理**：`CLAUDE.md` 让约定随仓库走、
`/compact` 控制长会话的上下文膨胀、权限模式决定它是「每次问你」还是「放手做」。

什么时候别用：需要完全离线/私有部署（它依赖 Anthropic 服务）；只是偶尔问一句
语法问题（`llm` 或 `aichat` 更轻）；或者团队不允许任何代码离开内网。

## 安装 / Install

```bash
# 官方 npm 分发（需要 Node.js 18+）
npm install -g @anthropic-ai/claude-code

# 检查
claude --version
```

首次运行会引导登录。⚠️ 需登录：使用需要 Anthropic 账号（订阅或 API 计费），
首次启动会走 OAuth 或 API Key 配置，这一步无法离线完成。

## 常用命令 / Common usage

```bash
# 进入交互式会话（在当前目录开始）
claude

# 非交互：打印回答后退出，适合脚本与 CI
claude -p "解释 src/parser.ts 的职责，一句话"

# 非交互 + 机器可读输出，便于接管道
claude -p "列出所有 TODO 并归类" --output-format json | jq -r '.result'

# 生成/刷新项目记忆文件 CLAUDE.md
claude
# 然后在会话里执行 /init

# 把当前会话压缩，回收上下文窗口
# （会话内斜杠命令，不是 shell 命令）
# /compact

# 查看本次会话的 token 与费用
# /cost

# 挂载 MCP 服务器（给智能体加工具）
claude mcp add my-server -- npx -y my-mcp-server
claude mcp list

# 危险模式：跳过所有权限确认（只在可丢弃的环境/容器里用）
claude --dangerously-skip-permissions
```

## 配置 / Configuration

| 文件 | 用途 |
| --- | --- |
| `CLAUDE.md`（仓库根） | 项目记忆：构建命令、代码规范、禁止事项。**应提交进仓库** |
| `CLAUDE.md`（`~/.claude/`） | 个人全局偏好，跨项目生效 |
| `.claude/settings.json` | 项目级设置：权限允许列表、环境变量、hooks |
| `.claude/commands/*.md` | 自定义斜杠命令 |
| `.claude/agents/*.md` | 子智能体定义（可指定不同工具权限与模型） |

`CLAUDE.md` 值得投入时间，因为它替代了「每次会话重新解释一遍项目」。

```markdown
<!-- CLAUDE.md 示例骨架 -->
## 构建
- 安装：`pnpm install`
- 测试：`pnpm test`（提交前必须通过）

## 约定
- 不要直接改 `generated/` 下的文件，改 schema 后重新生成
- 新增依赖前先说明理由

## 禁止
- 不要 force push 到 main
```

## 与同类工具的取舍 / Alternatives & trade-offs

| 工具 | 优势 | 劣势 / 什么时候别选 |
| --- | --- | --- |
| Claude Code | 官方维护、MCP 与 hooks 生态完整、`CLAUDE.md` 的约定沉淀机制好用 | 专有、依赖云端、按量计费；深度绑定 Anthropic 模型 |
| Aider | 开源、可自由切模型（含本地模型）、Git 集成紧凑 | 自主规划能力弱一些，更偏「你指定文件它改」 |
| Gemini CLI | 有慷慨的免费额度、开源 | 相对年轻，工具生态与 hooks 不如前者成熟 |
| opencode / Crush | 开源、多供应商路由 | 生态与集成仍在追赶，行为变动较快 |

## 坑与注意事项 / Caveats

- **`--dangerously-skip-permissions` 不要在有价值的目录里用**。它意味着模型可以
  直接删文件、改配置、跑任意命令。要放开就在容器或临时 clone 里放开。
- **上下文窗口是主要瓶颈**。长会话会变慢、变贵、还更容易跑偏；养成定期
  `/compact` 或干脆开新会话的习惯。
- **`-p` 的退出码**不像传统 CLI 那样语义化，脚本里判断成功与否应看输出内容或
  `--output-format json` 的结构，别只依赖退出码。
- **它会产生 Git 副作用**（提交、分支、stash）。动手前确保工作区干净，
  或者先 `git stash`，否则你分不清哪些改动是自己的。
- **计费是按 token 的**，在大型仓库里让它「自己找相关文件」会显著更贵。
  明确点名文件比让它全库探索省钱得多。
- 版本与斜杠命令更新很快，具体能力以**官方文档**为准，本页只记录稳定的用法模式。

## 参考 / References

- 官方文档：https://docs.claude.com/en/docs/claude-code/overview
- MCP 协议：https://modelcontextprotocol.io
- 相关条目：[docs/ai-cli/coding-agents.md](../ai-cli/coding-agents.md)、
  [docs/ai-cli/agent-runtime.md](../ai-cli/agent-runtime.md)
