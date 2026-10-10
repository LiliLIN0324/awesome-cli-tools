# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 与
[语义化版本](https://semver.org/lang/zh-CN/)。文档库的版本号表示「收录条目的
批次」，不表示 API 兼容性。

## [Unreleased]

### Added
- 新增分类 [docs/general/platform-clients.md](docs/general/platform-clients.md)
  （内容平台客户端），首个条目：`bilibili-cli`

### Planned
- 补齐 `docs/general/media.md` 与 `docs/general/security.md` 的深度页
- 增加 Windows / PowerShell 专属条目分区
- 为每条深度页生成 star 趋势图（独立脚本，不写入仓库）

## [0.1.0] - 2026-10-10

### Added
- 初始骨架：`README.md`（中文）与 `README.en.md`（English）双索引
- 分类目录 `docs/ai-cli/`（4 类）与 `docs/general/`（9 类）
- 条目模板 `docs/templates/tool.md` 与两条示例深度页
- 收录标准 `docs/meta/criteria.md`、分类体系 `docs/meta/taxonomy.md`
- 校验脚本 `scripts/validate-entries.mjs`（表格结构 + 索引可达性）
- 链接巡检脚本 `scripts/check-links.mjs`（零依赖，Node 18+）
- GitHub Actions 工作流 `.github/workflows/ci.yml`
