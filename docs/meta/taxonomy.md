# 分类体系 / Taxonomy

分类的目标是**按需求定位**，而不是按实现语言或作者归类。

## 顶层分类

```
docs/
├── ai-cli/        与模型交互的 CLI
│   ├── coding-agents.md        编程智能体（读写代码库、跑测试、提 PR）
│   ├── chat-and-llm.md         对话与管道式模型调用
│   ├── local-inference.md      本地模型运行与量化
│   └── agent-runtime.md        智能体宿主、MCP 协议、工具编排
├── general/       不依赖模型的通用效率工具
│   ├── search.md               查找与导航
│   ├── viewers.md              查看与预览
│   ├── text-and-data.md        文本与结构化数据处理
│   ├── dev-workflow.md         Git、任务编排、环境
│   ├── cloud-and-containers.md 容器、K8s、IaC
│   ├── network.md              网络请求与调试
│   ├── security.md             安全、密钥、签名
│   ├── media.md                音视频与图像
│   ├── platform-clients.md     内容平台客户端（视频站/社交/IM）
│   └── shell-and-prompt.md     Shell、提示符、历史
├── tools/         深度页（每个工具有独立文件）
└── meta/          规则文件（本文件、收录标准）
```

## 归类的边界规则

| 情况 | 归到哪 |
| --- | --- |
| 工具需要模型但模型可本地运行 | `local-inference.md`，标签含 `ai` |
| 工具主要是终端复用/窗口管理 | `shell-and-prompt.md` |
| Git 的 TUI 前端 | `dev-workflow.md` |
| 容器/K8s 的 TUI 前端 | `cloud-and-containers.md` |
| 针对特定内容平台的客户端（带登录态、拉详情/字幕/动态） | `platform-clients.md` |
| 只做通用转码/压缩，不关心平台 | `media.md` |
| 既能看文件又能搜内容 | 以**主要用途**为准，跨类时在两个文件各出现一次并在 `Tags` 注明 |
| 已经变成「平台」的 CLI | 仍按**命令行能做什么**分类，不按公司分类 |

**一个工具最多出现在两个分类文件中。** 超过两个说明分类粒度有问题，
应该提 issue 而不是硬塞。

## 标签规则

- 用反引号包裹，逗号加空格分隔：`` `rust`, `grep`, `pipe-friendly` ``
- 推荐标签（尽量避免自创）：
  - 语言/生态：`rust` `go` `python` `node` `c` `shell`
  - 交互形态：`tui` `repl` `one-shot` `daemon`
  - 能力：`pipe-friendly` `json-output` `cross-platform` `offline` `plugin-system`
  - 领域：`git` `grep` `k8s` `http` `media` `security` `ai` `mcp` `platform-client`
  - 状态：`archived` `proprietary` `telemetry` `requires-login`
- 标签全小写（例外：`k8s`、`mcp`、`ai` 本身就是小写缩写）。
- 不要写 `fast`、`awesome`、`best` 这类主观标签 —— 那是排序的职责。

## 小节结构约定

每个分类文件固定包含：

1. `## 精选 / Top picks` —— 3–5 条，每条一句话说明**为什么选它**和**代价是什么**。
2. `## 全部条目 / All entries` —— 5 列表格（见 [模板](../templates/tool.md)）。
3. `## 组合用法 / Combinations` —— 该分类里工具之间的管道组合示例。
4. `## 相关 / See also` —— 指向其他分类或深度页。

这样读者可以「先看结论，再看全量，再看怎么串起来」。
