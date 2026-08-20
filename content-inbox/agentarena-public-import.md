---
title: "Agent Arena：让智能体在证据链中竞争"
sourceUrl: "https://github.com/lora-sys/AgentArena"
sourceType: "public-url"
contentType: "note"
status: "candidate"
project: "lora-sys/AgentArena"
track: "Horizon Startup Hackathon"
language: "zh-CN"
tags:
  - ai-agents
  - evaluation
  - multi-agent
  - hackathon
importedAt: "2026-08-20"
---

## 候选摘要

Agent Arena 是一个以证据为核心的 AI Agent 团队竞技场：三支能力取向不同的智能体团队面对同一份简报，依次完成提案、构建、攻击、防守、验证与裁决。它不只输出一个冠军，还保留可操作作品、证据链、可重放的战斗记录，以及同时记录优势和弱点的团队护照。

这个项目适合作为一篇短 Note，主题不是“让模型互相聊天”，而是如何把多智能体协作变成可观察、可验证、可复盘的工程流程。项目中的每个评分都需要关联证据事件，Battle Engine 决定阶段顺序和冠军选择，Replay 与 Passport 从持久化事件重建事实，模型不能直接改写比赛结果。

在产品表达上，项目刻意收敛为 Landing、Live Arena 和 Champion 三条主路径；实时模式通过 SSE 展示阶段进度、事件流和主持人解说，模型异常时进入诚实降级状态，而不是用固定数据伪装成功。当前它仍是面向黑客松的单机 Demo MVP，本地原子 JSON 事件存储适合演示，但不适合多实例生产部署。

## 建议关联

- 项目：`lora-sys/AgentArena`
- 经历：`Horizon Startup Hackathon`
- 内容类型：`Note`
- 后续可扩展为 Blog：`How to build an evidence-first Agent Arena`
- 推荐主题：AI Agent Infrastructure、Multimodal/Interactive Systems、Evaluation & Reliability

## 导入记录

This file is an unpublished candidate generated from a public URL. It is intentionally stored under `content-inbox/`, outside Astro's published content collection. It has not been copied into `src/content/blog/`, has not been published, and has not modified the source repository.
