# 🧠 AI · 智能体运行时与编排 / Agent Runtimes & Orchestration

> 智能体本身只是「模型 + 循环」。让它真正能干活的，是**工具协议**（MCP）、
> **宿主**（谁能调用工具）和**编排**（谁决定下一步做什么）。
> 本节的工具用来搭建、调试和托管这三层。

## 精选 / Top picks

- **[MCP Inspector](https://github.com/modelcontextprotocol/inspector)** —— 写 MCP
  server 时的第一个工具：可视化列出工具、资源和提示，手动调用看返回。
  **代价**：它是调试器，不是生产组件。
- **[FastMCP](https://github.com/jlowin/fastmcp)** —— 用 Python 写 MCP server 最快
  的路径，装饰器风格，类型注解直接变成工具 schema。**代价**：绑定 Python 生态。
- **[claude-code-router](https://github.com/musistudio/claude-code-router)** —— 不改
  客户端就换模型/加路由（例如按任务类型分发到大模型或本地模型）。
  **代价**：多一层代理，出问题时要查两层日志。
- **[Temporal CLI](https://github.com/temporalio/cli)** —— 需要**可靠重试**的长流程
  编排时的成熟选择，比自己写状态机稳。**代价**：概念（workflow/activity）需要
  花时间理解，小脚本不值当。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [MCP Inspector](https://github.com/modelcontextprotocol/inspector) | 交互式调试 MCP server：浏览工具/资源、手动调用、查看原始报文 | Interactive MCP server debugger: browse tools/resources, invoke, inspect raw messages | `node`, `mcp`, `debug` | MIT |
| [FastMCP](https://github.com/jlowin/fastmcp) | 用装饰器与类型注解快速实现 MCP server 与客户端 | Rapidly build MCP servers and clients with decorators and type hints | `python`, `mcp`, `framework` | Apache-2.0 |
| [MCP Servers (官方合集)](https://github.com/modelcontextprotocol/servers) | 官方参考实现合集，也是写自己 server 时最好的模板 | Official reference implementations, the best starting template for your own server | `mcp`, `reference`, `examples` | MIT |
| [claude-code-router](https://github.com/musistudio/claude-code-router) | 为编码智能体加一层路由，按场景切换模型或转发到本地模型 | Adds a routing layer so coding agents can switch models per scenario | `node`, `ai`, `proxy`, `mcp` | MIT |
| [LangGraph CLI](https://github.com/langchain-ai/langgraph) | 用图结构编排有状态智能体，CLI 负责本地起服务与调试 | Orchestrate stateful agents as graphs, with a CLI for local servers and debugging | `python`, `ai`, `framework`, `orchestration` | MIT |
| [Temporal CLI](https://github.com/temporalio/cli) | 可靠、可重试的长流程编排，适合把智能体步骤当活动执行 | Durable, retryable long-running orchestration, good for agent steps as activities | `go`, `orchestration`, `reliability` | MIT |
| [Dagger](https://github.com/dagger/dagger) | 把构建/测试流水线写成可缓存的代码，供智能体安全调用 | Write build/test pipelines as cacheable code that agents can call safely | `go`, `ci`, `containers`, `pipeline` | Apache-2.0 |
| [n8n](https://github.com/n8n-io/n8n) | 以 CLI 启动的自托管自动化平台，常被当作智能体的触发器 | Self-hosted automation platform started via CLI, often used as an agent trigger | `node`, `automation`, `self-hosted` | 见仓库 / see repo |

## 组合用法 / Combinations

```bash
# 1) 本地调试一个 MCP server：先看它暴露了什么，再接进宿主
npx -y @modelcontextprotocol/inspector npx -y my-mcp-server

# 2) 把调试通过的 server 交给宿主
claude mcp add my-server -- npx -y my-mcp-server
claude mcp list

# 3) 用路由层把「重活」发给大模型、「轻活」发给本地模型
#    先在 ~/.claude-code-router/config.json 里定义路由规则，然后：
ccr start && ccr code "重构这个模块"

# 4) 用容器把智能体的执行环境关起来，工具再多也不怕
docker run --rm -it --network none -v "$PWD":/work -w /work node:20
```

## 注意事项 / Notes

- **MCP server 是「能被模型调用的代码」，等于给它开了后门**。只挂载你信任的
  server；带文件写入、shell 执行能力的 server 要在受限环境里跑。
- 传输方式要分清：`stdio` 用于本地子进程，HTTP/SSE 用于远程。远程 server
  必须自己加认证，协议本身不负责鉴权。
- 编排层的价值在**失败处理**（重试、超时、补偿），不在「画流程图」。
  只跑一次、不需要重试的流程，用 shell 脚本更简单。
- 自托管平台（如 n8n）会监听端口并保存执行历史，部署前确认数据落盘位置。

## 相关 / See also

- [编程智能体](../ai-cli/coding-agents.md) —— 这些运行时的消费方
- [本地推理](../ai-cli/local-inference.md) —— 路由的常见目标
- [内容平台客户端](../general/platform-clients.md) —— 给 Agent 装上手之后，用它去操作真实平台（如 `lark-cli`）
- [云与容器](../general/cloud-and-containers.md) —— 隔离执行环境
- [安全与加密](../general/security.md) —— 密钥与凭据管理
