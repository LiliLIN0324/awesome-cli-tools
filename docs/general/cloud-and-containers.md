# ☁️ 云与容器 / Cloud & Containers

> 容器运行时、Kubernetes 与基础设施即代码。这一类工具的共同风险是
> **一次误操作影响面很大**，所以「有 dry-run」「有 diff 预览」是重要加分项。

## 精选 / Top picks

- **[kubectl](https://github.com/kubernetes/kubectl)** —— 绕不开的基础设施接口，
  一切 GUI 与 TUI 最终都在调它。**代价**：输出冗长，`-o json | jq` 是必备搭配。
- **[k9s](https://github.com/derailed/k9s)** —— 集群的 TUI 控制台，
  看 Pod 状态、翻日志、进 shell 都快得多。**代价**：⚠️ 需登录/需 kubeconfig，
  且 TUI 里的危险操作（删除、scale）没有二次确认的体感。
- **[dive](https://github.com/wagoodman/dive)** —— 逐层查看镜像内容，找出
  「镜像为什么这么大」。**代价**：只分析本地已有镜像，需要先 `pull`/`build`。
- **[OpenTofu](https://github.com/opentofu/opentofu)** —— Terraform 的 MPL 分支，
  许可证变更后的开源选择，命令与状态格式兼容。**代价**：与 Terraform 的生态
  插件存在逐步分叉的风险，选之前确认需要的 provider 是否已支持。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [Docker CLI](https://github.com/docker/cli) | 容器构建与运行的标准工具链，生态与文档最完整 | The standard container build-and-run toolchain with the broadest ecosystem | `go`, `containers`, `standard` | Apache-2.0 |
| [Podman](https://github.com/containers/podman) | 无守护进程、支持 rootless 的容器引擎，命令行与 Docker 兼容 | Daemonless, rootless container engine with a Docker-compatible CLI | `go`, `containers`, `rootless` | Apache-2.0 |
| [lazydocker](https://github.com/jesseduffield/lazydocker) | Docker 的 TUI：容器、镜像、卷、日志一屏管理 | Docker TUI for containers, images, volumes and logs in one screen | `go`, `containers`, `tui` | MIT |
| [dive](https://github.com/wagoodman/dive) | 逐层分析镜像内容，量化每一层带来的体积增长 | Inspects image layers to quantify what each layer adds to size | `go`, `containers`, `image` | MIT |
| [kubectl](https://github.com/kubernetes/kubectl) | Kubernetes 官方命令行，所有操作与调试的入口 | The official Kubernetes CLI, entry point for operations and debugging | `go`, `k8s`, `standard`, `requires-login` | Apache-2.0 |
| [k9s](https://github.com/derailed/k9s) | Kubernetes 集群 TUI 控制台，实时刷新资源与日志 | Kubernetes cluster TUI console with live resources and logs | `go`, `k8s`, `tui`, `requires-login` | Apache-2.0 |
| [helm](https://github.com/helm/helm) | Kubernetes 包管理器，用模板与 values 管理发布 | Kubernetes package manager using templates and values | `go`, `k8s`, `packaging` | Apache-2.0 |
| [kustomize](https://github.com/kubernetes-sigs/kustomize) | 无模板的清单叠加与覆盖，适合多环境差异化配置 | Template-free manifest overlay for per-environment differences | `go`, `k8s`, `config` | Apache-2.0 |
| [kind](https://github.com/kubernetes-sigs/kind) | 用容器跑本地 K8s 集群，CI 里最容易复现的方案 | Runs local Kubernetes clusters in containers, the easiest CI-reproducible option | `go`, `k8s`, `local-dev`, `ci` | Apache-2.0 |
| [stern](https://github.com/stern/stern) | 按正则聚合多个 Pod 的日志，带颜色区分来源 | Tails logs from multiple pods matching a regex, color-coded by source | `go`, `k8s`, `logs` | Apache-2.0 |
| [Terraform](https://github.com/hashicorp/terraform) | 主流的基础设施即代码工具，plan/apply 工作流成熟 | The mainstream infrastructure-as-code tool with a mature plan/apply flow | `go`, `iac`, `cloud` | BUSL-1.1 |
| [OpenTofu](https://github.com/opentofu/opentofu) | Terraform 的开源分支，命令与状态格式基本兼容 | Open-source fork of Terraform with largely compatible commands and state | `go`, `iac`, `cloud`, `open-source` | MPL-2.0 |
| [Pulumi](https://github.com/pulumi/pulumi) | 用通用编程语言写基础设施，支持类型检查与测试 | Define infrastructure in general-purpose languages with typing and tests | `go`, `iac`, `cloud` | Apache-2.0 |
| [AWS CLI](https://github.com/aws/aws-cli) | AWS 官方命令行，覆盖所有服务与 `--dry-run` 能力 | Official AWS CLI covering every service, with `--dry-run` support | `python`, `cloud`, `aws`, `requires-login` | Apache-2.0 |

## 组合用法 / Combinations

```bash
# 1) 找「哪个 Pod 在重启」并且只看关键列
kubectl get pods -A --sort-by=.status.containerStatuses[0].restartCount \
  -o custom-columns='NS:.metadata.namespace,POD:.metadata.name,RESTARTS:.status.containerStatuses[0].restartCount'

# 2) 聚合日志，按 deployment 过滤
stern -n prod 'web-.*' --since 15m

# 3) 定位镜像膨胀的层
dive myapp:latest

# 4) 变更前必须先看 plan，再决定是否 apply
terraform plan -out=tfplan && terraform show tfplan
tofu plan -out=tfplan && tofu apply tfplan

# 5) 本地起集群验证清单，不碰线上
kind create cluster --name scratch
kubectl apply --dry-run=server -f manifests/
kind delete cluster --name scratch

# 6) 进容器排查（优先用临时容器，避免污染业务镜像）
kubectl debug -it pod/web-0 --image=nicolaka/netshoot --target=web
```

## 注意事项 / Notes

- ⚠️ **`plan` 与 `apply` 必须是两步**。`terraform apply -auto-approve` 在没有
  审阅 plan 的情况下等于盲操作，生产环境不要这样用。
- **许可证变化**：Terraform 自 1.6 起改为 BUSL-1.1，不再是纯开源；商业使用
  前请阅读条款，或评估 OpenTofu。
- **K8s 的上下文就是权限边界**。多条 kubeconfig 时先 `kubectl config
  current-context` 确认，再执行删除类命令。
- `docker build` 默认会把构建上下文整个发给守护进程，`.dockerignore`
  缺失会显著拖慢并可能把密钥打进镜像。
- `k9s`/`lazydocker` 这类 TUI 里删除资源通常**没有强确认**，习惯上把
  「危险操作」留在 `kubectl`/`docker` 命令行里做，TUI 只用来看。

## 相关 / See also

- [网络与调试](network.md) —— 排查容器网络
- [安全与加密](security.md) —— 镜像与依赖扫描
- [开发工作流](dev-workflow.md) —— `act` 需要容器运行时
