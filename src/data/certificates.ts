import amdDevmaster from '@/assets/certificates/amd-devmaster.webp'
import goaiAgentInfraCertificate from '@/assets/certificates/goai-agent-infra-certificate.webp'
import zhihuHackathon from '@/assets/certificates/zhihu-hackathon-campus-rising-stars.webp'

export interface Certificate {
  id: string
  title: string
  issuer: string
  program: string
  issuedDate: string
  issuedLabel: string
  description: string
  image: ImageMetadata
  alt: string
  /** Switches the thumbnail framing; landscape is the default. */
  orientation?: 'landscape' | 'portrait'
}

export const certificates: Certificate[] = [
  {
    id: 'amd-devmaster-2026',
    title: 'AMD AI DevMaster Hackathon 2026',
    issuer: 'AMD',
    program: '多模态 AI 赛道 · 项目 Waiwang-Chantou (外网穿透) / StagePoster',
    issuedDate: '2026-08-26',
    issuedLabel: '2026 年 8 月 26 日',
    description: '参与 AMD AI DevMaster Hackathon 2026，提交项目 Waiwang-Chantou（外网穿透）/ StagePoster，获多模态 AI 赛道 优秀参与认可。',
    image: amdDevmaster,
    alt: 'AMD AI DevMaster Hackathon 2026 参与证书，多模态 AI 赛道，项目 Waiwang-Chantou (外网穿透) / StagePoster。'
  },
  {
    id: 'goai-agent-infra-2026',
    title: 'Datawhale AI 夏令营第二期结营证书',
    issuer: 'Datawhale × 阿里云',
    program: '世界人工智能开源大赛 · Agent 基础设施方向',
    issuedDate: '2026-08-22',
    issuedLabel: '2026 年 8 月 22 日',
    description: '完成 2026 Datawhale AI 夏令营第二期全部学习，获得结营证书。',
    image: goaiAgentInfraCertificate,
    alt: '2026 Datawhale AI 夏令营第二期结营证书，世界人工智能开源大赛 Agent 基础设施方向。'
  },
  {
    id: 'zhihu-hackathon-campus-rising-stars-2026',
    title: '知乎黑客松 · 校园新锐季 参赛凭证',
    issuer: '知乎',
    program: 'ZHIHU HACKATHON · 校园新锐季 · 48 小时极限开发',
    issuedDate: '2026-09-19',
    issuedLabel: '2026 年 9 月 19 日',
    description: '参与知乎黑客松 · 校园新锐季，以 48 小时极限开发探索 AI 与知识社区的共创可能，获知乎官方参赛凭证。',
    image: zhihuHackathon,
    orientation: 'portrait',
    alt: '知乎黑客松 · 校园新锐季 参赛凭证，授予赵彦兵，表彰在 48 小时极限开发中以 AI 共创知识社区新可能。'
  }
]