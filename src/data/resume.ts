export const resumeData = {
  zh: {
    name: '赵彦兵',
    title: 'AI Agent / LLM 应用开发实习生',
    summary: '持续把想法做成可运行作品，聚焦 AI Agent、LLM 应用与全栈工程；主项目保留代码、测试、演示或项目文档，并明确记录待补测与后续项。',
    contact: {
      email: 'lorasys@outlook.com',
      phone: '134 6893 4893',
      location: '西安',
      availability: '2027 届 · 可立即入职 · 每周 5 天 / 连续 3 个月'
    },
    education: {
      school: '西安明德理工学院',
      degree: '计算机科学与技术 · 本科',
      period: '2023.07 — 2027.07',
      honors: ['成都 Monad Blitz 黑客松一等奖（2024）', '蓝桥杯 C++ 算法竞赛省级二等奖（2024）', 'ACM 算法竞赛铜川邀请赛铜牌（2024）']
    },
    skills: [
      {
        title: '开发技术',
        detail: 'TypeScript、React/Next.js、Go/Hono、Python/FastAPI、PostgreSQL/pgvector、SSE、WebSocket、Docker Compose、GitHub Actions、Vitest、Playwright。'
      },
      {
        title: 'AI 应用开发',
        detail: 'LangGraph 状态编排、多 Agent 事件契约、证据与引用审查、人工审批、可追溯导出规则，以及超时和证据不足时的降级路径。'
      }
    ],
    strengths: [
      '持续把想法做成可运行作品。主项目都保留代码、测试、演示或项目文档，遇到没完成的部分会写清原因和下一步。',
      '有模块拆分、接口联调和代码协作经历。做多 Agent 系统时会先定状态、消息和责任边界，再处理页面和模型调用。',
      '持续维护开源 AI 应用和学习产品。获得黑客松一等奖、蓝桥杯省二、ACM 铜牌；用比赛和公开作品检验工程实现。'
    ],
    experience: [
      {
        organization: '凌云光技术股份有限公司',
        role: '产品开发部门实习生',
        period: '2025.08 — 2025.09 · 北京',
        detail: '围绕产品上线前验证完成对照实验、参数筛选和可行性分析；输出技术白皮书和 Demo，将验证结论转为验收与方案材料。'
      },
      {
        organization: 'ACAM Lab',
        role: '软件部门负责人',
        period: '2024.07 — 2025.10',
        detail: '统筹复合材料质量在线监测系统的软件模块拆分、开发规范与代码协作；负责数据采集、跨模块接口联调和初步分析模块开发。'
      }
    ],
    projects: [
      {
        name: 'TrustOps',
        period: '2026.08',
        href: 'https://github.com/lora-sys/trustops',
        detail: '为成长型 B2B SaaS 的安全问卷设计 Question → Claim → Evidence → Control Snapshot → Answer Version → Risk Review 数据链，并以 Human Approval 与确定性 Export Gate 控制对外导出。'
      },
      {
        name: 'Agent Arena',
        period: '2026.07',
        href: 'https://github.com/lora-sys/AgentArena',
        detail: '构建 Hono API、Battle Engine 与 React Live Arena；评分绑定 evidenceEventId，可复查提案、攻击、防守、验证和裁决的完整过程。'
      },
      {
        name: 'EcoMatrix',
        period: '2026.07',
        href: 'https://github.com/lora-sys/ecomatrix',
        detail: '以 Go + PostgreSQL Physical Engine、Python LangGraph Brain 与 Next.js Dashboard 分离交易、推理和观察；为并发交易提供幂等和余额不为负约束。'
      }
    ]
  },
  en: {
    name: 'Zhao Yanbing',
    title: 'AI Agent / LLM Application Engineering Intern',
    summary: 'I turn ideas into inspectable, runnable work, with a focus on AI Agents, LLM applications, and full-stack engineering.',
    contact: {
      email: 'lorasys@outlook.com',
      phone: '+86 134 6893 4893',
      location: "Xi'an, China",
      availability: 'Class of 2027 · Available now · Five days a week for three months'
    },
    strengths: [
      'Turns ideas into runnable work, with code, tests, demos, or project documentation retained for core projects; unfinished work is documented with its reason and next step.',
      'Has experience in module decomposition, interface integration, and code collaboration; defines state, messages, and responsibility boundaries before connecting pages and model calls in multi-agent systems.',
      'Maintains open-source AI applications and learning products; uses competition awards and public work to test engineering implementation.'
    ]
  }
} as const
