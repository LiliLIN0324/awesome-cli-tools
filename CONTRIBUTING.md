# 贡献指南 / Contributing

感谢你愿意花时间完善这份清单。为了让内容长期可维护，本项目对格式有强制要求
（CI 会检查）。

## 两种贡献形式

### 1. 往分类表格里加一行（最常见）

1. 找到对应的分类文件，例如 `docs/general/search.md`。
2. 在**正确的小节**追加一行，列数必须是 5，顺序固定：

   | 列 | 内容 | 示例 |
   | --- | --- | --- |
   | `Tool` | Markdown 链接，指向**官方仓库或官网** | `[ripgrep](https://github.com/BurntSushi/ripgrep)` |
   | `中文说明` | 一句话：解决什么问题（不要写「很棒的工具」） | 递归搜索，默认遵守 `.gitignore` |
   | `English` | 同一句的英文，风格一致 | Recursive search that respects `.gitignore` by default |
   | `Tags` | 反引号包裹、逗号分隔，见分类体系 | `` `rust`, `grep` `` |
   | `License` | SPDX 标识符；不确定就写 `见仓库 / see repo` | `MIT OR Apache-2.0` |

3. 运行校验：

   ```bash
   npm run validate
   ```

### 2. 新增一个深度页

复制 `docs/templates/tool.md` 到 `docs/tools/<slug>.md`，填完所有小节（不要留空），
然后在 `docs/tools/README.md` 的索引表加一行。

深度页应该包含**本地实测过**的内容：至少一条你亲手跑过的命令、一个你踩过的坑。
没有实测过的内容请只提供分类表格里的那一行，不要写深度页。

## 会被拒绝的情况

见 [docs/meta/criteria.md](docs/meta/criteria.md)。摘要：

- 已归档 / 超过 18 个月无提交，且无活跃分支
- 需要付费账号才**能启动**（仅高级功能付费可以）
- 二进制分发无来源、无法审计
- 未说明许可证，或许可证禁止商用而说明里没写清
- 与已有条目高度重复且没有明确取舍场景
- 说明书式的大段复制（请用自己的话写，或引用官方文档链接）

## 格式细节

- 表格内不要换行；需要补充说明就写深度页。
- 排序：同一小节内按**使用频率/推荐度**排，不按字母序。
- 不要加图片外链（避免链接腐烂和加载失败）。终端录屏请用 asciinema 链接并放在深度页。
- 星标数、下载量等易变数据**不写入**仓库。需要就写脚本在本地拉取。
- 中英两列必须语义一致；只改中文不改英文的 PR 会被要求补齐。

## 提交信息

使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)：

```
feat(general/search): add fd
fix(ai-cli/chat-and-llm): correct mods license to MIT
docs(templates): clarify tags column
```

## 开发环境

```bash
npm run validate     # 必过
npm run stats        # 查看各分类数量
npm run check:links  # 可选，需要网络；GitHub API 限流时可能有假阳性
```

零依赖，Node.js 18+ 即可，不需要 `npm install`。

## 行为准则

保持技术讨论、对事不对人。不接受攻击性言论、垃圾推广链接、以及灌水式的
「+1 我也觉得好用」评论。
