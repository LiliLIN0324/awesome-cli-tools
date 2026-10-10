# 🧠 AI · 本地推理与模型管理 / Local Inference

> 在自己的机器上跑模型：拉取权重、量化、起本地 API、按需卸载。
> 选择这类工具时，**显存（或统一内存）比 CPU 型号重要得多**。

## 精选 / Top picks

- **[Ollama](https://github.com/ollama/ollama)** —— 上手成本最低：`ollama run` 一条
  命令完成下载+运行，同时暴露 OpenAI 兼容 API，方便其它 CLI 直接接。
  **代价**：抽象层多，调底层参数不如 llama.cpp 灵活。
- **[llama.cpp](https://github.com/ggml-org/llama.cpp)** —— 量化与后端支持的基准实现，
  是很多上层工具的地基。**代价**：参数繁多，需要了解 GGUF 与量化等级。
- **[llamafile](https://github.com/Mozilla-Ocho/llamafile)** —— 模型与运行时打包成
  单个可执行文件，拷到机器上就能跑，演示与离线分发最省事。**代价**：单文件体积大。
- **[vLLM](https://github.com/vllm-project/vllm)** —— 需要**服务多人**时的选择，
  连续批处理吞吐远超单机玩具级方案。**代价**：面向 GPU 服务器，消费级笔记本不适用。

## 全部条目 / All entries

| Tool | 中文说明 | English | Tags | License |
| --- | --- | --- | --- | --- |
| [Ollama](https://github.com/ollama/ollama) | 一条命令拉取并运行本地模型，暴露 OpenAI 兼容 API | Pull and run local models with one command, exposing an OpenAI-compatible API | `go`, `ai`, `offline`, `api` | MIT |
| [llama.cpp](https://github.com/ggml-org/llama.cpp) | GGUF 量化推理的参考实现，CPU/GPU 后端覆盖最广 | Reference GGUF inference engine with the widest CPU/GPU backend coverage | `c`, `ai`, `offline`, `quantization` | MIT |
| [llamafile](https://github.com/Mozilla-Ocho/llamafile) | 把模型与运行时打包为单个可执行文件，便于离线分发 | Bundles model and runtime into one executable for offline distribution | `c`, `ai`, `offline`, `single-file` | Apache-2.0 |
| [Ramalama](https://github.com/containers/ramalama) | 用容器镜像的方式管理本地模型与推理运行时 | Manages local models and runtimes using container images | `python`, `ai`, `containers`, `offline` | Apache-2.0 |
| [vLLM](https://github.com/vllm-project/vllm) | 高吞吐推理服务，支持连续批处理与多卡部署 | High-throughput inference server with continuous batching and multi-GPU support | `python`, `ai`, `server`, `gpu` | Apache-2.0 |
| [mistral.rs](https://github.com/EricLBuehler/mistral.rs) | Rust 实现的多模态推理引擎，内嵌进应用方便 | Rust inference engine with multimodal support, easy to embed in apps | `rust`, `ai`, `offline` | MIT |
| [MLX LM](https://github.com/ml-explore/mlx-lm) | Apple Silicon 原生推理与微调，统一内存下效率好 | Native Apple Silicon inference and fine-tuning, efficient with unified memory | `python`, `ai`, `apple-silicon` | MIT |
| [LM Studio](https://lmstudio.ai) | 图形界面为主的本地模型管理器，附带 `lms` 命令行 | GUI-first local model manager that also ships an `lms` CLI | `proprietary`, `api`, `offline` | 专有 / proprietary |
| [Text Embeddings Inference](https://github.com/huggingface/text-embeddings-inference) | 专用的向量化/重排服务，给 RAG 流水线用 | Dedicated embeddings and reranking server for RAG pipelines | `rust`, `ai`, `server`, `rag` | Apache-2.0 |
| [whisper.cpp](https://github.com/ggml-org/whisper.cpp) | 本地语音转写，CPU 上也能实时，适合接管道 | Local speech-to-text that runs in real time on CPU, pipe-friendly | `c`, `ai`, `offline`, `speech` | MIT |

## 组合用法 / Combinations

```bash
# 1) 拉起本地服务，再让别的 CLI 用它（OpenAI 兼容）
ollama serve &
ollama run qwen2.5-coder:7b "用一句话解释这段代码"

# 2) 让管道类工具走本地模型，数据不出机器
export OPENAI_API_BASE=http://localhost:11434/v1
export OPENAI_API_KEY=dummy
cat notes.md | llm -m openai "提取 5 个待办事项"

# 3) 批量转写：音频 → 文本 → 摘要，全本地
whisper-cli -f meeting.wav -otxt -of meeting
cat meeting.txt | ollama run llama3.2 "输出 3 条结论和 3 条待办"

# 4) 显存不够时的实用技巧：选小模型 + 降低上下文长度
ollama run qwen2.5:3b --parameter num_ctx 4096
```

## 注意事项 / Notes

- **先算显存再下模型**：以 4-bit 量化估算，权重约占 `参数量 × 0.6 GB`，
  还要给 KV cache 留空间。7B 在 8GB 显存上可行但要限制上下文长度。
- **上下文长度直接吃显存**。把 `num_ctx` 调到 32k 会让 KV cache 变成大头，
  在消费级显卡上比权重更容易爆。
- ⚠️ 本地服务的 11434 端口**没有鉴权**。默认只监听 localhost，
  不要为了「局域网方便」把它暴露到公网。
- 量化等级不是越高越好：Q4_K_M 通常是质量/体积的甜点，
  Q2/Q3 在小模型上掉点明显。
- Apple Silicon 的统一内存让大模型「能装下」，但带宽决定速度，
  别拿它和独显比 token/s。

## 相关 / See also

- [对话与模型调用](../ai-cli/chat-and-llm.md) —— 把本地模型接进管道
- [智能体运行时](../ai-cli/agent-runtime.md) —— 让本地模型驱动工具调用
- [云与容器](../general/cloud-and-containers.md) —— 用容器隔离推理环境
