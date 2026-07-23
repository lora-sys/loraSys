# LORA-SYS 3D Interactive Portfolio Upgrade Plan v1.0

## 1. 项目定位

将现有 LORA-SYS 个人网站升级为一个具有连续空间叙事的 3D 互动个人档案馆。

升级后的产品不是传统“3D 作品集模板”，也不是自由移动的网页游戏，而是一套：

**Editorial Ink × Industrial Systems × Cinematic Interaction**

核心表达：

> The Living Archive  
> 一个随着项目、能力和经历持续生长的个人数字档案馆。

保留现有网站的墨刊、章节汉字、纸张、印章和编辑排版语言，在此基础上加入可控的 3D 场景、空间转场和项目交互。

---

## 2. 核心升级目标

### 2.1 视觉目标

保留并强化以下现有识别元素：

- 黑白宣纸
- 墨迹与红色印章
- 大号中文章节字
- 编辑式网格排版
- 黑色工业材质
- 暗金色细线
- 高对比衬线标题

建议视觉比例：

- 60% 墨刊编辑设计
- 25% 工业机械系统
- 15% 科幻光效

避免：

- 蓝紫霓虹赛博朋克
- 大面积玻璃拟态
- 通用星空地球模板
- 过度游戏化 HUD
- 所有项目都变成随机机械模型

### 2.2 体验目标

访问者应当在 30 秒内理解：

1. LORA-SYS 是谁
2. 主要在构建什么
3. 最重要的三个项目是什么
4. 为什么这些项目值得查看
5. 如何进入源码、Demo 或联系方式

3D 用来制造空间感、情绪和记忆点。

HTML 内容层负责：

- 项目信息
- 文案
- 按钮
- 架构图
- 截图
- SEO
- 无障碍访问

### 2.3 工程目标

- 保留现有内容数据，不重新硬编码两套项目数据
- 页面在普通笔记本上保持稳定
- 移动端提供独立的简化体验
- 支持 Reduced Motion
- 支持纯 2D Archive 模式
- 3D 资源按场景加载，不一次性加载整站
- 所有页面均可通过导航直接访问

---

## 3. 整体用户旅程

```text
01 Entry / 墨滴入口
        ↓
02 Hero / 墨核启动
        ↓
03 Self / 个人档案
        ↓
04 Capability Engine / 能力引擎
        ↓
05 Timeline / 构建历程
        ↓
06 Project Orbit / 项目星轨
        ↓
07 Project Focus / 项目详情
        ↓
08 Hackathon / 战役档案
        ↓
09 Off-Hours / 深夜放映室
        ↓
10 Contact / 信号传递
```

网站采用一条连续的 Cinematic Scroll 作为默认体验。

右上角提供两种模式：

- Cinematic：预设镜头路径
- Explore：有限范围内探索场景

Explore 不是完全自由漫游，不默认使用 WASD。

---

## 4. 页面升级方案

## 4.1 Entry：墨滴入口

### 核心画面

- 宣纸纹理覆盖整个视口
- 中央悬浮一滴墨水
- 墨滴下方出现轻微涟漪
- 大号「序」字位于视觉中心偏下
- 左侧显示章节索引
- 底部显示 Scroll to Enter
- 左下角显示 Archive 初始化状态

### 交互

首次进入：

1. 墨滴缓慢形成
2. 页面加载完成后墨滴进入呼吸状态
3. 用户滚动时墨滴下坠
4. 墨水撞击纸面
5. 墨迹扩散
6. 纸面被打开，镜头进入 Hero

Reduced Motion：

- 不播放镜头穿越
- 使用墨迹淡入转场

---

## 4.2 Hero：墨核系统

### 核心画面

左侧：

- I build systems that learn.
- 中文说明
- Explore Archive CTA

中央：

- 3D 墨核
- 纸张碎片
- 机械轨道
- 内部能量核心

右侧：

- AI Agents
- Full-stack Systems
- Web3 Protocols

底部：

- Public Repositories
- Hackathons
- Years Building
- Since 2022

### 交互

- 鼠标移动：轻微相机视差
- Hover 能力轨道：对应结构高亮
- 点击能力轨道：跳转 Capability Engine
- 点击 Explore Archive：进入 Project Orbit
- 页面继续滚动：墨核展开并释放章节轨道

---

## 4.3 Self：个人档案

不制作 3D 人物。

页面形态为悬浮档案桌：

- 个人介绍
- 学习经历
- 当前方向
- GitHub 信息
- 所在城市与年份
- 当前正在构建的项目

纸张、图章和档案标签可产生轻微纵深和视差。

---

## 4.4 Capability Engine：能力引擎

围绕五项核心能力组织：

- Reason
- Build
- Orchestrate
- Ship
- Evolve

不是技术栈星图。

每个能力点击后展开：

