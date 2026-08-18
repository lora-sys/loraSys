export type ProjectStoryKind = 'Writing' | 'Channel'

export interface ProjectStoryLink {
  kind: ProjectStoryKind
  label: string
  href: string
  external?: boolean
}

/**
 * Curated links between public projects and the real writing/channel entries
 * already published on this site. Keep this explicit until platform APIs or
 * per-post URLs are available; never infer or fabricate social posts.
 */
export const projectStories: Record<string, ProjectStoryLink[]> = {
  'Glassbox-Agent-Harness': [
    {
      kind: 'Writing',
      label: 'AI Engineering Harness: 从 Vibe 到 Vibe 的 AI 工程化',
      href: '/blog/ai-engineering-harness'
    },
    {
      kind: 'Channel',
      label: 'Bilibili channel',
      href: 'https://space.bilibili.com/431821023',
      external: true
    }
  ],
  'free-vision-skill': [
    {
      kind: 'Writing',
      label: 'Free Vision Skill: 给文本模型装上一双按需调用的眼睛',
      href: '/blog/free-vision-skill'
    },
    {
      kind: 'Channel',
      label: '小红书 channel',
      href: 'https://www.xiaohongshu.com/user/profile/63887411156',
      external: true
    }
  ],
  'hermes-minimax-media': [
    {
      kind: 'Writing',
      label: '用 MiniMax 为 Hermes Agent 接入图片与视频生成',
      href: '/blog/hermes-minimax-media'
    },
    {
      kind: 'Channel',
      label: 'Bilibili channel',
      href: 'https://space.bilibili.com/431821023',
      external: true
    }
  ],
  'hermes-stepfun-imagegen': [
    {
      kind: 'Writing',
      label: '用 StepFun 为 Hermes Agent 接入图片生成能力',
      href: '/blog/hermes-stepfun-imagegen'
    },
    {
      kind: 'Channel',
      label: '知乎 channel',
      href: 'https://www.zhihu.com/people/lorry-23-28-30',
      external: true
    }
  ]
}

export const getProjectStories = (repository: string) => projectStories[repository] ?? []
