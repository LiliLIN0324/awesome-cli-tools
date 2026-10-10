<div align="center">

# Awesome CLI Tools

**A curated, bilingual (zh-CN / en) documentation hub for command-line tools.**

[![License: CC0-1.0](https://img.shields.io/badge/license-CC0--1.0-lightgrey.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Node 18+](https://img.shields.io/badge/node-%3E%3D18-informational.svg)](package.json)

[中文](README.md) · [English](README.en.md)

</div>

---

## What this is

A **hand-curated** documentation library for command-line tools. Unlike the usual
awesome list, it optimizes for three things:

1. **Machine-checkable** — every entry is a structured table row. `npm run validate`
   checks the schema, index reachability and duplicate entries.
2. **Actionable** — each entry answers *what problem it solves*, *what it overlaps
   with*, and *when NOT to use it*, instead of just dropping a link.
3. **Bilingual by row** — the Chinese and English descriptions live in the same
   table row, so the two language versions cannot drift apart.

Scope covers two worlds: **AI / LLM CLIs** and **general-purpose productivity CLIs**.

## Browse

| Category | File | Notes |
| --- | --- | --- |
| 📚 Overview | [AI CLIs](docs/ai-cli/README.md) · [General CLIs](docs/general/README.md) | Start here, then jump to a category |
| 🧠 AI · Coding agents | [docs/ai-cli/coding-agents.md](docs/ai-cli/coding-agents.md) | Agents that read/edit repos, run tests, open PRs |
| 🧠 AI · Chat & piping | [docs/ai-cli/chat-and-llm.md](docs/ai-cli/chat-and-llm.md) | One-shot prompts, piping LLM calls, prompt plumbing |
| 🧠 AI · Local inference | [docs/ai-cli/local-inference.md](docs/ai-cli/local-inference.md) | Local model runners, quantization, GPU/CPU backends |
| 🧠 AI · Agent runtime | [docs/ai-cli/agent-runtime.md](docs/ai-cli/agent-runtime.md) | MCP protocol, tool orchestration, agent hosts |
| 🔍 General · Search & navigation | [docs/general/search.md](docs/general/search.md) | Better `find` / `grep` / jump-to-file |
| 👀 General · Viewers | [docs/general/viewers.md](docs/general/viewers.md) | Highlighted, paged, structured previews |
| 🧾 General · Text & data | [docs/general/text-and-data.md](docs/general/text-and-data.md) | JSON/YAML/CSV wrangling, batch edits, benchmarking |
| 🛠 General · Dev workflow | [docs/general/dev-workflow.md](docs/general/dev-workflow.md) | Git, task runners, env vars, code review |
| ☁️ General · Cloud & containers | [docs/general/cloud-and-containers.md](docs/general/cloud-and-containers.md) | Containers, Kubernetes, infrastructure as code |
| 🌐 General · Network & debugging | [docs/general/network.md](docs/general/network.md) | HTTP clients, DNS, packet capture |
| 🔐 General · Security & crypto | [docs/general/security.md](docs/general/security.md) | Secret management, scanning, signing, hashing |
| 🎬 General · Media | [docs/general/media.md](docs/general/media.md) | Transcoding, image compression, terminal recording |
| 🧩 General · Platform clients | [docs/general/platform-clients.md](docs/general/platform-clients.md) | Terminal clients for content platforms (auth-aware, structured output) |
| 🐚 General · Shell & prompt | [docs/general/shell-and-prompt.md](docs/general/shell-and-prompt.md) | Prompts, directory jumping, history, modern shells |

### Guides & conventions

| Document | Notes |
| --- | --- |
| [docs/meta/criteria.md](docs/meta/criteria.md) | Inclusion criteria — what gets rejected |
| [docs/meta/taxonomy.md](docs/meta/taxonomy.md) | Taxonomy and tagging rules |
| [docs/guides/evaluate-a-cli.md](docs/guides/evaluate-a-cli.md) | How to evaluate a CLI: install cost, scriptability, exit codes |
| [docs/guides/dotfiles-and-setup.md](docs/guides/dotfiles-and-setup.md) | Build a comfortable terminal environment from scratch |
| [docs/templates/tool.md](docs/templates/tool.md) | Deep-dive template — copy it to add an entry |
| [docs/tools/README.md](docs/tools/README.md) | Deep-dive index |
| [docs/meta/repo-setup.md](docs/meta/repo-setup.md) | Repo setup checklist: placeholders, topics, branch protection |

## Find by need

| I want to… | Read |
| --- | --- |
| Let an AI edit code from my terminal | [coding-agents](docs/ai-cli/coding-agents.md) |
| Pipe command output into a model | [chat-and-llm](docs/ai-cli/chat-and-llm.md) |
| Run models fully offline | [local-inference](docs/ai-cli/local-inference.md) |
| Browse a video site / export subtitles | [platform-clients](docs/general/platform-clients.md) |
| Replace `grep` + `find` + `ls` | [search](docs/general/search.md) + [viewers](docs/general/viewers.md) |
| Wrangle a pile of JSON / CSV | [text-and-data](docs/general/text-and-data.md) |
| Type `cd` and `git` far less | [shell-and-prompt](docs/general/shell-and-prompt.md) |
| Debug a production service | [network](docs/general/network.md) + [cloud-and-containers](docs/general/cloud-and-containers.md) |

**How to read this repo**: start from the *Top picks* section in a category file
(3–5 entries with explicit trade-offs), then open the deep-dive page under
`docs/tools/`. Install steps, configuration and caveats live there.

## Local development

```bash
git clone https://github.com/LiliLIN0324/awesome-cli-tools.git
cd awesome-cli-tools

npm run validate    # schema + index reachability checks
npm run stats       # entry counts per category
npm run check:links # external link sweep (network required)
```

Zero runtime dependencies — Node.js 18+ only (uses built-in `fetch`).

## Contributing

New entries, corrections and deep-dive pages are all welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md) and the
[inclusion criteria](docs/meta/criteria.md) first, and make sure
`npm run validate` passes before opening a PR.

## Credits

Inspired by the list format of
[sindresorhus/awesome](https://github.com/sindresorhus/awesome), with an extra
requirement: structured, verifiable data.

## License

Content is released under [CC0-1.0](LICENSE). Tool names, trademarks and links
belong to their respective owners; this repository ships no third-party software.
