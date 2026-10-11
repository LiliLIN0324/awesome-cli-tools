# 🧩 内容平台客户端 / Platform Clients

> 用命令行访问**内容平台**（视频站、社交网络、IM）的客户端：带登录态、
> 拉取详情/字幕/评论/榜单、支持结构化输出，部分还允许写操作（点赞、发文）。
>
> 与 [媒体处理](media.md) 的区别：这一类**不负责转码与压缩**，关注的是
> 「取到内容」和「把内容交给下游脚本或 AI」。与 [网络与调试](network.md) 的区别：
> 它不是通用 HTTP 客户端，而是针对特定平台的、已经处理过认证与反爬的封装。

## 精选 / Top picks

- **[lark-cli](https://github.com/larksuite/cli)** —— 飞书/Lark 官方 CLI，覆盖面最宽：
  IM、云文档、多维表格、日历、邮件、任务、会议等 20+ 领域都能从终端操作，
  且**为 Agent 而设计**——`+shortcut` 高层命令、`schema` 先探查参数、
  `--jq` 过滤输出、`--dry-run` 预览请求，命令还带 `read | write | high-risk-write`
  风险分级。**代价**：⚠️ 必须先建应用并登录（`config init` → `auth login`）；
  高风险写操作需要 `--yes`，不能交给 Agent 自己决定。
- **[bilibili-cli](https://github.com/public-clis/bilibili-cli)** —— B 站终端客户端：
  视频详情、字幕（可导出 SRT）、AI 总结、评论、搜索榜单、收藏与动态都覆盖，
  非 TTY 时**默认输出 YAML**，还自带 `SKILL.md` 让 AI Agent 直接用。
  **代价**：⚠️ 字幕/收藏/动态/互动等功能需要登录（会读取浏览器 Cookie 或扫码）；
  命中 B 站反爬时会返回 `HTTP 412`，需要降频重试。

> 本分类还很小。同类工具（小红书、Twitter/X、Telegram、Discord 的 CLI）
> 欢迎按 [收录标准](../meta/criteria.md) 提交。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [lark-cli](https://github.com/larksuite/cli) | 飞书/Lark 开放平台官方 CLI：在终端操作 IM、云文档、多维表格、日历、邮件、任务、会议等 20+ 领域，内置 Agent 用的 shortcut、`schema` 探查与 read/write/high-risk-write 风险分级（⚠️ 需登录） | Official CLI for the Lark/Feishu open platform: drive IM, docs, Base tables, calendar, mail, tasks, meetings and 20+ other domains from the terminal, with agent-oriented shortcuts, `schema` inspection and read/write/high-risk-write risk tiers (⚠️ requires login) | `go`, `platform-client`, `json-output`, `requires-login`, `cross-platform` | MIT |
| [bilibili-cli](https://github.com/public-clis/bilibili-cli) | B 站命令行客户端：视频详情/字幕/AI 总结/评论、搜索榜单、收藏与动态，非 TTY 时默认输出 YAML，可导出 SRT 与提取音频（⚠️ 部分功能需登录） | Bilibili client for the terminal: video details, subtitles, AI summary, comments, search, rankings, collections and feeds; defaults to YAML when stdout is not a TTY, with SRT export and audio extraction (⚠️ some commands need login) | `python`, `platform-client`, `json-output`, `requires-login` | Apache-2.0 |

## 组合用法 / Combinations

```bash
# ── lark-cli：飞书 ───────────────────────────────────────────────────────

# 1) 安装 + 一次性授权（后两步需要你在浏览器里配合，无法全自动）
npm install -g @larksuite/cli
lark-cli config init --new       # 会阻塞并输出验证链接
lark-cli auth login --recommend
lark-cli auth status             # 确认登录态
lark-cli doctor                  # 配置/认证/连通性一并体检

# 2) 先看有没有高层 shortcut，再看底层 API（官方推荐的顺序）
lark-cli calendar --help                    # 找 +shortcut
lark-cli calendar +agenda                   # 直接干活的捷径

# 3) 调用前先查参数、权限范围与示例，避免盲目试错
lark-cli schema mail.user_mailbox.messages.list

# 4) 写操作先预览请求，确认后再执行（高风险命令还会要 --yes）
lark-cli im messages create --dry-run

# 5) 结构化输出：直接过滤字段，别把整坨 JSON 丢进上下文
lark-cli whoami --jq '.data.user.name'

# 6) 实时事件流：NDJSON 逐行输出，适合当长驻订阅器
lark-cli event consume <EventKey> --max-events 10 --timeout 60

# 7) 打开 CLI 自带的能力说明（Agent 可以自己读）
lark-cli skills list

# ── bilibili-cli：B 站 ─────────────────────────────────────────────────

# 8) 安装（uv 或 pipx，装到隔离环境里，不污染项目依赖）
uv tool install bilibili-cli
# 需要音频提取功能时
uv tool install "bilibili-cli[audio]"

# 9) 取视频元信息并只留下你要的字段
bili video BV1ABcsztEcY --json | jq '.data.video | {title, owner, duration}'

# 10) 字幕是总结视频最省 token 的来源：先拿字幕，再喂给模型
bili video BV1ABcsztEcY -st --subtitle-format srt > video.srt
bili video BV1ABcsztEcY --yaml | yq '.data.subtitle' | llm "用 5 条要点总结"

# 11) 完整链路：下载音频 → 本地转写 → 总结（全程离线）
bili audio BV1ABcsztEcY --no-split -o ~/data/    # 得到完整 m4a
ffmpeg -i ~/data/*.m4a -ar 16000 -ac 1 speech.wav
whisper-cli -f speech.wav -otxt

# 12) 给脚本用的时候显式指定输出格式，别依赖 TTY 推断
OUTPUT=json bili hot --max 10 | jq -r '.data.items[].title'

# 13) 检查登录状态可以当判断条件（未登录时退出码为 1）
if bili status >/dev/null 2>&1; then echo "已登录"; else echo "需要 bili login"; fi
```

## 注意事项 / Notes

**通用 / General**

- ⚠️ 这一类工具都持有**平台登录态**，一旦授权成功，就相当于把账号的读写能力
  交给了这个工具（以及能调用它的 Agent）。只在你信任的机器和目录里配置，
  并定期在平台上检查/回收应用的授权。
- **把「生成」和「执行」分开**：先 `--dry-run` 或先只读查询，确认范围对了再写。
- **输出格式要显式指定**。非 TTY 环境下的默认格式各不相同（YAML / JSON），
  脚本里别依赖推断，直接写死 `--json` 或 `OUTPUT=json`。
- **遵守平台条款与版权**：批量抓取、转载、二次分发内容前先确认授权；
  本项目只收录工具，不对使用方式背书。

**lark-cli**

- **授权分三步**：`config init --new`（建/绑定应用，会阻塞并给出验证链接）→
  `auth login --recommend`（扫码或浏览器授权）→ `auth status` 验证。
  卡住时先跑 `lark-cli doctor`，它会直接告诉你哪一步没过。
- ⚠️ **风险分级是真的会拦你**：命令分为 `read` / `write` / `high-risk-write`，
  高风险写操作需要 `--yes` 才会执行。**不要把这个参数交给 Agent 自己加**，
  让它先说明要做什么、由人确认。
- **`config init --new` 会阻塞**。在脚本或 Agent 里要放后台跑并读取它输出的
  验证链接，不要在前台干等（前台跑会看起来像卡死）。
- **命令面很宽（20+ 领域）**，优先用 `+shortcut`，找不到再退到 typed command，
  最后才是 `lark-cli api GET /open-apis/...` 这种裸路径逃生口。
- CLI 内置了 `skills`（`lark-cli skills list` / `read`），Agent 可以自己读用法；
  还可以把技能装到 Agent 的技能目录：`npx skills add larksuite/cli -g -y`。

**bilibili-cli**

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

## 相关 / See also

- [智能体运行时](../ai-cli/agent-runtime.md) —— 把这类平台工具接给 Agent（MCP、技能、权限边界）
- [媒体处理](media.md) —— 取到音频之后用 `ffmpeg` / `whisper.cpp` 处理
- [AI · 对话与模型调用](../ai-cli/chat-and-llm.md) —— 把字幕喂给模型做总结
- [文本与数据](text-and-data.md) —— 用 `jq` / `yq` 消费结构化输出
- [安全与加密](security.md) —— 凭据与 Cookie 的管理
