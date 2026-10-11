<div align="center">

# Awesome CLI Tools

**精选命令行工具文档库 · 中英双语**

A curated, bilingual (zh-CN / en) documentation hub for command-line tools.

[![License: CC0-1.0](https://img.shields.io/badge/license-CC0--1.0-lightgrey.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Node 18+](https://img.shields.io/badge/node-%3E%3D18-informational.svg)](package.json)

[中文](README.md) · [English](README.en.md)

</div>

---

## 这是什么

一份**人工筛选**的命令行工具文档库。和常见的 awesome 清单不同，本项目强调三件事：

1. **可校验**：所有条目都是结构化表格，`npm run validate` 会检查格式、索引可达性与重复收录。
2. **可操作**：每条收录都回答「它解决什么问题、和谁重叠、什么时候别用」，而不只是丢一个链接。
3. **双语同步**：每个条目的中文说明与 English 说明写在同一行，避免中英版本漂移。

收录范围覆盖两大类：**AI / LLM 类 CLI** 与 **通用效率 CLI**。

## 快速导航

| 分类 / Category | 文件 | 说明 |
| --- | --- | --- |
| 📚 分类总览 | [AI 类总览](docs/ai-cli/README.md) · [通用类总览](docs/general/README.md) | 先看这两页，按需求定位到具体分类 |
| 🧠 AI · 编程智能体 | [docs/ai-cli/coding-agents.md](docs/ai-cli/coding-agents.md) | 在终端里读写代码库、跑测试、提 PR 的智能体 |
| 🧠 AI · 对话与调用 | [docs/ai-cli/chat-and-llm.md](docs/ai-cli/chat-and-llm.md) | 单次问答、管道式 LLM 调用、提示词编排 |
| 🧠 AI · 本地推理 | [docs/ai-cli/local-inference.md](docs/ai-cli/local-inference.md) | 本地模型运行、量化、GPU/CPU 后端 |
| 🧠 AI · 智能体运行时 | [docs/ai-cli/agent-runtime.md](docs/ai-cli/agent-runtime.md) | MCP 协议、工具编排、智能体宿主 |
| 🔍 通用 · 查找与导航 | [docs/general/search.md](docs/general/search.md) | 比 `find` / `grep` 更好用的搜索与跳转 |
| 👀 通用 · 查看与预览 | [docs/general/viewers.md](docs/general/viewers.md) | 带语法高亮、分页、结构化预览的查看器 |
| 🧾 通用 · 文本与数据 | [docs/general/text-and-data.md](docs/general/text-and-data.md) | JSON/YAML/CSV 处理、批量编辑、基准测试 |
| 🛠 通用 · 开发工作流 | [docs/general/dev-workflow.md](docs/general/dev-workflow.md) | Git、任务编排、环境变量、代码审查 |
| ☁️ 通用 · 云与容器 | [docs/general/cloud-and-containers.md](docs/general/cloud-and-containers.md) | 容器、Kubernetes、基础设施即代码 |
| 🌐 通用 · 网络与调试 | [docs/general/network.md](docs/general/network.md) | HTTP 客户端、DNS/DNS-over-HTTPS、抓包 |
| 🔐 通用 · 安全与加密 | [docs/general/security.md](docs/general/security.md) | 密钥管理、扫描、签名与哈希 |
| 🎬 通用 · 媒体处理 | [docs/general/media.md](docs/general/media.md) | 音视频转码、图片压缩、终端截图 |
| 🧩 通用 · 内容平台客户端 | [docs/general/platform-clients.md](docs/general/platform-clients.md) | 飞书、B 站等平台的命令行客户端，带登录态与结构化输出 |
| 🐚 通用 · Shell 与提示符 | [docs/general/shell-and-prompt.md](docs/general/shell-and-prompt.md) | 提示符、目录跳转、历史记录、现代 Shell |

### 指南与规范

| 文档 | 说明 |
| --- | --- |
| [docs/meta/criteria.md](docs/meta/criteria.md) | 收录标准：什么样的工具会被拒绝 |
| [docs/meta/taxonomy.md](docs/meta/taxonomy.md) | 分类体系与打标签规则 |
| [docs/guides/evaluate-a-cli.md](docs/guides/evaluate-a-cli.md) | 如何评测一个 CLI：安装成本、可脚本化程度、退出码约定 |
| [docs/guides/dotfiles-and-setup.md](docs/guides/dotfiles-and-setup.md) | 从零搭建顺手的终端环境 |
| [docs/templates/tool.md](docs/templates/tool.md) | 深度页模板：复制它来写新条目 |
| [docs/tools/README.md](docs/tools/README.md) | 深度页索引 |
| [docs/meta/repo-setup.md](docs/meta/repo-setup.md) | 仓库初始化清单：占位符替换、Topics、分支保护 |

## 如何使用本仓库

**按需求找工具**（比按名字找更实用）：

| 我想… | 去看 |
| --- | --- |
| 在终端里让 AI 改代码 | [coding-agents](docs/ai-cli/coding-agents.md) |
| 把命令输出直接喂给模型 | [chat-and-llm](docs/ai-cli/chat-and-llm.md) |
| 完全离线跑模型 | [local-inference](docs/ai-cli/local-inference.md) |
| 在终端里刷视频站 / 导出字幕 | [platform-clients](docs/general/platform-clients.md) |
| 替换 `grep` + `find` + `ls` | [search](docs/general/search.md) + [viewers](docs/general/viewers.md) |
| 处理一大坨 JSON / CSV | [text-and-data](docs/general/text-and-data.md) |
| 少敲几百次 `cd` 和 `git` | [shell-and-prompt](docs/general/shell-and-prompt.md) |
| 排查线上服务 | [network](docs/general/network.md) + [cloud-and-containers](docs/general/cloud-and-containers.md) |

**读法建议**：先看分类文件里的「精选 / Top picks」小节（3–5 条，含取舍说明），
再进具体工具的深度页（`docs/tools/*.md`）。深度页才写安装、配置和坑。

## 本地开发

```bash
git clone https://github.com/LiliLIN0324/awesome-cli-tools.git
cd awesome-cli-tools

npm run validate    # 校验表格结构与 README 索引可达性
npm run stats       # 打印各分类收录数量
npm run check:links # 巡检所有外链（需要网络）
```

零运行时依赖，只需要 Node.js 18+（用到内置 `fetch`）。

## 贡献

欢迎提交新条目、纠正过时信息、补充深度页。请先读
[CONTRIBUTING.md](CONTRIBUTING.md) 与 [收录标准](docs/meta/criteria.md)。
提 PR 前请确保 `npm run validate` 通过。

## 致谢

本项目受 [sindresorhus/awesome](https://github.com/sindresorhus/awesome) 的
清单组织形式启发，但额外要求结构化数据与可校验性。

## 许可

文档内容以 [CC0-1.0](LICENSE) 释出（公共领域贡献）。仓库中引用的工具名称、
商标与链接归各自所有者所有；本仓库不打包任何第三方软件。