- 核心方法
- 对应技术
- 对应项目
- 实际成果

示例：

```text
Orchestrate
├── Multi-agent
├── MCP
├── Memory
├── Harness
├── Consensus
└── Tool Registry
```

视觉上应当是 Hero 墨核的内部剖面，而不是独立的信息图页面。

---

## 4.5 Timeline：构建历程

将年份设计为一条逐渐复杂的工程蓝图。

```text
2022  Begin
2024  Explore
2025  Build
2026  Ship
```

不同阶段显示：

- 学习节点
- 项目节点
- 技术方向
- 黑客松
- 系统构建能力
- 当前进行中的项目

不采用 RPG 式开门选关结构。

---

## 4.6 Project Orbit：项目星轨

项目分为两层：

### Flagship Projects

- AI Company OS
- Agent Runtime / Harness
- Second Brain

### Experiments

- TradingOS
- Moss
- Tarot DApp
- MonadMon
- 其他实验项目

旗舰项目位于主轨道，尺寸更大，拥有完整 3D 表达。

实验项目作为较小的档案节点或卫星存在。

### 交互状态

需要设计三个明确状态：

1. Default
2. Project Hover
3. Project Selected

Hover 时：

- 当前项目亮起
- 显示一句话说明
- 其他项目降低透明度
- 展示相关能力节点

Selected 时：

- 相机缓慢聚焦
- 当前项目进入中央
- 打开 Project Focus
- 其他项目退入背景

---

## 4.7 Project Focus：项目详情

首个完整案例使用 AI Company OS。

页面结构：

```text
项目名称
一句话价值
技术标签
Live Demo
View Code

关键成果数字

Problem
Solution
Impact

产品截图
系统架构
核心机制
开发过程
相关内容
```

布局建议：

- 左侧：3D 项目实体
- 右侧：标题、描述、操作
- 下方：数据、截图和架构
- 项目详情允许向下滚动，不要求一屏塞完

所有正文和按钮使用 HTML。

---

## 4.8 Hackathon：战役档案

每场黑客松作为一个战役档案。

展示：

- 活动名称
- 参赛时间
- 项目
- 角色
- 时间限制
- 技术挑战
- 最终成果
- 失败与恢复过程

核心叙事：

```text
Challenge
Decision
Build
Failure
Recovery
Ship
```

---

## 4.9 Off-Hours：深夜放映室

完整版本为可探索的深夜房间。

包含：

- CRT 显示器
- 唱片机
- 海报
- 动漫
- 电影
- 音乐
- 城市夜景
- 桌面手稿

第一版采用 2.5D：

- 高质量房间背景
- 局部 3D 物体
- 视差效果
- CRT 动态纹理
- 可点击热点

第二阶段再升级为完整 3D 场景。

---

## 4.10 Contact：信号传递

结尾不采用科幻传送门。

推荐方式：

1. 项目纸张、代码和节点重新聚合
2. 形成一枚 LORA-SYS 印章
3. 墨水扩散
4. 展示 Email、GitHub、X、LinkedIn
5. 发送操作显示 Signal transmitted
6. 页面回归档案封面

形成首尾闭环。

---

## 5. 全局导航

顶部导航保留：

```text
己  技  歷  作  戰  閒  聯
```

每个字下面显示英文：

- Self
- Skills
- Timeline
- Projects
- Hackathons
- Off-Hours
- Contact

当前章节状态：

- 红色印章点
- 墨迹下划线
- 当前字轻微放大
- 对应场景产生小范围响应

底部 Journey Map 默认收起。

默认只显示：

```text
05 / PROJECTS
────────●────────
```

点击后展开完整路线图。

---

## 6. 技术架构

```text
App Shell
├── Fixed WebGL Canvas
├── HTML Content Layer
├── Navigation Layer
├── Interaction Director
└── Accessibility Layer
```

### WebGL Canvas

负责：

- 墨滴
- 墨核
- 项目轨道
- 项目模型
- 粒子
- 灯光
- 局部环境

### HTML Content Layer

负责：

- 标题
- 正文
- 项目详情
- 按钮
- Tabs
- 架构图
- 截图
- 导航
- 联系方式

### Interaction Director

统一控制：

- Current Chapter
- Scroll Progress
- Selected Project
- Experience Mode
- Device Quality
- Reduced Motion
- Scene Loading

---

## 7. 推荐工程目录

