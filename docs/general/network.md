# 🌐 网络与调试 / Network & Debugging

> HTTP 客户端、DNS 查询、协议分析与抓包。这一类的选择标准是
> **输出能不能被程序消费**，而不只是「能不能发请求」。

## 精选 / Top picks

- **[curl](https://github.com/curl/curl)** —— 普遍存在的通用传输工具，
  任何环境都能假定它有。**代价**：参数为兼容历史而繁杂，
  JSON 与认证的写法反直觉。
- **[xh](https://github.com/ducaale/xh)** —— 语法接近 HTTPie 但更快、
  单二进制，`xh GET url key==value` 这类简写日常很好用。
  **代价**：生态与资料比 `curl` 少，脚本可移植性差。
- **[hurl](https://github.com/Orange-OpenSource/hurl)** —— 把 HTTP 请求写成
  文本脚本并**断言响应**，适合当集成测试。**代价**：需要学习它的文件格式，
  只适合「需要重复执行」的场景。
- **[mtr](https://github.com/traviscross/mtr)** —— `ping` + `traceroute` 的合体，
  能实时看每一跳的丢包。**代价**：需要 raw socket 权限，容器里通常要放行
  `CAP_NET_RAW`。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [curl](https://github.com/curl/curl) | 通用数据传输工具，几乎所有系统都预装，调试 API 的基线 | Universal transfer tool, preinstalled nearly everywhere and the API-debugging baseline | `c`, `http`, `standard` | curl |
| [HTTPie](https://github.com/httpie/cli) | 面向人类的 HTTP 客户端，语法简洁、输出带颜色 | Human-friendly HTTP client with terse syntax and colored output | `python`, `http`, `api` | BSD-3-Clause |
| [xh](https://github.com/ducaale/xh) | HTTPie 语义的 Rust 重写，单二进制且更快 | Rust reimplementation of HTTPie's semantics: single binary and faster | `rust`, `http`, `api` | MIT |
| [hurl](https://github.com/Orange-OpenSource/hurl) | 用纯文本描述 HTTP 请求并断言响应，可当集成测试跑 | Runs HTTP requests described in plain text with assertions, usable as tests | `rust`, `http`, `testing`, `ci` | Apache-2.0 |
| [wget](https://git.savannah.gnu.org/cgit/wget.git) | 递归下载与断点续传最稳的老牌工具 | The old reliable for recursive downloads and resume support | `c`, `http`, `download` | GPL-3.0-or-later |
| [mtr](https://github.com/traviscross/mtr) | 实时显示每跳延迟与丢包，替代 ping + traceroute | Live per-hop latency and packet loss, replacing ping plus traceroute | `c`, `network`, `diagnostics` | GPL-2.0 |
| [dog](https://github.com/ogham/dog) | 现代 DNS 查询客户端，输出可读且支持多种记录类型 | Modern DNS client with readable output and multi-type support | `rust`, `dns`, `diagnostics` | 见仓库 / see repo |
| [tcpdump](https://github.com/the-tcpdump-group/tcpdump) | 命令行抓包的标准工具，配合显示过滤器定位问题 | The standard packet capture CLI, used with display filters to isolate issues | `c`, `network`, `capture` | BSD-3-Clause |
| [mitmproxy](https://github.com/mitmproxy/mitmproxy) | 可脚本化的中间人代理，用于检查 HTTPS 流量与改包 | Scriptable man-in-the-middle proxy to inspect and rewrite HTTPS traffic | `python`, `http`, `proxy`, `security` | MIT |
| [websocat](https://github.com/vi/websocat) | WebSocket 的 `netcat`，可在终端收发与转发消息 | `netcat` for WebSockets: send, receive and forward messages from the terminal | `rust`, `websocket`, `debug` | MIT |
| [grpcurl](https://github.com/fullstorydev/grpcurl) | 像 curl 一样调用 gRPC 服务，支持反射获取 schema | Invoke gRPC services like curl, with server reflection support | `go`, `grpc`, `api` | MIT |
| [hey](https://github.com/rakyll/hey) | HTTP 压测工具，报告延迟分布与状态码统计 | HTTP load generator reporting latency distribution and status codes | `go`, `http`, `benchmark` | Apache-2.0 |
| [bandwhich](https://github.com/imsnif/bandwhich) | 按进程查看实时带宽占用，定位「谁在偷跑流量」 | Shows live bandwidth usage per process to find the traffic hog | `rust`, `network`, `tui` | MIT |

## 组合用法 / Combinations

```bash
# 1) curl 的「干净脚本」模式：隐藏进度、失败即非零退出、把状态码单独取出来
curl -fsS -o out.json -w '%{http_code}\n' https://api.example.com/v1/items

# 2) 只看延迟分布，不打印到终端，避免干扰测速
curl -sS -o /dev/null -w 'dns=%{time_namelookup}s connect=%{time_connect}s tls=%{time_appconnect}s total=%{time_total}s\n' \
  https://example.com

# 3) xh 做日常 API 调试（JSON 字段、请求头、查询参数各有专用语法）
xh POST https://api.example.com/v1/items \
  Authorization:'Bearer $TOKEN' \
  name=demo enabled:=true \
  q==search

# 4) 把 hurl 文件当回归测试跑进 CI
hurl --test --variable token="$TOKEN" tests/api.hurl

# 5) 排查「服务到底是 DNS 慢还是 TLS 慢」
dig +short example.com
dog example.com A
curl -w '%{time_namelookup} %{time_appconnect}\n' -o /dev/null -s https://example.com

# 6) 抓包只看关键流量（先看接口名：ip addr / ifconfig）
sudo tcpdump -i any -nn 'tcp port 443 and host 10.0.0.5' -c 50

# 7) 压测要有基线对比，别只跑一次
hey -n 2000 -c 50 https://staging.example.com/health
```

## 注意事项 / Notes

- **`curl` 默认不因 HTTP 4xx/5xx 返回非零退出码**。脚本里必须加 `-f`
  （或 `--fail-with-body`），否则失败会被当成成功。
- **不要用 `echo $TOKEN` 式的方式拼请求头**：含空格或特殊字符会出错，
  且 token 会进入 shell 历史。用环境变量并读 `~/.netrc` 或 `-H @file`。
- ⚠️ `mitmproxy` 需要被信任的根证书才能解密 HTTPS；**只在受控环境**里使用，
  不要在自己的日常浏览器/系统上装它的 CA。
- `tcpdump`/`mtr` 需要相应权限。容器里就绪的方案是显式授予能力
  （`--cap-add NET_RAW`），而不是 `--privileged`。
- 压测（`hey` 等）**一定要打自己的环境**。对非授权目标压测属于攻击行为。
- 代理环境变量（`HTTP_PROXY`/`HTTPS_PROXY`/`NO_PROXY`）各工具的支持程度不同，
  排查「为什么它超时」时先确认目标是否被代理接管。

## 相关 / See also

- [云与容器](cloud-and-containers.md) —— 集群内网络排查
- [安全与加密](security.md) —— 证书、签名与密钥
- [文本与数据](text-and-data.md) —— 用 `jq` 处理 API 返回
