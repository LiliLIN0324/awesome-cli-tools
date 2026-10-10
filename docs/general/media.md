# 🎬 媒体处理 / Media

> 音视频转码、图片压缩与终端录制。这一类的核心问题是**把「体积 / 质量 /
> 兼容性」的取舍显式化**——多数情况下你要的不是「最好的参数」，
> 而是「能被目标设备播放的最小文件」。

## 精选 / Top picks

- **[FFmpeg](https://github.com/FFmpeg/FFmpeg)** —— 音视频处理的万能底座，
  几乎所有其它工具都在调它。**代价**：参数组合极多，
  建议把常用命令固化成脚本而不是每次重查。
- **[ImageMagick](https://github.com/ImageMagick/ImageMagick)** —— 图片批处理
  的长青工具，`mogrify` 做批量转换很方便。**代价**：⚠️ 历史上出过多次
  解析漏洞，处理**不可信图片**时务必升级到最新版并在沙箱内运行。
- **[oxipng](https://github.com/shssoichiro/oxipng)** —— 无损优化 PNG，
  在不动画质的前提下减体积，适合接进构建流水线。**代价**：只处理 PNG，
  且对已经很优的文件收益有限。
- **[yt-dlp](https://github.com/yt-dlp/yt-dlp)** —— 下载与归档网络媒体的
  事实标准（`youtube-dl` 的活跃分支）。**代价**：站点改版会短期失效，
  需要保持更新；使用时注意目标站点的条款与版权。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [FFmpeg](https://github.com/FFmpeg/FFmpeg) | 音视频转码、裁剪、合并、滤镜与流处理的通用工具 | The universal tool for transcoding, trimming, muxing, filtering and streaming | `c`, `video`, `audio`, `standard` | LGPL-2.1-or-later |
| [ImageMagick](https://github.com/ImageMagick/ImageMagick) | 图片转换与批处理老牌工具，`convert`/`mogrify` 覆盖多数需求 | Long-standing image conversion and batch tooling via `convert`/`mogrify` | `c`, `image`, `batch` | ImageMagick |
| [oxipng](https://github.com/shssoichiro/oxipng) | 无损 PNG 优化器，多线程、可接进构建流程 | Lossless PNG optimizer, multithreaded and easy to wire into builds | `rust`, `image`, `optimize` | MIT |
| [pngquant](https://github.com/kornelski/pngquant) | 有损量化压缩 PNG，适合网页资源，体积下降明显 | Lossy PNG quantizer that noticeably shrinks web assets | `c`, `image`, `optimize` | GPL-3.0-or-later |
| [gifsicle](https://github.com/kohler/gifsicle) | GIF 的优化、裁剪与逐帧操作，压制动图体积 | Optimize, crop and manipulate GIF frames to shrink animated images | `c`, `image`, `gif` | GPL-2.0 |
| [SoX](https://github.com/chirlu/sox) | 音频转换与效果处理的命令行工具，适合批量与脚本 | Command-line audio conversion and effects, good for scripting | `c`, `audio`, `convert` | 见仓库 / see repo |
| [yt-dlp](https://github.com/yt-dlp/yt-dlp) | 下载并归档网络视频/音频，支持格式选择与元数据嵌入 | Downloads and archives online video and audio with format selection | `python`, `download`, `archive` | Unlicense |
| [asciinema](https://github.com/asciinema/asciinema) | 录制终端会话为可回放的文本格式，体积远小于录屏 | Records terminal sessions as lightweight, replayable text | `python`, `terminal`, `recording` | GPL-3.0 |
| [agg](https://github.com/asciinema/agg) | 把 asciinema 录制转成 GIF，便于放进 README | Converts asciinema recordings into GIFs for READMEs | `rust`, `terminal`, `gif` | 见仓库 / see repo |
| [VHS](https://github.com/charmbracelet/vhs) | 用声明式脚本录制终端演示，输出稳定可复现的 GIF | Records terminal demos from declarative scripts for reproducible GIFs | `go`, `terminal`, `recording` | MIT |

## 组合用法 / Combinations

```bash
# 1) 转码成「能播、够小」的 H.264 + AAC（兼容性优先）
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 23 \
  -c:a aac -b:a 128k -movflags +faststart output.mp4

# 2) 只看视频信息，别猜参数（ffprobe 随 ffmpeg 一起装）
ffprobe -v error -select_streams v:0 \
  -show_entries stream=width,height,r_frame_rate,bit_rate -of default=nw=1 input.mp4

# 3) 无损裁剪（不重编码，速度快）
ffmpeg -ss 00:01:30 -to 00:02:00 -i in.mp4 -c copy clip.mp4

# 4) 网页图片流水线：先有损量化再加无损优化
pngquant --quality=65-85 --strip --speed 1 -o out.png in.png
oxipng -o 4 --strip safe out.png

# 5) 批量转换用 mogrify，而不是循环调 convert
magick mogrify -resize '1600x1600>' -quality 82 -format webp photos/*.jpg

# 6) 录制终端演示并转 GIF
asciinema rec demo.cast          # 结束按 Ctrl-D
agg demo.cast demo.gif
# 或用声明式方式
vhs demo.tape
```

## 注意事项 / Notes

- ⚠️ **`ImageMagick` 的历史漏洞多与图片解析有关**。处理用户上传的图片时：
  升级到最新版本、限制资源（`-limit`）、并在沙箱/容器里跑。
- **`ffmpeg -c copy` 的裁剪点会吸附到关键帧**，所以「精确到帧」的裁剪需要
  重编码。先试 `-c copy`，不满意再重编。
- **转换顺序影响质量**：JPEG→PNG 不会恢复画质，只会变大。先确定目标格式
  再决定是否有损。
- `pngquant` 是**有损**的（调色板量化），`oxipng` 是**无损**的。
  追求极限体积时先 `pngquant` 再 `oxipng`；要求像素级一致时只用 `oxipng`。
- ⚠️ `yt-dlp` 的使用需遵守目标站点的服务条款与当地版权法。
  归档自己的内容没问题，转载他人内容请先确认授权。
- 终端录制（`asciinema`）会把你**输入的内容**一并记录，
  包括密钥与内部地址。发布前务必回放检查或做编辑。

## 相关 / See also

- [内容平台客户端](platform-clients.md) —— 取平台内容（详情/字幕/音频）而不做转码
- [文本与数据处理](text-and-data.md) —— `ffprobe` 输出的 JSON 用 `jq` 处理
- [查看与预览](viewers.md) —— 处理结果怎么看
- [云与容器](cloud-and-containers.md) —— 在容器里隔离不可信文件的处理
