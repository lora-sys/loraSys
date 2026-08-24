import type { ImageMetadata } from 'astro'

import heroLora from '@/assets/lora-visual/v1/lora-v1-hero-lora-gaze-base.webp'
import heroMochi from '@/assets/lora-visual/v1/lora-v1-hero-mochi-gaze-base.webp'
import heroProps from '@/assets/lora-visual/v1/lora-v1-hero-workbench-props.webp'
import avatar from '@/assets/lora-visual/v1/lora-v1-avatar.webp'
import aboutJourney from '@/assets/lora-visual/v1/lora-v1-about-journey.webp'
import aboutHackathon from '@/assets/lora-visual/v1/lora-v1-about-hackathon.webp'
import nowWorkbench from '@/assets/lora-visual/v1/lora-v1-now-workbench.webp'
import contactCorrespondence from '@/assets/lora-visual/v1/lora-v1-contact-correspondence.webp'
import readingMarker from '@/assets/lora-visual/v1/lora-v1-reading-marker.webp'
import favoritesTicket from '@/assets/lora-visual/v1/lora-v1-favorites-ticket.webp'
import labLedger from '@/assets/lora-visual/v1/lora-v1-lab-ledger.webp'
import notesStrip from '@/assets/lora-visual/v1/lora-v1-notes-strip.webp'
import blogAgentSystems from '@/assets/lora-visual/v1/lora-v1-blog-agent-systems.webp'
import blogMultimodal from '@/assets/lora-visual/v1/lora-v1-blog-multimodal.webp'
import agentRunbook from '@/assets/lora-visual/v1/lora-v1-agent-runbook.webp'
import mediaWorkbench from '@/assets/lora-visual/v1/lora-v1-media-workbench.webp'
import sandbox from '@/assets/lora-visual/v1/lora-v1-sandbox.webp'
import shippingLog from '@/assets/lora-visual/v1/lora-v1-shipping-log.webp'
import projectsMap from '@/assets/lora-visual/v1/lora-v1-projects-map.webp'
import linksConstellation from '@/assets/lora-visual/v1/lora-v1-links-constellation.webp'
import resumeDossier from '@/assets/lora-visual/v1/lora-v1-resume-dossier.webp'
import guestbookPostcard from '@/assets/lora-visual/v1/lora-v1-guestbook-postcard.webp'
import indexScene from '@/assets/lora-visual/v1/lora-v1-index-scene.webp'
import talksPodium from '@/assets/lora-visual/v1/lora-v1-talks-podium.webp'
import termsLedger from '@/assets/lora-visual/v1/lora-v1-terms-ledger.webp'
import wayfinding404 from '@/assets/lora-visual/v1/lora-v1-404-wayfinding.webp'
import stampVerified from '@/assets/lora-visual/v1/lora-v1-stamp-verified.webp'
import stampExperiment from '@/assets/lora-visual/v1/lora-v1-stamp-experiment.webp'
import stampContribution from '@/assets/lora-visual/v1/lora-v1-stamp-contribution.webp'

export type LoraVisualKey = keyof typeof loraVisuals

export type VisualEntry = {
  src: ImageMetadata
  alt: string
  decorative?: boolean
  widths: number[]
  sizes: string
  pages: string[]
}