```text
src/lib/experience/
├── ExperienceCanvas.svelte
├── SceneRoot.svelte
├── CameraRig.svelte
├── ScrollDirector.svelte
├── Lighting.svelte
├── QualityManager.svelte
│
├── scenes/
│   ├── EntryScene.svelte
│   ├── HeroScene.svelte
│   ├── ProjectOrbitScene.svelte
│   ├── ProjectFocusScene.svelte
│   └── OffHoursScene.svelte
│
├── objects/
│   ├── InkDrop.svelte
│   ├── InkCore.svelte
│   ├── ProjectArtifact.svelte
│   ├── OrbitLine.svelte
│   ├── InkParticles.svelte
│   └── ChapterMarker.svelte
│
├── ui/
│   ├── GlobalNavigation.svelte
│   ├── HeroCopy.svelte
│   ├── CapabilityEngine.svelte
│   ├── ProjectPanel.svelte
│   ├── JourneyMap.svelte
│   └── ExperienceControls.svelte
│
└── state/
    ├── experience.svelte.ts
    ├── projects.ts
    └── chapters.ts
```

现有项目数据继续作为唯一数据源。

2D UI 与 3D 场景不得维护两份项目数据。

---

## 8. 性能预算

### 首屏

- 首屏压缩资源不超过 4 MB
- 首屏模型不超过 150k 三角面
- 动态阴影光源最多 1 个
- 总活动灯光不超过 3 个
- 移动端 DPR 不超过 1.5
- 首屏不加载 Off-Hours 资源
- 首屏不加载所有项目高模

### 渲染策略

```text
当前场景：完整渲染
相邻场景：低精度预加载
远离场景：暂停或卸载
```

### 移动端

- 固定摄像机
- 减少粒子数量
- 禁用复杂 Bloom
- 项目轨道改为横向切换
- Project Focus 使用底部抽屉
- Off-Hours 使用 2.5D 背景
- 自动降级材质和阴影

---

## 9. 开发阶段

## Phase 0：基础重构

- 备份当前版本
- 拆分当前首页巨型组件
- 整理项目数据结构
- 建立 Experience Store
- 建立性能监控
- 保持现有网站可运行

## Phase 1：核心体验 MVP

实现：

- Entry
- Entry → Hero 转场
- Hero Ink Core
- 全局导航
- Cinematic Scroll
- Reduced Motion
- 2D Archive 回退模式

验收：

- 首屏正常加载
- 相机转场流畅
- 文字可读
- 导航可用
- 手机端可访问
- 关闭 3D 后内容仍完整

## Phase 2：项目系统

实现：

- Project Orbit
- 三个旗舰项目
- Hover 状态
- Selected 状态
- AI Company OS Project Focus
- 项目截图
- Live Demo 与 GitHub

验收：

- 项目层级清楚
- 选择与返回逻辑完整
- 项目信息不依赖 3D 才能阅读
- 模型按需加载

## Phase 3：能力与历程

实现：

- Capability Engine
- Self Archive
- Timeline
- Journey Map

## Phase 4：沉浸式内容

实现：

- Hackathon
- Off-Hours
- Contact 结尾
- Explore Mode
- 隐藏彩蛋

---

## 10. AI 实施规则

AI 不允许一次完成整个升级。

每个阶段必须遵循：

```text
Inspect
→ Plan
→ Implement
→ Run
→ Screenshot
→ Compare
→ Fix
→ Test
→ Commit
```

每个任务只能修改明确范围内的文件。

AI 在每个阶段结束后必须提供：

- 修改文件列表
- 实现内容
- 截图
- 性能结果
- 已知问题
- 测试结果
- 下一阶段建议

禁止：

- 一次重写整个首页
- 删除现有内容后再补
- 在没有截图验证时声称完成
- 将所有文字放入 Canvas
- 无性能预算地增加后处理
- 未经确认修改现有项目文案
- 同时实现所有 3D 场景

---

## 11. 验收标准

### 视觉

- 保持墨刊识别度
- 3D 不压过文字
- 页面不存在通用模板感
- 不依赖大量霓虹与光效
- 项目视觉与项目含义有关

### 交互

- 用户始终知道当前章节
- 每个场景都能通过导航退出
- 项目选择、返回、跳转完整
- Cinematic 与 Reduced Motion 均可用

### 内容

- 所有真实项目信息来自统一数据源
- 所有按钮链接正确
- 所有项目至少包含一句话价值说明
- Flagship 与 Experiment 层级明确

### 性能

- 页面加载期间有清晰反馈
- 非当前场景停止高频更新
- 手机端没有强制自由 3D
- 低性能模式仍能阅读完整内容

---

## 12. 设计交付物

开发前需要完成以下视觉图：

1. Entry Default
2. Entry → Hero Transition
3. Hero Default
4. Hero Capability Hover
5. Project Orbit Default
6. Project Orbit Hover
7. Project Orbit Selected
8. AI Company OS Project Focus
9. Capability Engine
10. Mobile Hero
11. Mobile Project Orbit
12. Journey Map Expanded

每张设计图必须：

- 单独输出
- 使用真实 16:9 页面比例
- 不做多页面拼图
- 使用真实文案
- 保持统一导航
- 标注默认、Hover 或 Selected 状态
- 保留合理留白
- 展示真实可开发布局
