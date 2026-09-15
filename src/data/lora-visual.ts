import type { ImageMetadata } from 'astro'

import heroLora from '@/assets/lora-visual/v2/lora-v2-hero-lora.webp'
import heroMochi from '@/assets/lora-visual/v2/lora-v2-hero-mochi.webp'
import heroProps from '@/assets/lora-visual/v2/lora-v2-hero-workbench-props.webp'
import avatar from '@/assets/lora-visual/v2/lora-v2-avatar.webp'
import aboutJourney from '@/assets/lora-visual/v2/lora-v2-about-journey.webp'
import aboutHackathon from '@/assets/lora-visual/v2/lora-v2-about-hackathon.webp'
import nowWorkbench from '@/assets/lora-visual/v2/lora-v2-now-workbench.webp'
import contactCorrespondence from '@/assets/lora-visual/v2/lora-v2-contact-correspondence.webp'
import readingMarker from '@/assets/lora-visual/v2/lora-v2-reading-marker.webp'
import favoritesTicket from '@/assets/lora-visual/v2/lora-v2-favorites-ticket.webp'
import labLedger from '@/assets/lora-visual/v2/lora-v2-lab-ledger.webp'
import notesStrip from '@/assets/lora-visual/v2/lora-v2-notes-strip.webp'
import blogAgentSystems from '@/assets/lora-visual/v2/lora-v2-blog-agent-systems.webp'
import blogMultimodal from '@/assets/lora-visual/v2/lora-v2-blog-multimodal.webp'
import agentRunbook from '@/assets/lora-visual/v2/lora-v2-agent-runbook.webp'
import mediaWorkbench from '@/assets/lora-visual/v2/lora-v2-media-workbench.webp'
import sandbox from '@/assets/lora-visual/v2/lora-v2-sandbox.webp'
import shippingLog from '@/assets/lora-visual/v2/lora-v2-shipping-log.webp'
import projectsMap from '@/assets/lora-visual/v2/lora-v2-projects-map.webp'
import linksConstellation from '@/assets/lora-visual/v2/lora-v2-links-constellation.webp'
import resumeDossier from '@/assets/lora-visual/v2/lora-v2-resume-dossier.webp'
import guestbookPostcard from '@/assets/lora-visual/v2/lora-v2-guestbook-postcard.webp'
import indexScene from '@/assets/lora-visual/v2/lora-v2-index-scene.webp'
import talksPodium from '@/assets/lora-visual/v2/lora-v2-talks-podium.webp'
import termsLedger from '@/assets/lora-visual/v2/lora-v2-terms-ledger.webp'
import wayfinding404 from '@/assets/lora-visual/v2/lora-v2-404-wayfinding.webp'
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
  quality: number
  pages: string[]
}

