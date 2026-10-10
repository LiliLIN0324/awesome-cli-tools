# 🧩 内容平台客户端 / Platform Clients

> 用命令行访问**内容平台**（视频站、社交网络、IM）的客户端：带登录态、
> 拉取详情/字幕/评论/榜单、支持结构化输出，部分还允许写操作（点赞、发文）。
>
> 与 [媒体处理](media.md) 的区别：这一类**不负责转码与压缩**，关注的是
> 「取到内容」和「把内容交给下游脚本或 AI」。与 [网络与调试](network.md) 的区别：
> 它不是通用 HTTP 客户端，而是针对特定平台的、已经处理过认证与反爬的封装。

## 精选 / Top picks

- **[bilibili-cli](https://github.com/public-clis/bilibili-cli)** —— 目前本分类里
  最成熟的一个：视频详情、字幕（可导出 SRT）、AI 总结、评论、搜索榜单、收藏与
  动态都覆盖，非 TTY 时**默认输出 YAML**，还自带 `SKILL.md` 让 AI Agent 直接用。
  **代价**：⚠️ 字幕/收藏/动态/互动等功能需要登录（会读取浏览器 Cookie 或扫码）；
  命中 B 站反爬时会返回 `HTTP 412`，需要降频重试。

> 本分类目前只有一条。同类工具（小红书、Twitter/X、Telegram、Discord 的 CLI）
> 多为同一作者体系的项目，欢迎按 [收录标准](../meta/criteria.md) 提交。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [bilibili-cli](https://github.com/public-clis/bilibili-cli) | B 站命令行客户端：视频详情/字幕/AI 总结/评论、搜索榜单、收藏与动态，非 TTY 时默认输出 YAML，可导出 SRT 与提取音频（⚠️ 部分功能需登录） | Bilibili client for the terminal: video details, subtitles, AI summary, comments, search, rankings, collections and feeds; defaults to YAML when stdout is not a TTY, with SRT export and audio extraction (⚠️ some commands need login) | `python`, `platform-client`, `json-output`, `requires-login` | Apache-2.0 |

## 组合用法 / Combinations

```bash
# 1) 安装（uv 或 pipx，装到隔离环境里，不污染项目依赖）
uv tool install bilibili-cli
# 需要音频提取功能时
uv tool install "bilibili-cli[audio]"

# 2) 取视频元信息并只留下你要的字段
bili video BV1ABcsztEcY --json | jq '.data.video | {title, owner, duration}'

# 3) 字幕是总结视频最省 token 的来源：先拿字幕，再喂给模型
bili video BV1ABcsztEcY -st --subtitle-format srt > video.srt
bili video BV1ABcsztEcY --yaml | yq '.data.subtitle' | llm "用 5 条要点总结"

# 4) 完整链路：下载音频 → 本地转写 → 总结（全程离线）
bili audio BV1ABcsztEcY --no-split -o ~/data/    # 得到完整 m4a
# 再用 ffmpeg 转成 wav 交给 whisper.cpp
ffmpeg -i ~/data/*.m4a -ar 16000 -ac 1 speech.wav
whisper-cli -f speech.wav -otxt

# 5) 给脚本用的时候显式指定输出格式，别依赖 TTY 推断
OUTPUT=json bili hot --max 10 | jq -r '.data.items[].title'

# 6) 检查登录状态可以当判断条件（未登录时退出码为 1）
if bili status >/dev/null 2>&1; then echo "已登录"; else echo "需要 bili login"; fi
```

## 注意事项 / Notes

- ⚠️ **凭据保存在 `~/.bilibili-cli/credential.json`**，且会尝试从
  Chrome/Firefox/Edge/Brave 提取 Cookie。共享机器上要注意文件权限，
  也不要在不信任的环境里让它读浏览器数据。
- **`bili status` 的退出码有语义**：已登录返回 `0`，未登录返回 `1`。
  放进 `set -e` 脚本时要么处理它，要么加 `|| true`。
- ⚠️ **写操作（点赞/投币/三连/发文/删除）需要可写凭证**（含 `bili_jct`）。
  浏览器 Cookie 提取到的凭证可能不支持写，会报「当前登录凭证不支持写操作」。
  这类操作不可撤销，脚本里请加确认或 dry-run 保护。
- **反爬会触发 `HTTP 412`**。批量拉取时降低 `--max`、加间隔，
  不要把配额用在「先拉全量再说」上。
- **非 TTY 默认输出 YAML** 是刻意的设计（对 Agent 更省 token），
  但这意味着重定向到文件时不会得到原来终端里那份彩色文本。
  需要严格 JSON 就 `--json`，或用 `OUTPUT=yaml|json|rich|auto` 覆盖。
- **遵守平台条款与版权**：批量抓取、转载、二次分发内容前先确认授权；
  本项目只收录工具，不对使用方式背书。

## 相关 / See also

- [媒体处理](media.md) —— 取到音频之后用 `ffmpeg` / `whisper.cpp` 处理
- [AI · 对话与模型调用](../ai-cli/chat-and-llm.md) —— 把字幕喂给模型做总结
- [文本与数据](text-and-data.md) —— 用 `jq` / `yq` 消费结构化输出
- [安全与加密](security.md) —— 凭据与 Cookie 的管理
