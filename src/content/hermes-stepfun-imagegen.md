---
title: 用 StepFun 为 Hermes Agent 接入图片生成能力：零 GPU、零 ComfyUI、开箱即用
description: 这篇教程带你一步步把 Hermes Agent 接入 StepFun 图片生成后端，实现文生图、图片编辑和图生图，无需本地 GPU，也不依赖 ComfyUI。
date: '2026-07-10'
categories:
  - Hermes Agent
  - StepFun
  - Image Generation
  - Plugin
  - AI
published: true
---

如果你已经在用 Hermes Agent，但又苦于没有本地 GPU、不想折腾 ComfyUI，又希望把生图能力直接变成 Hermes 可调用的一等公民，那么这篇教程很适合你。

我会以**“从零到发布”**的方式，记录一次真实可复用的接入过程：本地插件开发、配置接入、功能验证、独立仓库打包、PyPI 发布、CI 与推广。

## 为什么选 StepFun

本地生图常见方案是 Stable Diffusion + ComfyUI，但这通常意味着：

- 需要 NVIDIA 显卡或 Apple Silicon
- 需要下载大体积模型和依赖
- 需要一定显存与系统配置
- 维护成本高，换机器就要重新配置

StepFun 的优势恰恰相反：

- **云端 API**：模型部署在服务端，本机只需要能发 HTTP 请求
- **延迟低**：`step-image-edit-2` 在 1-2 秒内可返回结果
- **能力强**：支持文生图、图片编辑、图生图
- **无需本地 GPU**：只要有 API Key 就能用
- **插件化接入**：可以直接挂进 Hermes 的 `image_gen` 体系

## 先确认你的环境

| 项目         | 要求                                        |
| ------------ | ------------------------------------------- |
| Hermes Agent | 已安装并可运行                              |
| Python       | 3.11+                                       |
| StepFun 账号 | 已注册，可访问 https://platform.stepfun.com |
| API Key      | 已创建，格式通常为 `step-...`               |

> 如果你还没有 StepFun 账号，先去平台注册并创建一个 API Key。

## 第一步：确认 Hermes 的插件目录结构

Hermes 的本地插件目录一般在：

```bash
~/.hermes/plugins/
```

图片生成插件一般放在：

```bash
~/.hermes/plugins/image_gen/
```

目前官方仓库中已经有一些参考实现，例如：

- `openai`
- `fal`
- `krea`
- `xai`

我们会新建一个目录，专门承载 StepFun 后端：

```bash
~/.hermes/plugins/image_gen/stepfun/
```

## 第二步：编写插件清单 `plugin.yaml`

先新建目录：

```bash
mkdir -p ~/.hermes/plugins/image_gen/stepfun
```

再创建 `plugin.yaml`：

```yaml
name: stepfun
version: '1.0.0'
description: StepFun image generation backend for Hermes Agent
requires_env:
  - STEPFUN_API_KEY
```

这里的 `requires_env` 很重要，它告诉 Hermes 这个插件启动前必须读取 `STEPFUN_API_KEY`，避免运行时才发现缺配置。

## 第三步：实现插件主逻辑

新建 `__init__.py`。这里的关键是实现 `ImageGenProvider`，并向 Hermes 暴露出三件事：

- 支持的模型列表
- 生图能力声明
- 真正的生成逻辑

### 模型与能力声明

```python
MODELS = [
    {"id": "step-image-edit-2", "name": "Step Image Edit 2", "speed": "fast"},
    {"id": "step-2x-large", "name": "Step 2X Large", "speed": "high-quality"},
    {"id": "step-1x-medium", "name": "Step 1X Medium", "speed": "balanced"},
]

CAPABILITIES = {
    "modalities": ["text", "image"],
    "max_prompt_length": 1024,
    "supports_edits": True,
    "supports_image_to_image": True,
}
```

### 生成逻辑的核心流程