export const loraVisuals = {
  heroLora: { src: heroLora, alt: '', decorative: true, widths: [320, 400, 480, 640, 768, 960, 1440], sizes: '(max-width: 960px) min(25rem, calc(100vw - 2rem)), min(38vw, 29rem)', quality: 72, pages: ['/', '/en/'] },
  heroMochi: { src: heroMochi, alt: '', decorative: true, widths: [160, 240, 320, 480, 640], sizes: '(max-width: 960px) min(12rem, calc(48vw - .96rem)), min(18.24vw, 13.92rem)', quality: 80, pages: ['/', '/en/'] },
  heroProps: { src: heroProps, alt: '', decorative: true, widths: [320, 400, 480, 640, 768, 960, 1440], sizes: '(max-width: 960px) min(25rem, calc(100vw - 2rem)), min(38vw, 29rem)', quality: 72, pages: ['/', '/en/'] },
  avatar: { src: avatar, alt: 'Lora 的角色参考头像', widths: [128, 256, 512, 860], sizes: '10rem', quality: 78, pages: ['/', '/en/', '/links', '/en/links'] },
  aboutJourney: { src: aboutJourney, alt: 'Lora 与 Mochi 沿项目、学习和贡献路线前进', widths: [480, 768, 1152, 1440], sizes: '(max-width: 760px) 86vw, 38rem', quality: 78, pages: ['/about', '/en/about'] },
  aboutHackathon: { src: aboutHackathon, alt: 'Lora 整理黑客松证据板，Mochi 拿着计时器', widths: [360, 600, 900, 1000], sizes: '(max-width: 760px) 92vw, 26rem', quality: 78, pages: ['/about'] },
  nowWorkbench: { src: nowWorkbench, alt: 'Lora 更新当前工作台，Mochi 在计时器旁休息', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 42rem', quality: 78, pages: ['/now', '/en/now', '/'] },
  contactCorrespondence: { src: contactCorrespondence, alt: 'Lora 与 Mochi 在通信工作台寄出信件', widths: [480, 768, 1152, 1600], sizes: '(max-width: 760px) 86vw, 44rem', quality: 78, pages: ['/contact', '/en/contact', '/'] },
  readingMarker: { src: readingMarker, alt: 'Lora 与 Mochi 为构建笔记放入阅读书签', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 38rem', quality: 78, pages: ['/blog', '/en/writing', '/'] },
  favoritesTicket: { src: favoritesTicket, alt: 'Lora 整理收藏票据，Mochi 坐在档案盒里', widths: [360, 600, 900, 1000], sizes: '(max-width: 760px) 80vw, 24rem', quality: 78, pages: ['/'] },
  labLedger: { src: labLedger, alt: 'Lora 与 Mochi 在实验账本中核对交互原型', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 38rem', quality: 78, pages: ['/lab'] },
  notesStrip: { src: notesStrip, alt: 'Lora 与 Mochi 整理一组短笔记', widths: [480, 768, 1152, 1774], sizes: '(max-width: 760px) 86vw, 48rem', quality: 78, pages: ['/notes'] },
  blogAgentSystems: { src: blogAgentSystems, alt: 'Agent 任务从问题卡进入运行盒并输出证据', widths: [320, 520, 760, 1000], sizes: '(max-width: 760px) 70vw, 18rem', quality: 78, pages: ['/blog'] },
  blogMultimodal: { src: blogMultimodal, alt: '文本和图像沿时间线汇合为可检查结果', widths: [320, 520, 760, 1000], sizes: '(max-width: 760px) 70vw, 18rem', quality: 78, pages: ['/blog'] },
  agentRunbook: { src: agentRunbook, alt: 'Lora 沿运行手册检查任务节点，Mochi 携带证据夹', widths: [320, 520, 760, 1122], sizes: '(max-width: 900px) 60vw, 17rem', quality: 78, pages: ['/blog/*'] },
  mediaWorkbench: { src: mediaWorkbench, alt: 'Lora 将图像和音频证据整理到同一文件夹', widths: [320, 520, 760, 1122], sizes: '(max-width: 900px) 60vw, 17rem', quality: 78, pages: ['/blog/*'] },
  sandbox: { src: sandbox, alt: 'Lora 将输入放入隔离实验盒并检查输出', widths: [320, 520, 760, 1122], sizes: '(max-width: 900px) 60vw, 17rem', quality: 78, pages: ['/blog/*'] },
  shippingLog: { src: shippingLog, alt: 'Lora 与 Mochi 封装完成记录并送入交付托盘', widths: [320, 520, 760, 1122], sizes: '(max-width: 900px) 60vw, 17rem', quality: 78, pages: ['/blog/*'] },
  projectsMap: { src: projectsMap, alt: 'Lora 与 Mochi 展开连接 Agent、视觉、模拟、记忆和验证项目的地图', widths: [480, 768, 1152, 1600], sizes: '(max-width: 760px) 92vw, 65rem', quality: 78, pages: ['/projects', '/en/work', '/', '/en/'] },
  linksConstellation: { src: linksConstellation, alt: 'Lora 与 Mochi 用纸片和线连接友链星图', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 42rem', quality: 78, pages: ['/links', '/en/links'] },
  resumeDossier: { src: resumeDossier, alt: 'Lora 展开包含经历、项目与证据的简历档案', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 42rem', quality: 78, pages: ['/resume', '/en/resume'] },
  guestbookPostcard: { src: guestbookPostcard, alt: 'Lora 与 Mochi 把空白明信片放入留言盒', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 38rem', quality: 78, pages: ['/guestbook', '/en/guestbook'] },
  indexScene: { src: indexScene, alt: 'Lora 与 Mochi 在卡片索引中搜索和归档内容', widths: [480, 768, 1152, 1600], sizes: '(max-width: 760px) 86vw, 48rem', quality: 78, pages: ['/search', '/archives', '/tags'] },
  talksPodium: { src: talksPodium, alt: 'Lora 在讲台旁整理演讲卡片，Mochi 守着麦克风', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 34rem', quality: 78, pages: ['/talks'] },
  termsLedger: { src: termsLedger, alt: 'Lora 与 Mochi 阅读站点条款账本', widths: [480, 768, 1152, 1536], sizes: '(max-width: 760px) 86vw, 38rem', quality: 78, pages: ['/terms'] },
  wayfinding404: { src: wayfinding404, alt: 'Lora 指向返回首页的纸路，Mochi 检查断开的路径', widths: [480, 768, 1152, 1600], sizes: '(max-width: 760px) 86vw, 44rem', quality: 78, pages: ['/404'] },
  stampVerified: { src: stampVerified, alt: '', decorative: true, widths: [44, 88, 176], sizes: '2.75rem', quality: 88, pages: ['/'] },
  stampExperiment: { src: stampExperiment, alt: '', decorative: true, widths: [44, 88, 176], sizes: '2.75rem', quality: 88, pages: ['/'] },
  stampContribution: { src: stampContribution, alt: '', decorative: true, widths: [44, 88, 176], sizes: '2.75rem', quality: 88, pages: ['/'] }
} satisfies Record<string, VisualEntry>
