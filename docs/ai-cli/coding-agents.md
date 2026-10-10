# 🧠 AI · 编程智能体 / Coding Agents

> 在终端里**读写代码库**的智能体：能看目录树、改文件、跑测试、执行 Git 操作。
> 与下一节的区别是：这里的工具会「动手改文件」，而不是只回答你一个问题。

## 精选 / Top picks

- **[Claude Code](https://github.com/anthropics/claude-code)** —— 工具生态最完整
  （MCP、hooks、子智能体），`CLAUDE.md` 把项目约定沉淀进仓库，团队协作体验最好。
  **代价**：专有 + 云端，按 token 计费，大仓库里让它自由探索会很贵。
- **[Aider](https://github.com/Aider-AI/aider)** —— 与 Git 的结合最干净（每次改动自动
  产生可回滚的 commit），可以自由切换模型甚至用本地模型。**代价**：自主规划弱于
  前者，更适合「你点名文件、它来改」。
- **[Goose](https://github.com/block/goose)** —— 本地运行、开源、供应商中立，
  想避开单一厂商时最省心。**代价**：配置成本高于开箱即用的商业工具。
- **[opencode](https://github.com/sst/opencode)** / **[Crush](https://github.com/charmbracelet/crush)**
  —— 终端 TUI 体验最好的一档，适合长时间盯着会话工作。**代价**：版本迭代快，
  行为可能有破坏性变更。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [Claude Code](https://github.com/anthropics/claude-code) | Anthropic 官方终端编程智能体，支持 MCP、hooks、子智能体与项目记忆文件 | Anthropic's terminal coding agent with MCP, hooks, subagents and project memory | `node`, `ai`, `agent`, `mcp`, `requires-login` | 专有 / proprietary |
| [Aider](https://github.com/Aider-AI/aider) | 在你的 Git 仓库里结对编程，每次改动自动生成可回滚提交 | AI pair programmer that commits each change to your Git repo | `python`, `ai`, `git`, `multi-model` | Apache-2.0 |
| [OpenAI Codex CLI](https://github.com/openai/codex) | OpenAI 的本地编码智能体，Rust 实现、启动快，可在沙箱内执行命令 | OpenAI's local coding agent: Rust-based, fast startup, sandboxed command execution | `rust`, `ai`, `agent`, `requires-login` | Apache-2.0 |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Google 的开源终端智能体，带较宽松的免费额度，内置搜索与文件工具 | Google's open-source terminal agent with a generous free tier and built-in tools | `node`, `ai`, `agent`, `mcp` | Apache-2.0 |
| [Qwen Code](https://github.com/QwenLM/qwen-code) | 由 Gemini CLI 分支而来、针对 Qwen 模型调优的终端智能体 | Gemini CLI fork tuned for Qwen models | `node`, `ai`, `agent` | Apache-2.0 |
| [Goose](https://github.com/block/goose) | 本地运行、可扩展的智能体，支持 MCP 与多家模型供应商 | Extensible local agent supporting MCP and multiple model providers | `rust`, `ai`, `agent`, `mcp` | Apache-2.0 |
| [opencode](https://github.com/sst/opencode) | 终端 TUI 编码智能体，可在多家模型与供应商之间路由 | TUI coding agent that routes across multiple models and providers | `tui`, `ai`, `agent`, `multi-model` | 见仓库 / see repo |
| [Crush](https://github.com/charmbracelet/crush) | Charm 出品的终端编码智能体，TUI 交互与主题做得细致 | Charm's terminal coding agent with a polished TUI and themes | `tui`, `ai`, `agent` | 见仓库 / see repo |
| [Continue CLI (cn)](https://github.com/continuedev/continue) | 把 Continue 助手带进终端与 CI，用同一套规则文件约束本地与流水线 | Brings the Continue assistant to the terminal and CI with shared rule files | `node`, `ai`, `ci`, `agent` | Apache-2.0 |
| [SWE-agent](https://github.com/SWE-agent/SWE-agent) | 面向自动修复 issue 的研究型智能体，常用于跑基准测试 | Research agent for autonomously fixing issues, often used for benchmarks | `python`, `ai`, `research` | MIT |

## 组合用法 / Combinations

```bash
# 1) 让智能体先看清仓库状态，再让它动手（避免它自己乱猜）
git status --short && git diff --stat

# 2) 用 git 做安全网：任何智能体改动都可以一键回滚
git stash push -u -m "before-agent"
# ... 智能体开始工作 ...
git diff            # 审阅
git stash drop      # 满意后丢弃备份

# 3) 非交互式跑一次，把结果接进管道做二次统计
claude -p "列出本仓库中缺少测试的源文件" --output-format json \
  | jq -r '.result' \
  | rg '\.ts$' \
  | sort

# 4) 在可丢弃的容器里放开权限，用完即删
docker run --rm -it -v "$PWD":/work -w /work node:20 bash
# 容器内安装并运行智能体，无需担心它改坏宿主机
```

## 注意事项 / Notes

- ⚠️ 这些工具会**真实修改你的工作区**。开始前保证 `git status` 是干净的，
  否则你无法区分「它的改动」和「你自己的改动」。
- 「跳过权限确认」类开关只应在容器或一次性 clone 里使用。
- 计费按 token：明确点名文件比让它全库搜索便宜得多。

## 相关 / See also

- [对话与模型调用](../ai-cli/chat-and-llm.md) —— 不想让它改文件，只想问问题
- [本地推理](../ai-cli/local-inference.md) —— 需要完全离线或私有部署
- [智能体运行时](../ai-cli/agent-runtime.md) —— MCP 与工具编排
- 深度页：[Claude Code](../tools/claude-code.md)
