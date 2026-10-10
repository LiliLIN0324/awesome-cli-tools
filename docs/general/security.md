# 🔐 安全与加密 / Security & Crypto

> 密钥管理、敏感信息扫描、依赖与镜像漏洞、制品签名。这一类工具的**默认行为**
> 比功能多少更重要：是否能离线、是否把秘密写到磁盘、是否上传数据。

## 精选 / Top picks

- **[age](https://github.com/FiloSottile/age)** —— 现代文件加密，密钥短、
  语法简单，作为 `gpg` 的轻量替代。**代价**：没有 `gpg` 那套信任网络与
  身份体系，团队协作要靠自己的密钥分发约定。
- **[SOPS](https://github.com/getsops/sops)** —— 只加密配置文件里的**值**，
  结构仍然可 diff、可 code review。**代价**：需要配合 KMS/age/GPG 之一，
  多人协作时的密钥轮换要提前设计。
- **[gitleaks](https://github.com/gitleaks/gitleaks)** —— 提交前扫描密钥，
  支持 `git` 全历史与 pre-commit 集成，误报可基线化。
  **代价**：规则需要按团队调优，否则噪音会让人直接忽略告警。
- **[Trivy](https://github.com/aquasecurity/trivy)** —— 一个命令覆盖漏洞、
  配置错误、密钥、SBOM，CI 集成成本低。**代价**：首次拉数据库需要网络，
  离线环境要预先缓存。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [age](https://github.com/FiloSottile/age) | 现代、简单的文件加密工具，密钥短且可组合 | Modern, simple file encryption with short, composable keys | `go`, `crypto`, `encryption` | BSD-3-Clause |
| [SOPS](https://github.com/getsops/sops) | 加密 YAML/JSON/ENV 中选定的值，结构保持可见可 diff | Encrypts selected values in YAML/JSON/ENV while keeping structure diffable | `go`, `secrets`, `git` | MPL-2.0 |
| [pass](https://git.zx2c4.com/password-store) | 以 GPG + Git 为基础的密码管理器，纯 shell 可审计 | GPG and Git based password store, pure shell and fully auditable | `shell`, `secrets`, `gpg` | GPL-2.0-or-later |
| [Bitwarden CLI (bw)](https://github.com/bitwarden/clients) | 访问 Bitwarden 保险库的官方 CLI，可脚本化取密钥 | Official CLI for the Bitwarden vault, scriptable for fetching secrets | `node`, `secrets`, `vault`, `requires-login` | GPL-3.0 |
| [1Password CLI (op)](https://developer.1password.com/docs/cli/) | 用 `op run` 注入环境变量，避免密钥落盘 | Injects secrets via `op run` so they never touch disk | `proprietary`, `secrets`, `vault`, `requires-login` | 专有 / proprietary |
| [gitleaks](https://github.com/gitleaks/gitleaks) | 扫描仓库与提交历史中的密钥，支持基线抑制误报 | Scans repositories and history for secrets with baseline suppression | `go`, `secrets`, `git`, `ci` | MIT |
| [TruffleHog](https://github.com/trufflesecurity/trufflehog) | 检测并**验证**泄露凭据是否仍然有效 | Detects leaked credentials and verifies whether they are still live | `go`, `secrets`, `scanning` | AGPL-3.0 |
| [Trivy](https://github.com/aquasecurity/trivy) | 一站式扫描：容器镜像、文件系统、IaC、SBOM 与密钥 | All-in-one scanner for images, filesystems, IaC, SBOMs and secrets | `go`, `vulnerability`, `containers`, `ci` | Apache-2.0 |
| [Syft](https://github.com/anchore/syft) | 从镜像或目录生成 SBOM，格式可选 SPDX/CycloneDX | Generates SBOMs from images or directories in SPDX/CycloneDX | `go`, `sbom`, `containers` | Apache-2.0 |
| [Grype](https://github.com/anchore/grype) | 拿 SBOM 或镜像查已知漏洞，可与 Syft 串成流水线 | Finds known vulnerabilities in an SBOM or image, pairing well with Syft | `go`, `vulnerability`, `sbom` | Apache-2.0 |
| [OSV-Scanner](https://github.com/google/osv-scanner) | 用 OSV 数据库扫描锁文件里的依赖漏洞 | Scans lockfiles for dependency vulnerabilities using the OSV database | `go`, `dependencies`, `ci` | Apache-2.0 |
| [cosign](https://github.com/sigstore/cosign) | 容器镜像与制品的签名、验签，支撑供应链完整性 | Sign and verify container images and artifacts for supply-chain integrity | `go`, `signing`, `supply-chain` | Apache-2.0 |

## 组合用法 / Combinations

```bash
# 1) 加密一份要提交的配置（公钥加密，私钥自己保管）
age-keygen -o key.txt
age -r "$(grep '^# public key' key.txt | cut -d' ' -f4)" -o secret.age .env
age -d -i key.txt secret.age | diff - .env

# 2) SOPS + age：只有值被加密，YAML 结构还能 review
sops --encrypt --age "$PUBKEY" secrets.yaml > secrets.enc.yaml
sops --decrypt secrets.enc.yaml | yq '.database.host'

# 3) 提交前挡住密钥（比事后清理便宜太多）
gitleaks protect --staged -v
# 或者放进 pre-commit（见 dev-workflow）

# 4) 审计整段历史，评估「已经泄露过什么」
gitleaks detect --log-opts='--all' --report-format json --report-path leak.json

# 5) 供应链检查流水线：SBOM → 漏洞 → 签名
syft myapp:latest -o spdx-json > sbom.json
grype sbom:sbom.json --fail-on high
cosign verify --certificate-identity-regexp '.*' --certificate-oidc-issuer \
  https://token.actions.githubusercontent.com myapp:latest

# 6) 依赖漏洞扫描（CI 里最省事的一个）
osv-scanner --lockfile=pnpm-lock.yaml
```

## 注意事项 / Notes

- ⚠️ **`1Password CLI` / `Bitwarden CLI` 都会在你登录后把 token 落到本地**。
  共享机器上用 `op run` 这类「临时注入」模式，并在完成后 `op signout`。
- **不要把密钥打进镜像**。`docker build` 的层会被永久保存，即使后续 `rm` 也一样。
  构建期取密钥要用 BuildKit secret（`--secret`）。
- **扫描器噪音是主要问题**。先建基线（`gitleaks --baseline-path`），只对**新增**
  告警失败，否则团队会养成「直接忽略 CI」的习惯。
- **轮换比预防更常被忽略**：一旦密钥进入过 Git 历史，即使 `filter-repo` 删掉，
  也必须视为已泄露并轮换。
- `TruffleHog` 的「验证」功能会**主动请求第三方服务**确认凭据有效性。
  在受限网络或不希望产生外部请求的环境里要关掉该行为。
- 加密工具的选择最终取决于**密钥丢失时的恢复路径**，而不是算法强度。
  先把「谁有解密权限、丢钥匙怎么办」写清楚，再选工具。

## 相关 / See also

- [开发工作流](dev-workflow.md) —— 把扫描接进 pre-commit
- [云与容器](cloud-and-containers.md) —— 镜像与 K8s 的安全配置
- [AI · 智能体运行时](../ai-cli/agent-runtime.md) —— 给工具授权时的边界