export const loraVisuals = {
  heroLora: { src: heroLora, alt: '', decorative: true, widths: [420, 640, 840], sizes: '(max-width: 760px) 78vw, 42rem', pages: ['/', '/en/'] },
  heroMochi: { src: heroMochi, alt: '', decorative: true, widths: [280, 420, 560], sizes: '(max-width: 760px) 42vw, 17rem', pages: ['/', '/en/'] },
  heroProps: { src: heroProps, alt: '', decorative: true, widths: [420, 640, 840], sizes: '(max-width: 760px) 78vw, 42rem', pages: ['/', '/en/'] },
  avatar: { src: avatar, alt: 'Lora 在工作台前的插画头像', widths: [128, 256, 512], sizes: '10rem', pages: ['/', '/en/', '/links', '/en/links'] },
  aboutJourney: { src: aboutJourney, alt: 'Lora 与 Mochi 沿项目、学习和贡献路线前进', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 38rem', pages: ['/about', '/en/about'] },
  aboutHackathon: { src: aboutHackathon, alt: 'Lora 整理黑客松证据板，Mochi 拿着计时器', widths: [360, 600, 900], sizes: '(max-width: 760px) 92vw, 26rem', pages: ['/about'] },
  nowWorkbench: { src: nowWorkbench, alt: 'Lora 更新当前工作台，Mochi 在计时器旁休息', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 42rem', pages: ['/now', '/en/now', '/'] },
  contactCorrespondence: { src: contactCorrespondence, alt: 'Lora 与 Mochi 在通信工作台寄出信件', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 44rem', pages: ['/contact', '/en/contact', '/'] },
  readingMarker: { src: readingMarker, alt: 'Lora 与 Mochi 为构建笔记放入阅读书签', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 38rem', pages: ['/blog', '/en/writing', '/'] },
  favoritesTicket: { src: favoritesTicket, alt: 'Lora 整理收藏票据，Mochi 坐在档案盒里', widths: [360, 600, 860], sizes: '(max-width: 760px) 80vw, 24rem', pages: ['/'] },
  labLedger: { src: labLedger, alt: 'Lora 与 Mochi 在实验账本中核对交互原型', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 38rem', pages: ['/lab'] },
  notesStrip: { src: notesStrip, alt: 'Lora 与 Mochi 整理一组短笔记', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 48rem', pages: ['/notes'] },
  blogAgentSystems: { src: blogAgentSystems, alt: 'Agent 任务从问题卡进入运行盒并输出证据', widths: [320, 520, 760], sizes: '(max-width: 760px) 70vw, 18rem', pages: ['/blog'] },
  blogMultimodal: { src: blogMultimodal, alt: '文本和图像沿时间线汇合为可检查结果', widths: [320, 520, 760], sizes: '(max-width: 760px) 70vw, 18rem', pages: ['/blog'] },
  agentRunbook: { src: agentRunbook, alt: 'Lora 沿运行手册检查任务节点，Mochi 携带证据夹', widths: [320, 520, 760], sizes: '(max-width: 900px) 60vw, 17rem', pages: ['/blog/*'] },
  mediaWorkbench: { src: mediaWorkbench, alt: 'Lora 将图像和音频证据整理到同一文件夹', widths: [320, 520, 760], sizes: '(max-width: 900px) 60vw, 17rem', pages: ['/blog/*'] },
  sandbox: { src: sandbox, alt: 'Lora 将输入放入隔离实验盒并检查输出', widths: [320, 520, 760], sizes: '(max-width: 900px) 60vw, 17rem', pages: ['/blog/*'] },
  shippingLog: { src: shippingLog, alt: 'Lora 与 Mochi 封装完成记录并送入交付托盘', widths: [320, 520, 760], sizes: '(max-width: 900px) 60vw, 17rem', pages: ['/blog/*'] },
  projectsMap: { src: projectsMap, alt: 'Lora 与 Mochi 展开连接 Agent、视觉、模拟、记忆和验证项目的地图', widths: [480, 640, 720, 960], sizes: '(max-width: 760px) 77vw, 52rem', pages: ['/projects', '/en/work'] },
  linksConstellation: { src: linksConstellation, alt: 'Lora 与 Mochi 用纸片和线连接友链星图', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 42rem', pages: ['/links', '/en/links'] },
  resumeDossier: { src: resumeDossier, alt: 'Lora 展开包含经历、项目与证据的简历档案', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 42rem', pages: ['/resume', '/en/resume'] },
  guestbookPostcard: { src: guestbookPostcard, alt: 'Lora 与 Mochi 把空白明信片放入留言盒', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 38rem', pages: ['/guestbook', '/en/guestbook'] },
  indexScene: { src: indexScene, alt: 'Lora 与 Mochi 在卡片索引中搜索和归档内容', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 48rem', pages: ['/search', '/archives', '/tags'] },
  talksPodium: { src: talksPodium, alt: 'Lora 在讲台旁整理演讲卡片，Mochi 守着麦克风', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 34rem', pages: ['/talks'] },
  termsLedger: { src: termsLedger, alt: 'Lora 与 Mochi 阅读站点条款账本', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 38rem', pages: ['/terms'] },
  wayfinding404: { src: wayfinding404, alt: 'Lora 指向返回首页的纸路，Mochi 检查断开的路径', widths: [480, 720, 960], sizes: '(max-width: 760px) 86vw, 44rem', pages: ['/404'] },
  stampVerified: { src: stampVerified, alt: '', decorative: true, widths: [44, 88, 176], sizes: '2.75rem', pages: ['/'] },
  stampExperiment: { src: stampExperiment, alt: '', decorative: true, widths: [44, 88, 176], sizes: '2.75rem', pages: ['/'] },
  stampContribution: { src: stampContribution, alt: '', decorative: true, widths: [44, 88, 176], sizes: '2.75rem', pages: ['/'] }
} satisfies Record<string, VisualEntry>
