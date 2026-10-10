# 🧰 通用 CLI / General-purpose CLIs

> 不依赖模型、不要求联网的日常效率工具。挑选标准只有一条：
> **能不能被组合进管道**。

## 九个子分类

| 子分类 | 一句话 | 代表工具 |
| --- | --- | --- |
| [查找与导航](./search.md) | 找到文件与内容 | ripgrep, fd, fzf |
| [查看与预览](./viewers.md) | 把内容看清楚 | bat, delta, glow |
| [文本与数据](./text-and-data.md) | JSON/CSV/YAML 处理与基准测试 | jq, yq, mlr |
| [开发工作流](./dev-workflow.md) | Git、任务、钩子、CI | gh, lazygit, just |
| [云与容器](./cloud-and-containers.md) | 容器、K8s、IaC | kubectl, k9s, dive |
| [网络与调试](./network.md) | HTTP、DNS、抓包 | curl, xh, hurl |
| [安全与加密](./security.md) | 密钥、扫描、签名 | age, sops, gitleaks |
| [媒体处理](./media.md) | 音视频与图片 | ffmpeg, oxipng, yt-dlp |
| [Shell 与提示符](./shell-and-prompt.md) | 提示符、跳转、历史 | starship, zoxide, tmux |

## 通用注意事项

- **先替换使用频率最高的命令**（通常是 `ls`/`cat`/`grep`/`find`），
  收益远大于追新工具。
- **外部命令要能被脚本复用**。一个只在交互时好用的工具，
  在 CI 里就会变成新的手工步骤。
- **别名要可回退**。给 `cat` 加别名时保留 `\cat` 或 `command cat` 的逃生路径，
  否则在管道里会踩到高亮注入的坑。
- **不要一次换掉五个工具**。每次只改一个，一周后确认没有副作用再继续。

## 相关 / See also

- [AI / LLM 类 CLI](../ai-cli/README.md)
- [如何评测一个 CLI](../guides/evaluate-a-cli.md)
- [搭建终端环境](../guides/dotfiles-and-setup.md)
