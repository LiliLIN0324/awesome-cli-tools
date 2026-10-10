# 🧾 文本与数据处理 / Text & Data

> 处理 JSON / YAML / CSV / HTML 以及批量文本改写。这一类工具的选择标准很明确：
> **能不能只做一件事并把结果交给管道**。

## 精选 / Top picks

- **[jq](https://github.com/jqlang/jq)** —— JSON 处理的通用语言，几乎所有 CI 与
  脚本都预设它存在。**代价**：学习曲线陡，`.[] | select()` 那一套需要练习；
  处理超大文件时内存占用不友好。
- **[yq](https://github.com/mikefarah/yq)** —— 用和 `jq` 相似的语法处理
  YAML/JSON/XML/TOML 并**保留注释**。**代价**：与 Python 生态里的同名项目
  （`kislyuk/yq`）不是同一个东西，装之前看清仓库。
- **[Miller (mlr)](https://github.com/johnkerl/miller)** —— 把 CSV/TSV/JSON 当
  记录流处理，`cut`/`join`/`sort`/`stats` 的名字直接对应 SQL 思维。
  **代价**：语法自成一套，需要看文档。
- **[hyperfine](https://github.com/sharkdp/hyperfine)** —— 命令基准测试的事实标准，
  带预热、多轮统计与结果导出。**代价**：只测耗时，不测内存。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [jq](https://github.com/jqlang/jq) | JSON 的查询与转换语言，可做过滤、重塑、聚合 | Query and transform JSON: filter, reshape, aggregate | `c`, `json`, `pipe-friendly` | MIT |
| [yq](https://github.com/mikefarah/yq) | 用类 jq 语法处理 YAML/JSON/XML/TOML，并保留注释与格式 | jq-like syntax for YAML/JSON/XML/TOML that preserves comments and formatting | `go`, `yaml`, `json` | MIT |
| [Miller (mlr)](https://github.com/johnkerl/miller) | 把 CSV/TSV/JSON 当记录流处理，命令名对应 SQL 操作 | Treats CSV/TSV/JSON as record streams with SQL-like verbs | `go`, `csv`, `pipe-friendly` | BSD-2-Clause |
| [qsv](https://github.com/dathere/qsv) | 高性能 CSV 工具箱，含统计、连接、去重等数十个子命令 | High-performance CSV toolkit with dozens of subcommands | `rust`, `csv`, `benchmark` | 见仓库 / see repo |
| [csvkit](https://github.com/wireservice/csvkit) | 面向 CSV 的成熟 Python 工具集，与 SQL 交互方便 | Mature Python CSV toolkit with convenient SQL interop | `python`, `csv`, `sql` | MIT |
| [dasel](https://github.com/TomWright/dasel) | 用一个二进制读改 JSON/YAML/TOML/XML/CSV，语法统一 | One binary to query and edit JSON/YAML/TOML/XML/CSV with unified syntax | `go`, `json`, `yaml` | MIT |
| [jless](https://github.com/PaulJuliusMartinez/jless) | 交互式 JSON 浏览器，折叠/搜索/复制路径，比肉眼扫大文件快 | Interactive JSON viewer with folding, search and path copying | `rust`, `json`, `tui` | MIT |
| [gron](https://github.com/tomnomnom/gron) | 把 JSON 展平成可 grep 的赋值语句，反过来也能还原 | Flattens JSON into greppable assignments and can rebuild it | `go`, `json`, `grep` | MIT |
| [htmlq](https://github.com/mgdm/htmlq) | 用 CSS 选择器从 HTML 里抽取内容，替代一次性正则 | Extracts content from HTML with CSS selectors instead of ad-hoc regex | `rust`, `html`, `css-selector` | MIT |
| [sd](https://github.com/chmln/sd) | 直觉化的查找替换，语法比 `sed` 简单且默认安全 | Intuitive find-and-replace with simpler, safer syntax than `sed` | `rust`, `sed`, `replace` | MIT |
| [hyperfine](https://github.com/sharkdp/hyperfine) | 命令基准测试：预热、多轮统计、导出 CSV/JSON 结果 | Command benchmarking with warmup, statistics and CSV/JSON export | `rust`, `benchmark`, `stats` | MIT OR Apache-2.0 |
| [tokei](https://github.com/XAMPPRocky/tokei) | 按语言统计代码行数，速度快、输出可续接管道 | Fast per-language code line counter with pipeable output | `rust`, `loc`, `report` | MIT OR Apache-2.0 |
| [Visidata](https://github.com/saulpw/visidata) | 终端里的电子表格式数据浏览与透视，直接吃多种格式 | Spreadsheet-like terminal data browser and pivot tool for many formats | `python`, `tui`, `csv` | GPL-3.0 |
| [ripgrep-all (rga)](https://github.com/phiresky/ripgrep-all) | 把 ripgrep 扩展到 PDF/Office/压缩包内部搜索 | Extends ripgrep to search inside PDFs, Office files and archives | `rust`, `grep`, `pdf` | AGPL-3.0 |
| [Pandoc](https://github.com/jgm/pandoc) | 文档格式转换的通用工具，Markdown/LaTeX/docx 互转 | Universal document converter across Markdown, LaTeX, docx and more | `haskell`, `markdown`, `convert` | GPL-2.0-or-later |

## 组合用法 / Combinations

```bash
# 1) jq 与 curl：只取你需要的那几个字段
curl -s https://api.github.com/repos/jqlang/jq \
  | jq -r '{name, stars: .stargazers_count, license: .license.spdx_id}'

# 2) yq 改配置而不破坏注释（比 sed 安全得多）
yq -i '.services.web.ports[0] = "8080:80"' docker-compose.yml

# 3) mlr 做 CSV 的 group-by 统计
mlr --csv stats1 -a count,mean -f latency_ms -g endpoint traces.csv

# 4) JSON 太大，先看结构再定位
jq 'paths(scalars) | join(".")' huge.json | sort -u | head -50
# 或者交互式看
jless huge.json

# 5) 基准测试要有结论地做，别只跑一次
hyperfine --warmup 3 'rg pattern' 'grep -r pattern .'

# 6) 展平后 grep，处理深嵌套 JSON 的常见套路
gron response.json | rg 'error' | gron --ungron
```

## 注意事项 / Notes

- **`yq` 有多个同名项目**：`mikefarah/yq`（Go，单二进制）与 `kislyuk/yq`（Python，
  包装 jq）。装之前确认仓库，脚本里也要在 README 注明依赖的是哪个。
- **`jq` 默认会重排 key 并丢注释**。要保留格式用 `yq` 或 `dasel`。
- `jq` 处理超大 JSON 会吃内存，流式场景改用 `--stream` 或换 `mlr`/`qsv`。
- 改文件一定要先看清是否**原地修改**：`yq -i`、`sd file`、`sed -i` 都会直接
  覆盖。养成先用 `git diff` 或加 `--dry-run`/输出到 stdout 核对的习惯。
- CSV 的编码与分隔符坑最多：BOM、CRLF、引号转义、分号分隔（欧洲区）。
  处理前先 `file` 一下，必要时显式指定 `--delimiter`。

## 相关 / See also

- [查看与预览](viewers.md) —— 结果怎么看
- [查找与导航](search.md) —— 先缩小到相关文件
- [AI · 对话与模型调用](../ai-cli/chat-and-llm.md) —— 用 `jq` 消费模型返回的 JSON