```python
def generate(self, prompt, model=None, aspect_ratio="square", steps=4, seed=None):
    model_id = model or self.default_model()

    if model_id == "step-image-edit-2":
        return self._call_text_to_image(prompt, aspect_ratio, steps, seed)

    if model_id in ("step-2x-large", "step-1x-medium"):
        return self._call_image_to_image(prompt, aspect_ratio, steps, seed)

    raise ValueError(f"Unsupported model: {model_id}")
```

这意味着插件会在内部根据模型自动路由请求，而不是让上层手动判断。

## ⚠️ 避坑：两个 endpoint，两套计费

在我做完插件正式发 v0.1.0 之后用了一阵子，发现账单"诡异"——账户余额每天被扣几毛钱，但 Step Plan 订阅页面的 Credit 用量没怎么动。后来排查发现：

**StepFun 对同一个 API key 提供两套独立的 endpoint，走不同的计费通道**：

| 路径                                       | 计费方式                        | 适用                   |
| ------------------------------------------ | ------------------------------- | ---------------------- |
| `https://api.stepfun.com/v1/...`           | 账户余额按张扣钱（现金）        | 开放平台用户           |
| `https://api.stepfun.com/step_plan/v1/...` | 扣 Step Plan 订阅的 Credit 额度 | **Step Plan 订阅用户** |

**两个路径用同一个 key 都能通过认证**，但账单走完全不同的通道。我最初插件的默认 `STEPFUN_BASE_URL` 写的是 `/v1/...`，所以 Step Plan 订阅用户（包括我自己）也在被按张扣钱。

修复（v0.1.1 修复，1 行改动）：

```python
STEPFUN_BASE_URL = os.environ.get(
    "STEPFUN_BASE_URL",
    "https://api.stepfun.com/step_plan/v1"  # 改这里：从 /v1 改成 /step_plan/v1
)
```

> 如果你**不是** Step Plan 订阅用户（用的是普通开放平台账户 + 充值），保持默认 `/v1` 即可。
> 如果你是 **Step Plan 订阅用户**，升级到 0.1.1+ 之后所有调用会走 Credit 套餐，不再扣现金。

升级命令：

```bash
pip install --upgrade hermes-stepfun-imagegen
```

