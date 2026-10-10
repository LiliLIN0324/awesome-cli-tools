<!--
=====================================================================
条目深度页模板 / Deep-dive entry template
---------------------------------------------------------------------
用法：
  1. 复制本文件到 docs/tools/<slug>.md（slug 用工具名小写、空格换 -）
  2. 从下面第一个 # 标题开始，逐节填写
  3. 删除本注释块和所有「填写说明」
  4. 在 docs/tools/README.md 的索引表加一行
  5. 运行 `npm run validate`

原则：只写你亲手验证过的东西。没验证过的内容留在分类表格那一行里，
不要在这里编造 flag 或行为。
=====================================================================
-->

# <工具名> · <Tool Name>

> 用一句话说清它是什么、给谁用。填写说明：不要写「很棒的工具」，
> 要写「替代 XXX 的 YYY，默认遵守 .gitignore」。

## 速览 / At a glance

| 项目 | 内容 |
| --- | --- |
| 仓库 / Repo | https://github.com/owner/repo |
| 官网 / Site | https://example.com |
| 许可 / License | MIT OR Apache-2.0 |
| 语言 / Language | Rust |
| 平台 / Platform | macOS, Linux, Windows |
| 分类 / Category | [docs/general/search.md](../general/search.md) |
| 标签 / Tags | `rust`, `grep`, `pipe-friendly` |
| 最后复核 / Last reviewed | 2026-10 |

## 为什么值得收录 / Why it's here

填写说明：3–6 句。回答：
- 它取代/补位了什么旧工具？
- 关键差异点是什么（默认值、性能、输出格式）？
- 什么场景下**不要**用它？

## 安装 / Install

填写说明：给出**官方推荐**的几种方式，并注明你实测过的那个。

```bash
# macOS
brew install <pkg>

# Debian/Ubuntu
apt install <pkg>

# 通用（Rust 系）
cargo install <crate>
```

验证安装：

```bash
<tool> --version
```

## 常用命令 / Common usage

填写说明：给 5–10 条最常用的，每条附一句注释。命令要能直接粘贴运行
（用通用路径，不要用你自己机器上的私有路径）。

```bash
# 基础：...
<tool> --flag

# 管道：...
cat file | <tool>

# 机器可读输出：...
<tool> --json | jq
```

## 配置 / Configuration

填写说明：配置文件位置、关键选项、以及**为什么**要改默认值。
如果默认值就够用，明确写「默认足够，无需配置」——这本身就是有价值的信息。

| 文件 | 用途 |
| --- | --- |
| `~/.config/<tool>/config.toml` | 主配置 |

## 与同类工具的取舍 / Alternatives & trade-offs

填写说明：至少列 2 个同类工具，说清「什么时候选它，什么时候选对方」。
不要贬低其他工具，写客观差异。

| 工具 | 优势 | 劣势 / 什么时候别选 |
| --- | --- | --- |
| 本工具 | … | … |
| 替代品 A | … | … |

## 坑与注意事项 / Caveats

填写说明：写你实际踩过的。没有就写「暂未发现」，不要留空。

- 退出码语义：`0` = 有匹配，`1` = 无匹配，`2` = 出错（写脚本时要注意）。
- 平台差异：…
- 性能陷阱：…

## 参考 / References

- 官方文档：https://example.com/docs
- 相关条目：[另一工具](./other-tool.md)
