import type { SiteLocale } from '@/i18n/site'
import { projects } from '@/data/projects'

export type Localized = Record<SiteLocale, string>
export const words = (zh: string, en: string): Localized => ({ 'zh-CN': zh, 'en-US': en })
export const pick = (copy: Localized, locale: SiteLocale) => copy[locale]
export const local = (locale: SiteLocale, zh: string, en: string) => locale === 'en-US' ? en : zh
export interface CaseStudy {
  slug: string
  repository: string
  title: string
  number: string
  category: Localized
  summary: Localized
  question: Localized
  approach: Localized
  decisions: { title: Localized; body: Localized }[]
  limitation: Localized
  related: string
  readmeBlob: string
  motif: 'canvas' | 'sources' | 'gates' | 'arena'
}
// Editorial copy is separate from synchronized repository facts. Never overwrite snapshots here.
export const caseStudies: CaseStudy[] = [
  {
    slug: 'glassbox', repository: 'Glassbox-Agent-Harness', title: 'Glassbox', number: '01', motif: 'canvas',
    category: words('Agent 工作台', 'Agent workspace'),
    summary: words('把计划、文件、审批与结果，整理成可检查的画布。', 'An inspectable canvas for agent plans, files, approvals and results.'),
    question: words('长任务产生大量工具事件。怎样不用翻完聊天记录，也能找到当前状态？', 'How can a long-running agent task be inspected without reconstructing its state from a chat history?'),
    approach: words('执行状态留在本地 Runtime。画布只投影值得查看的对象，布局和批注独立保存。', 'Keep execution state in the local runtime. Project useful objects onto a canvas, with layout and annotations stored separately.'),
    decisions: [
      { title: words('状态与布局分开', 'Separate state from layout'), body: words('画布负责呈现和批注，Runtime 负责执行状态。移动一个对象不会改变任务事实。', 'The board owns presentation and annotations; the runtime owns execution state. Moving an object does not change execution facts.') },
      { title: words('先整理，再展示', 'Project useful objects'), body: words('Provider 活动经 Adapter 转成事件，再由 Reducer 和 Projector 生成可检查的对象，不把每条日志变成节点。', 'Adapters normalize provider activity. A reducer and projector produce inspectable objects instead of making every log line a node.') },
      { title: words('保留 Provider 差异', 'Keep provider capabilities'), body: words('适配层连接现有 Agent，不把所有 Runtime 压成同一种能力模型。', 'The adapter layer connects existing agents without forcing every runtime into the same capability model.') }
    ],
    limitation: words('以下查看器使用本站教学样例，不是 Glassbox 的实际运行记录。此页没有连接本机 Agent，也不代表已验证所有 Provider。', 'The viewer below uses a teaching fixture, not a captured Glassbox run. This page does not connect to local agents or certify provider compatibility.'),
    related: 'ai-engineering-harness', readmeBlob: 'e3ebfd12d0751eb81ca3802cac6582393508e2ce'
  },
  {
    slug: 'zhihu-threads', repository: 'zhihu-threads', title: 'Zhihu Threads', number: '02', motif: 'sources',
    category: words('证据与学习', 'Evidence & learning'),
    summary: words('你选择知乎摘录，AI 组织可追问、自测的学习线。', 'Choose Zhihu excerpts. Build a learning thread with follow-ups and self-tests.'),
    question: words('搜索到了很多材料，如何知道学习线的每个节点依据了什么？', 'After retrieving sources, how can a learner trace each learning node back to its evidence?'),
    approach: words('AI 解释候选来源，由用户确认选源。学习线和后续追问都保留这组摘录的证据边界。', 'AI explains candidates; the user confirms source selection. Learning nodes and follow-up questions stay within those excerpts.'),
    decisions: [
      { title: words('用户确认来源', 'User-confirmed sources'), body: words('AI 解释相关性，不代替用户勾选。未选择的候选不进入当前线程证据范围。', 'AI explains relevance, not selection. Unselected candidates remain outside the thread’s evidence boundary.') },
      { title: words('摘要不是全文', 'Excerpts are not full articles'), body: words('使用接口返回的 ContentText 摘要，保留回答或专栏的来源类型和原始链接。', 'Use API ContentText summaries and retain the answer or article type and original link.') },
      { title: words('证据不足保留未知', 'Keep evidence gaps visible'), body: words('线程内追问依赖当前摘录。缺乏依据时保留 unknown 或 evidence_gap，不补造来源。', 'Follow-ups use the current excerpts. Missing support stays unknown or evidence_gap instead of an invented source.') }
    ],
    limitation: words('下面的选源实验使用本站编写的教学材料，没有引用真实知乎回答，也不会访问你的知乎账号或调用模型。', 'The source-selection experiment uses authored teaching material, not real Zhihu answers. It neither accesses your account nor calls a model.'),
    related: 'free-vision-skill', readmeBlob: 'f59076eb7bf92424db9da9852cfc8def5ef0734a'
  },
  {
    slug: 'ai-engineering-harness', repository: 'ai-engineering-harness', title: 'AI Engineering Harness', number: '03', motif: 'gates',
    category: words('开发者工具', 'Developer tooling'),
    summary: words('为 Agent 写出的代码补上计划、审查和验收证据。', 'Give agent-written code a plan, review process and verifiable acceptance evidence.'),
    question: words('代码可以运行，是否就足以被维护、审查和合并？', 'Is runnable code enough to make a repository maintainable, reviewable and ready to merge?'),
    approach: words('将工作分成 Issue、隔离工作区、实施计划、检查和人工审批。每一步保留独立记录。', 'Separate issues, isolated worktrees, implementation plans, checks and human approval. Keep an inspectable record of each step.'),
    decisions: [
      { title: words('范围先于实现', 'Scope before implementation'), body: words('Issue 写明目标、非目标与验收条件，再安排执行。不让一次修改无限扩张。', 'Define goals, non-goals and acceptance criteria before implementation so a change has a bounded scope.') },
      { title: words('上下文按任务加载', 'Load task-specific context'), body: words('规则、任务、相邻模块和深层材料分层加载，并保留上下文清单。', 'Load rules, task context, neighboring modules and deeper references in layers, with a context manifest.') },
      { title: words('验收与审批分开', 'Separate checks from approval'), body: words('测试报告和审查记录是合并依据。人工审批仍是独立步骤，不把绿灯等同于授权。', 'Tests and reviews provide merge evidence. Human approval remains a separate action, not something inferred from green checks.') }
    ],
    limitation: words('仓库提供工程规范和工作流。实际效果取决于使用项目、工具权限与执行记录。下方实验只重算固定样例，不运行 Agent。', 'The repository provides engineering rules and workflows. Results depend on the consuming project, permissions and execution evidence. The experiment below only rescores fixed fixtures; it does not run agents.'),
    related: 'ai-engineering-harness', readmeBlob: 'd5314580f72d1ad10b289de8157f73f0c62b39ee'
  },
  {
    slug: 'agentarena', repository: 'AgentArena', title: 'AgentArena', number: '04', motif: 'arena',
    category: words('多 Agent 评测', 'Multi-agent evaluation'),
    summary: words('三支 Agent 团队提案、交叉审查，并为结果留下证据。', 'Three agent teams propose, challenge and revise work with evidence-backed judging.'),
    question: words('怎样比较不同团队的提案，同时保留评分理由与修订过程？', 'How can competing proposals be compared while preserving judging evidence and revisions?'),
    approach: words('同一简报进入提案、构建、攻击、防守、验证与裁决流程。事件和作品可以回查。', 'One brief passes through proposals, building, attacks, defenses, verification and judging, with inspectable events and artifacts.'),
    decisions: [
      { title: words('同题比较', 'Compare the same brief'), body: words('团队面对同一任务，保留各自提案和修改记录，便于对照不同策略。', 'Teams work on the same task with separate proposals and revision records so their approaches can be compared.') },
      { title: words('评分指向证据', 'Link scores to evidence'), body: words('评审项绑定证据事件。访客可以从结论回看对应作品，而不只看一个名次。', 'Judging criteria link to evidence events, allowing the result to be traced back to the work rather than just a rank.') },
      { title: words('回放与真实运行分开', 'Separate replay from live runs'), body: words('固定回放用于重复查看。真实运行依赖模型与网络，失败时应保留降级状态。', 'Saved replays support repeatable inspection. Live runs depend on models and networks and must retain degraded states on failure.') }
    ],
    limitation: words('本页没有启动竞技任务。查看器使用明确标注的教学样例；项目真实回放与运行说明见仓库，不把样例评分当作模型排名。', 'No battle runs on this page. The viewer uses labeled teaching fixtures. Consult the repository for product replays and live execution; fixture scores are not model rankings.'),
    related: 'wishlive', readmeBlob: '9443e8c605d1fd414ae06816a4052a25eb584703'
  }
]
export const projectFor = (study: CaseStudy) => projects.find(project => project.repository === study.repository)
export const casePath = (study: CaseStudy, locale: SiteLocale) => `${locale === 'en-US' ? '/en' : ''}/projects/${study.slug}`
export const findCase = (repository: string) => caseStudies.find(study => study.repository === repository)
export const studySource = (study: CaseStudy) => projectFor(study)?.links.find(link => link.type === 'source')?.href ?? `https://github.com/lora-sys/${study.repository}`
export const experiments = [
  { slug: 'evidence-selection', title: words('选择来源，检查证据缺口', 'Choose sources. Inspect evidence gaps.'), summary: words('取消一条材料，观察哪些学习节点失去依据。', 'Remove a source and inspect which learning nodes lose support.'), kind: 'sources' as const, related: 'zhihu-threads' },
  { slug: 'evaluation-rules', title: words('规则变了，通过率也会变', 'Change the rules, not the agent.'), summary: words('用同一组固定输出，比较完成率与严格验收。', 'Compare completion-only and strict checks on the same fixed outputs.'), kind: 'eval' as const, related: 'ai-engineering-harness' }
]
