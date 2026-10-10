# 🧠 AI · 对话与模型调用 / Chat & LLM Calls

> 把模型当成一个**命令**来用：读 stdin、写 stdout、退出。这类工具不碰你的
> 文件系统（除非你让它碰），因此非常适合放进 shell 管道和脚本。

## 精选 / Top picks

- **[llm](https://github.com/simonw/llm)** —— 设计最「Unix」的一个：`llm "问题"`
  读参数、`cat x | llm "总结"` 读管道，日志与插件系统都在 SQLite 里，
  可以随时 `llm logs` 回看。**代价**：默认只带少数供应商，要多装插件。
- **[mods](https://github.com/charmbracelet/mods)** —— 输出渲染最舒服（Markdown
  高亮、流式），适合人在终端里读。**代价**：为可读性牺牲了一些脚本友好度。
- **[aichat](https://github.com/sigoden/aichat)** —— 单文件二进制、内置角色（role）
  与 RAG、供应商覆盖广，装完就能用。**代价**：配置项多，第一次配会花点时间。
- **[fabric](https://github.com/danielmiessler/fabric)** —— 把「提示词」变成可复用
  的 pattern 库，适合把重复的分析动作固化下来。**代价**：需要接受它那套目录约定。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [llm](https://github.com/simonw/llm) | 极简的管道式模型调用，带 SQLite 日志与插件生态 | Minimal piped LLM caller with SQLite-backed logs and a plugin ecosystem | `python`, `ai`, `pipe-friendly`, `plugin-system` | Apache-2.0 |
| [aichat](https://github.com/sigoden/aichat) | 单文件二进制，内置 role、会话管理与多家供应商 | Single-binary chat client with roles, sessions and broad provider support | `rust`, `ai`, `repl`, `multi-model` | MIT OR Apache-2.0 |
| [mods](https://github.com/charmbracelet/mods) | 面向人类阅读的模型调用，Markdown 渲染与流式输出最佳 | Human-friendly LLM caller with the best Markdown rendering and streaming | `go`, `ai`, `pipe-friendly`, `tui` | MIT |
| [shell-gpt (sgpt)](https://github.com/TheR1D/shell_gpt) | 用自然语言生成 shell 命令并可选直接执行 | Generates shell commands from natural language, optionally executing them | `python`, `ai`, `shell` | MIT |
| [elia](https://github.com/darrenburns/elia) | 终端里的多会话聊天 TUI，本地保存对话与配置 | Multi-session terminal chat TUI with local history and config | `python`, `ai`, `tui` | Apache-2.0 |
| [fabric](https://github.com/danielmiessler/fabric) | 把常用提示词固化成 pattern 库，从管道输入产出结构化结果 | Turns reusable prompts into a pattern library that consumes piped input | `go`, `ai`, `pipe-friendly`, `prompt-library` | MIT |
| [gptme](https://github.com/gptme/gptme) | 带本地工具（shell、Python、文件）的小型通用智能体，可脚本化 | Small general-purpose agent with local tools (shell, Python, files) | `python`, `ai`, `agent` | MIT |
| [LiteLLM](https://github.com/BerriAI/litellm) | 统一多家供应商的代理与 CLI，是自建网关的常见底座 | Unified proxy and CLI across providers, a common self-hosted gateway | `python`, `ai`, `proxy`, `multi-model` | MIT |

## 组合用法 / Combinations

```bash
# 1) 管道：把日志喂进去做归类，不落盘
tail -n 500 app.log | llm "按错误类型归类，输出去重后的列表"

# 2) 从命令产出直接生成提交信息
git diff --staged | mods "写一条 Conventional Commits 规范的提交信息"

# 3) 结构化输出：让模型只吐 JSON，再用 jq 消费
llm --no-stream "总结这段文本为 {\"title\":..., \"tags\":[...]}" < article.md \
  | jq -r '.tags[]'

# 4) 把 shell-gpt 当作「不记得 flag 时」的检索器（不要直接执行，先看）
sgpt --shell "查找最近 7 天修改过的大于 10MB 的文件"
```

## 注意事项 / Notes

- **把「生成」和「执行」分成两步**。`sgpt --shell` 这类功能会输出可执行命令，
  先读一遍再手动运行，别开自动执行。
- ⚠️ 管道用法会把 stdin 内容发给第三方服务。日志里常带密钥、用户数据、
  内网地址 —— 用本地模型（见下节）或先脱敏。
- 多数工具支持 `--no-stream` / 非流式模式，脚本里优先用它，输出更容易解析。
- API Key 放在环境变量或系统钥匙串里，不要写进被提交的配置文件。

## 相关 / See also

- [编程智能体](../ai-cli/coding-agents.md) —— 需要它直接改文件
- [本地推理](../ai-cli/local-inference.md) —— 数据不能出内网
- [文本与数据处理](../general/text-and-data.md) —— 用 `jq` 消费模型输出的 JSON
