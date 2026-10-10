---
name: 推荐一个工具 / Suggest a tool
description: 推荐一个应该被收录的 CLI 工具
title: "[Tool] "
labels: ["tool-suggestion"]
body:
  - type: markdown
    attributes:
      value: |
        请先阅读 [收录标准](../blob/main/docs/meta/criteria.md)。
        提示：如果你能直接开 PR，比开 issue 更快 —— 见
        [CONTRIBUTING.md](../blob/main/CONTRIBUTING.md)。

  - type: input
    id: name
    attributes:
      label: 工具名称 / Tool name
    validations:
      required: true

  - type: input
    id: repo
    attributes:
      label: 官方仓库或官网 / Official repo or site
      placeholder: https://github.com/owner/repo
    validations:
      required: true

  - type: dropdown
    id: category
    attributes:
      label: 建议分类 / Suggested category
      options:
        - AI · 编程智能体 / coding-agents
        - AI · 对话与模型调用 / chat-and-llm
        - AI · 本地推理 / local-inference
        - AI · 智能体运行时 / agent-runtime
        - 通用 · 查找与导航 / search
        - 通用 · 查看与预览 / viewers
        - 通用 · 文本与数据 / text-and-data
        - 通用 · 开发工作流 / dev-workflow
        - 通用 · 云与容器 / cloud-and-containers
        - 通用 · 网络与调试 / network
        - 通用 · 安全与加密 / security
        - 通用 · 媒体处理 / media
        - 通用 · Shell 与提示符 / shell-and-prompt
        - 不确定 / Not sure
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: 它解决什么问题 / What problem does it solve
      description: 一句话，不要写「很好用」。说清它替代了什么。
    validations:
      required: true

  - type: input
    id: license
    attributes:
      label: 许可证 / License
      placeholder: MIT OR Apache-2.0 / 见仓库 / see repo / 专有 / proprietary
    validations:
      required: true

  - type: textarea
    id: verified
    attributes:
      label: 你验证过的行为 / What you verified
      description: |
        例如：退出码语义、`--json` 输出、`--color=never` 是否生效、
        非 TTY 下是否卡住。没验证过的项可以留空。
    validations:
      required: false

  - type: checkboxes
    id: criteria
    attributes:
      label: 是否符合收录标准 / Meets the criteria
      options:
        - label: 18 个月内有发布或提交（未归档）
          required: true
        - label: 有明确许可证
          required: true
        - label: 能在无 GUI 环境下运行，且有非交互式用法
          required: true