如果你想看完整的"症状 → 排查 → 修法"诊断流程（含可直接粘贴给你自己 agent 的 7 步排查 prompt），看 README 的 [Troubleshooting → My usage is billing my cash balance, not my Step Plan credit](https://github.com/lora-sys/hermes-stepfun-imagegen#troubleshooting)。

## 第四步：调用 StepFun API

StepFun 的图片生成接口通常采用类似 OpenAI 的 `/v1/images/generations` 风格，也可能提供专门的 edits 与 image2image 端点。这里主要注意三点：

- **请求头**带 `Authorization: Bearer ***`
- **参数**里要传 `model`、`prompt`，有时还要带 `size`、`n`
- **响应**里通常返回图片 URL 或 base64，需要本地落盘保存，便于 Hermes 后续读取

一个简化版调用思路如下：

```python
import os
import requests

API_KEY = os.environ["STEPFUN_API_KEY"]
BASE_URL = os.environ.get("STEPFUN_BASE_URL", "https://api.stepfun.com/v1")

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
}

payload = {
    "model": "step-image-edit-2",
    "prompt": prompt,
    "size": aspect_ratio_to_size(aspect_ratio),
    "n": 1,
}

resp = requests.post(
    f"{BASE_URL}/images/generations",
    headers=headers,
    json=payload,
    timeout=60,
)
resp.raise_for_status()
data = resp.json()
```

拿到返回后，再根据 URL 或 base64 保存为本地图片即可。

> 注意：StepFun 的 `size` 参数格式可能和常规写法不同。根据实际 API 文档，要确认它是用 `1024x1024`、`1024*1024` 还是 height x width 顺序。

## 第五步：配置 Hermes 启用插件

插件代码写好后，修改 Hermes 配置：

```yaml
plugins:
  enabled:
    - image_gen/stepfun

image_gen:
  provider: stepfun
  model: step-image-edit-2
```

再重启 Hermes：

```bash
hermes gateway restart
```

重启后，主模型调用 `image_generate` 工具就会自动走 StepFun。

## 第六步：本地验证三种模式

### 1. 文生图

提示词示例：

```text
A cute cat astronaut floating in space, digital art
```

预期行为：插件调用文生图接口，返回一张图片路径。

### 2. 图片编辑

上传一张现有图片，再给一个编辑指令：

```text
把这张图换成水墨画风格
```

预期行为：插件调用 edits 接口，返回修改后的图片。

### 3. 图生图

基于参考图生成新图：

```text
把这张照片转成梵高风格
```

预期行为：插件调用 image2image 接口，返回风格化后的图片。

> 如果你在本地已经完成验证，恭喜你，核心能力已经通了。

## 第七步：把插件独立成仓库

这一步的意义是：让插件变成可分享、可安装、可版本发布的独立项目，而不是只活在 `~/.hermes/plugins/` 里。

标准目录结构如下：

```bash
hermes-stepfun-imagegen/
├── pyproject.toml
├── README.md
├── LICENSE
└── src/
    └── hermes_stepfun_imagegen/
        ├── __init__.py
        └── plugin.yaml
```

`pyproject.toml` 里最关键的是 entry point：

```toml
[project.entry-points."hermes_agent.plugins"]
stepfun-imggen = "hermes_stepfun_imagegen"
```

这样别人就能直接：

```bash
pip install hermes-stepfun-imagegen
```

## 第八步：发布到 PyPI

进入仓库目录，构建并上传：

```bash
cd hermes-stepfun-imagegen
python -m build
twine upload dist/*
```

上传成功后，你的插件就变成了：

```bash
pip install hermes-stepfun-imagegen
```

## 第九步：GitHub Actions CI

为了让仓库看起来专业，也为了让发布更自动化，我们加一个 GitHub Actions workflow：

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  release:
    types: [published]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.11', '3.12']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}
      - run: pip install pytest pytest-cov
      - run: pip install -e .
      - run: python -m pytest tests/ -v --tb=short
      - run: pip install ruff
      - run: ruff check src/ tests/

  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'release'
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: pip install build twine
      - run: python -m build
      - run: twine check dist/*
      - run: twine upload dist/*
        env:
          TWINE_USERNAME: __token__
          TWINE_PASSWORD: ${{ secrets.PYPI_API_TOKEN }}
```

之后在 GitHub 仓库的 Settings → Secrets 里配置 `PYPI_API_TOKEN`，就可以实现“打 tag 就自动发布”。

## 第十步：推广到社区

仓库准备好了，接下来就是让更多人知道它。

### GitHub 优化

给仓库加上 Topics：

```bash
hermes-agent
stepfun
image-generation
ai-plugin
stable-diffusion
```

更新仓库描述，让它更容易被搜索到。

### Discord 社区

Nous Research Discord 的 `#plugins-skills-and-skins` 是官方推荐的插件分享渠道。文案思路：

```text
Hi everyone! I've built a StepFun image generation plugin for Hermes Agent.

Features:
- Text-to-image with step-image-edit-2 (~1-2s)
- Image editing
- Image-to-image with step-2x-large / step-1x-medium
- Drop-in plugin for ~/.hermes/plugins/image_gen/stepfun/

Requires STEPFUN_API_KEY from https://platform.stepfun.com

Feedback welcome!
```

### 内容平台

如果你的博客已经上线，这篇文章本身就是最好的入口。还可以把 Demo GIF、生成截图、对比评测一起放进去，形成完整的宣传素材。

## 小结

这篇文章记录了一个完整链路：

```text
Hermes Agent + StepFun API Key
    -> 本地插件开发
    -> 配置接入
    -> 功能验证
    -> 独立仓库
    -> PyPI 发布
    -> CI 自动化
    -> 社区推广
```

如果你只是想**本地用起来**，重点做好前三步就够了；如果你想**分享给社区**，第七步到第十步才真正决定项目能走多远。
