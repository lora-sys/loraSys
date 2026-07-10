---
title: 用 MiniMax（海螺）为 Hermes Agent 接入图片 + 视频生成：image-01 文生图、 Hailuo-2.3 文生视频一条龙
description: 这篇教程记录了从零到 PyPI 的完整流程：本地开发两个 minimax 插件（image-01 T2I+I2I、Hailuo-2.3 T2V+I2V 异步轮询），CI 自动化、CN endpoint 优先、双 region 自动 fallback，3 张示例图 + 1 个 demo.gif 让你看效果。
date: '2026-07-10'
categories:
  - Hermes Agent
  - MiniMax
  - Image Generation
  - Video Generation
  - Plugin
  - AI
published: true
---

如果你已经在用 Hermes Agent，但没有本地 GPU、也不想折腾 ComfyUI，那么这篇教程很适合你。我会把 [MiniMax（海螺 / minimax）](https://www.minimax.io) 的图片和视频生成能力同时接进 Hermes，并且在一个 pip 包里发布两套后端：**`hermes-minimax-media`**，覆盖文生图、图生图、文生视频、图生视频、人物参考视频五种模式。

整个过程我用的是真实的 CN endpoint（`api.minimaxi.com`）和真实的 API key 跑通端到端。

## 为什么选 MiniMax

Hermes Agent 内置的 `image_generate` 工具原本只支持少数几个海外后端（FAL、xAI、OpenAI、Krea、Replicate）。MiniMax 海螺这边有两个我特别想用的能力：

- **`image-01`**：单 API 同时支持文生图和图生图（`subject_reference` 单参考图），出图质量稳定，单张图消耗低
- **Hailuo 系列视频模型**：异步任务模型，支持文生视频、图生视频、首尾帧视频、人物参考视频。1080P 25fps 真实可用，不是 demo 玩具

而且 MiniMax 有两个 endpoint：

| 区域               | 域名               | 用户中心                   |
| ------------------ | ------------------ | -------------------------- |
| **国内（CN）**     | `api.minimaxi.com` | <https://api.minimaxi.com> |
| **国际（global）** | `api.minimax.io`   | <https://www.minimax.io>   |

插件会自动选：CN 优先（你用的是国内账户就走国内），global 作为兜底。

## 实现一个插件要做什么

Hermes 提供的 `ImageGenProvider` 和 `VideoGenProvider` 两个抽象类都已经把脏活干完了（环境变量加载、URL 缓存、错误格式化）。我们只需要写两个文件：

```text
~/.hermes/plugins/image_gen/minimax/
├── __init__.py        # 业务逻辑
└── plugin.yaml        # 插件元数据

~/.hermes/plugins/video_gen/minimax/
├── __init__.py
└── plugin.yaml
```

`plugin.yaml` 极简：

```yaml
name: minimax
version: 1.0.0
description: 'MiniMax image generation backend. ...'
author: NousResearch
kind: backend
```

## image-01 后端实现要点

主要工作是组装 HTTP 请求。文档里几个非显然的点：

1. **路径用 `aspect_ratio` 而不是 size**（和 OpenAI、StepFun 不一样）：

   ```json
   {
   	"model": "image-01",
   	"prompt": "a tiny red apple on a white plate, studio lighting",
   	"aspect_ratio": "1:1", // 不是 "1024x1024"
   	"response_format": "url", // 还可以是 "base64"
   	"n": 1,
   	"prompt_optimizer": true
   }
   ```

2. **图生图用 `subject_reference` 包裹图片 URL**：

   ```json
   "subject_reference": [
     { "type": "character", "image_file": "https://..." }
   ]
   ```

3. **返回结构是嵌套的**：

   ```json
   {
   	"data": { "image_urls": ["https://..."] },
   	"metadata": { "success_count": "1" },
   	"base_resp": { "status_code": 0, "status_msg": "success" }
   }
   ```

把请求组装好、调用 `_call_api`、拿到 URL 后用 Hermes 自带的 `save_url_image` 落盘到 `~/.hermes/cache/images/`，整个 generate 流程就完了。

## Hailuo 视频后端实现要点

视频生成和图片最大的区别是**异步**：

```text
1. POST  /v1/video_generation          → task_id
2. GET   /v1/query/video_generation    (10s 轮询)  → file_id
3. GET   /v1/files/retrieve?file_id=…  → download_url
4. GET   <download_url>                → 字节流 → 本地缓存
```

超时策略：单次任务最长 5 分钟，10 秒轮询一次。Hailuo-2.3 6s 768P 实测 30-90 秒返回，10s 1080P 偶尔会 3-4 分钟。模型选择上要注意：

| 模型                 | 6/10s | 768P/1080P | T2V | I2V | 人物参考 |
| -------------------- | ----- | ---------- | --- | --- | -------- |
| `MiniMax-Hailuo-2.3` | ✅    | ✅         | ✅  | ✅  | ❌       |
| `MiniMax-Hailuo-02`  | ✅    | ✅         | ✅  | ✅  | ❌       |
| `S2V-01`             | 只 6s | 只 1080P   | ❌  | ❌  | ✅       |

⚠️ 一个坑：官方文档示例里写的是 `720P`，但**实际 API 不接受**。提交 `720P` 会立刻报错 `does not support resolution 720P, supported resolutions: 768P, 1080P`。我的插件把 `720P` 自动 coerce 成 `768P`，调用方可以无感。

## 端到端测试效果

### image-01 文生图（1:1 方形）

> `a tiny red apple on a white plate, studio lighting, photorealistic`

![Apple on plate](https://raw.githubusercontent.com/lora-sys/hermes-minimax-media/main/docs/assets/screenshot-apple.jpg)

单图 5 秒左右返回，~150KB。

### image-01 文生图（16:9 横向）

> `a cute cat astronaut floating in a colorful nebula, digital art, vibrant`

![Cat astronaut](https://raw.githubusercontent.com/lora-sys/hermes-minimax-media/main/docs/assets/screenshot-cat-astronaut.png)

> `futuristic tokyo cityscape at night, neon lights, rain reflections, cyberpunk`

![Cyberpunk city](https://raw.githubusercontent.com/lora-sys/hermes-minimax-media/main/docs/assets/screenshot-city.png)

### Hailuo-2.3 文生视频（6s @ 768P）

> `a calico cat napping in a sunbeam, soft cinematic lighting, gentle breathing motion`

![Demo GIF](https://raw.githubusercontent.com/lora-sys/hermes-minimax-media/main/docs/assets/demo.gif)

[MP4 原片 (608KB)](https://github.com/lora-sys/hermes-minimax-media/blob/main/docs/assets/screenshot-cat-napping.mp4)

86 秒返回，输出 1366×768 h264 mp4，每帧都有微小变化（呼吸感）。

## 本地接入步骤

### 1. 安装包

```bash
pip install hermes-minimax-media
```

### 2. 配 key

编辑 `~/.hermes/.env`：

```bash
# CN endpoint（你目前在用的）
MINIMAX_CN_API_KEY=eyJ...

# 国际 endpoint（兜底）
MINIMAX_API_KEY=eyJ...
```

### 3. 启用插件

编辑 `~/.hermes/config.yaml`：

```yaml
plugins:
  enabled:
    - image_gen/minimax
    - video_gen/minimax
    # ... 其他插件

image_gen:
  provider: minimax
  minimax:
    model: image-01

video_gen:
  provider: minimax
  minimax:
    model: MiniMax-Hailuo-2.3 # 或 Hailuo-02 / S2V-01
```

### 4. 重启 Hermes

```bash
hermes gateway restart
```

之后直接对 Hermes 说：

- "画一只戴墨镜的猫" → 走 image-01
- "做一个 6 秒的城市黄昏延时摄影" → 走 Hailuo-2.3
- "让这张海浪照片动起来"（+ 传 image_url） → 走 Hailuo-2.3 I2V
- "让这个角色挥手"（+ 传人物照片） → 走 S2V-01

## 仓库里有什么

整个项目都开源在 [github.com/lora-sys/hermes-minimax-media](https://github.com/lora-sys/hermes-minimax-media)：

- `src/hermes_minimax_media/plugins/image_gen/minimax/` — image-01 后端
- `src/hermes_minimax_media/plugins/video_gen/minimax/` — Hailuo 视频后端
- `tests/` — 20 个 pytest 用例（不需要 API key）
- `.github/workflows/ci.yml` — py3.11/3.12 测试 + ruff lint + tag 时自动发 PyPI
- `docs/assets/` — README 用的 3 张示例图 + 1 个 demo.gif

## 端到端验证记录

我跑过的真实结果（不靠模拟）：

| 验证项                               | 结果                                                     |
| ------------------------------------ | -------------------------------------------------------- |
| `image-01` T2I 调 `api.minimaxi.com` | ✅ 5 秒返回 155KB jpg                                    |
| `Hailuo-2.3` T2V 异步提交            | ✅ task_id 立即返回                                      |
| 10s 轮询 task status                 | ✅ 86 秒变 Success                                       |
| 解析 `file_id` + `download_url`      | ✅ 拿到 608KB mp4                                        |
| 双 endpoint 自动选 CN                | ✅ env 设了 `MINIMAX_CN_API_KEY` 时走 `api.minimaxi.com` |
| `pip install -e .` 包级导入          | ✅ 两个 provider 都能 import                             |
| `pytest tests/`                      | ✅ 20 passed                                             |
| `ruff check src/ tests/`             | ✅ All checks passed                                     |
| `twine upload dist/*`                | ✅ https://pypi.org/project/hermes-minimax-media/        |

## 和之前 StepFun 那篇的关系

我之前写过一篇 [用 StepFun 给 Hermes 接入图片生成](https://github.com/lora-sys/loraSys/blob/main/src/content/hermes-stepfun-imagegen.md)，流程上是同构的（本地插件 → PyPI → CI → 博客），但这两个插件互补：

- **StepFun**：`step-image-edit-2` 极快（1-2 秒），适合对话中快速出图迭代；图编辑是它的强项
- **MiniMax**：`image-01` 质量稳，**还多一个视频能力**；如果你需要"图"和"视频"同时在一个后端里，minimax 这套更划算

而且两个插件可以**同时启用**，在 `config.yaml` 里改 `image_gen.provider` 就能切换，不需要卸载任何一个。

## 下一步计划

- 跑 `image-01` 的 i2i（subject_reference）真实样例
- 跑 `S2V-01` 人物参考视频的真实样例
- 适配 `Hailuo-02` 的 start-end frame 模式（传 first_frame_image + last_frame_image 两个 url）

如果你也想接 MiniMax、但懒得自己写包，[`hermes-minimax-media`](https://github.com/lora-sys/hermes-minimax-media) 直接 `pip install` 就能用，遇到问题在 GitHub 提 issue 即可。
