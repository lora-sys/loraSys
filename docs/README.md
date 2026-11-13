# loraSys 文档索引 (Documentation Hub)

本目录收敛 loraSys 的规范标准、内容契约与历史演进记录。为避免文档累积与事实漂移，请严格遵守各文档的职责边界：

---

## 核心规范目录

| 文档 | 职责范围 | 维护重点 |
| :--- | :--- | :--- |
| [`docs/mdx-content-contract.md`](file:///Users/lora/loraSys/docs/mdx-content-contract.md) | **MDX 内容契约与组件规范** | 规定博客文章中允许使用的 MDX 组件、属性约束、代码块格式与媒体渲染规范。 |
| [`docs/article-translations.md`](file:///Users/lora/loraSys/docs/article-translations.md) | **双语翻译与对齐机制** | 规定中英文文章的 `translationOf` 映射、语言回退逻辑、路由对应关系与写作流。 |
| [`docs/interaction-matrix.md`](file:///Users/lora/loraSys/docs/interaction-matrix.md) | **交互状态与无障碍契约** | 规定微交互（体感/震动、聚焦环、`<dialog>` 模态框、`prefers-reduced-motion` 降级）的全局行为。 |
| [`docs/site-quality.md`](file:///Users/lora/loraSys/docs/site-quality.md) | **站点质量与 CI 准入基线** | 规定自动化检查流程（`content:validate`、`test:search`、`showcase:validate`、`check`、`build`）及质量门禁。 |
| [`docs/upgrade-plan.md`](file:///Users/lora/loraSys/docs/upgrade-plan.md) | **历史升级计划与落地归档** | 记录 2026-08 体验升级的设计推导与落地里程碑，作为架构历史参考，已实施项已归档。 |

---

## 全局规则与入口关系

1. **项目根目录指引**：
   - 开发者快速上手与常用脚本：参阅根目录 [`README.md`](file:///Users/lora/loraSys/README.md)。
   - AI Agent 与自动化审查指南：参阅根目录 [`AGENTS.md`](file:///Users/lora/loraSys/AGENTS.md)。
2. **严防文档膨胀与双重维护**：
   - 不得在根目录或 `docs/` 下随意增加未收敛的临时 review / todo 记录文档；审查材料与日志应保存在仓库外或经由 PR / Issue 沉淀。
   - 代码架构变更必须同步更新对应规范文档，禁止出现代码已修改但文档描述为旧方案的漂移情况。
