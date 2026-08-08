import {
	CodeIcon,
	Github,
	Globe,
	HomeIcon,
	NotebookIcon,
	BookOpen,
	Film,
	Headphones,
	Coins,
	Gamepad2,
	HeartIcon,
	FilmIcon
} from '@lucide/svelte';
import { marked } from 'marked';
import type { WorkItem } from '$lib/types';

/** Safely parse markdown to HTML string. marked v9+ returns string synchronously. */
const toHtml = (md: string): string => {
	const result = marked.parse(md);
	return typeof result === 'string' ? result : String(result);
};
// Navbar Icons
import GithubSvg from '$lib/imgs/github.svg';
import GithubDarkSvg from '$lib/imgs/github-dark.svg';

import PeerListSvg from '$lib/imgs/peerlist.svg';
import PeerListDarkSvg from '$lib/imgs/peerlist-dark.svg';

import GmailSvg from '$lib/imgs/gmail.svg';
import GmailDarkSvg from '$lib/imgs/gmail-dark.svg';

import LinkedinSvg from '$lib/imgs/linkedin.svg';
import LinkedinDarkSvg from '$lib/imgs/linkedin-dark.svg';

import TwitterSvg from '$lib/imgs/x.svg';
import TwitterDarkSvg from '$lib/imgs/x-dark.svg';

import BilibiliSvg from '$lib/imgs/bilibili.svg';
import BilibiliDarkSvg from '$lib/imgs/bilibili-dark.svg';

import YouTubeSvg from '$lib/imgs/youtube.svg';
import YouTubeDarkSvg from '$lib/imgs/youtube-dark.svg';

import MingdeImg from '$lib/imgs/mingde.png';

import zhihuSvg from '$lib/imgs/zhihu.svg';
import zhihuDarkSvg from '$lib/imgs/zhihu-dark.svg';
// Your resume data
export const DATA = {
	name: 'lora',
	initials: 'L',
	url: 'https://github.com/lora-sys',
	img: 'https://avatars.githubusercontent.com/u/176668951?v=4',
	location: 'Xian, China',
	locationLink: 'https://www.google.com/maps/place/xian',
	description:
		'AI Agent 开发者 & 全栈工程师。构建会进化的智能体系统，从聊天工具到能理解目标、规划任务、持续进化的数字伙伴。',
	// Pre-compiled HTML from markdown summary — avoids runtime parsing on every render
	summaryHtml: toHtml(
		'Lora。目前是一名学生开发者，主要关注 **AI Agent**、**全栈应用**和 **Agent 基础设施**。\n\n我对新技术一直保持很强的好奇心，喜欢研究最新的技术方向，也喜欢把一些大胆的想法快速做成可以运行、可以体验的产品。相比只讨论概念，我更享受真正动手构建的过程，从产品设计、系统架构到开发和验证，把一个想法一步步变成现实。\n\n在学校实验室里，我担任科研软件组负责人，主要负责将研究想法转化为可用的软件系统，同时参与项目规划、技术协作和开发规范建设。在实验室之外，我是一名活跃的 Builder，经常参加黑客松、参与开源社区，并和来自不同背景的开发者交流想法。\n\n我非常喜欢黑客松文化。对我来说，黑客松不仅是一场比赛，更是一个能够快速学习、验证想法、认识优秀开发者并突破自身边界的环境。在这个过程中，我不断提升自己的产品思维、工程能力和对新技术的理解。\n\n目前，我主要在探索如何让 AI Agent 从简单的聊天工具，发展成为能够理解目标、规划任务、调用工具、执行工作并持续进化的软件系统。我正在构建和研究 AI Company OS、Multi-Agent Engineering Harness、Agent Arena 等项目，也在探索 AI Agent 与 Web3 的结合，包括参与 MOSS 的开源贡献，以及开发 MonadMon 等 Monad 生态项目。\n\n我的长期目标，是构建真正能够与用户共同成长的智能体。它不仅能够回答问题，还可以逐渐理解用户的习惯、目标和工作方式，成为一个可靠、可持续进化的数字伙伴。\n\n很高兴认识大家，也希望能和更多热爱技术、产品、开源和创造的人一起交流、合作，做出一些真正有趣并且有价值的东西。'
	) as string,
	// Legacy raw markdown field (kept for backwards compatibility)
	summary:
		'Lora。目前是一名学生开发者，主要关注 **AI Agent**、**全栈应用**和 **Agent 基础设施**。\n\n我对新技术一直保持很强的好奇心，喜欢研究最新的技术方向，也喜欢把一些大胆的想法快速做成可以运行、可以体验的产品。相比只讨论概念，我更享受真正动手构建的过程，从产品设计、系统架构到开发和验证，把一个想法一步步变成现实。\n\n在学校实验室里，我担任科研软件组负责人，主要负责将研究想法转化为可用的软件系统，同时参与项目规划、技术协作和开发规范建设。在实验室之外，我是一名活跃的 Builder，经常参加黑客松、参与开源社区，并和来自不同背景的开发者交流想法。\n\n我非常喜欢黑客松文化。对我来说，黑客松不仅是一场比赛，更是一个能够快速学习、验证想法、认识优秀开发者并突破自身边界的环境。在这个过程中，我不断提升自己的产品思维、工程能力和对新技术的理解。\n\n目前，我主要在探索如何让 AI Agent 从简单的聊天工具，发展成为能够理解目标、规划任务、调用工具、执行工作并持续进化的软件系统。我正在构建和研究 AI Company OS、Multi-Agent Engineering Harness、Agent Arena 等项目，也在探索 AI Agent 与 Web3 的结合，包括参与 MOSS 的开源贡献，以及开发 MonadMon 等 Monad 生态项目。\n\n我的长期目标，是构建真正能够与用户共同成长的智能体。它不仅能够回答问题，还可以逐渐理解用户的习惯、目标和工作方式，成为一个可靠、可持续进化的数字伙伴。\n\n很高兴认识大家，也希望能和更多热爱技术、产品、开源和创造的人一起交流、合作，做出一些真正有趣并且有价值的东西。',
	avatarUrl: 'https://avatars.githubusercontent.com/u/176668951?v=4',
	repoCount: 103,
	skills: [
		'TypeScript',
		'Python',
		'JavaScript',
		'Java',
		'Solidity',
		'Next.js',
		'React',
		'Svelte',
		'SvelteKit',
		'Node.js',
		'PostgreSQL',
		'TailwindCSS',
		'Docker',
		'AI Agents',
		'Web3'
	],
	navbar: [
		{ href: '/', icon: HomeIcon, label: 'Home' },
		{ href: '/blog', icon: NotebookIcon, label: 'Blog' },
		{ href: '/#anime', icon: FilmIcon, label: 'Anime' },
		{ href: '/#favorites', icon: HeartIcon, label: 'Favorites' },
		{ href: '/#projects', icon: CodeIcon, label: 'Projects' }
	],
	anime: [
		{
			name: 'Made in Abyss',
			quote:
				"I'll go even deeper. Even if it costs me my humanity, I want to see the truth of the Abyss.",
			image: '/images/anime/made-in-abyss.webp',
			link: 'https://zh.wikipedia.org/wiki/%E4%BE%86%E8%87%AA%E6%B7%B1%E6%B7%B5',
			buttonText: 'Learn More'
		},
		{
			name: '相聚一刻',
			quote: '即使在最平凡的日子里，也有人在默默守护着你。',
			image: '/images/anime/xiangjuyike.webp',
			link: 'https://zh.wikipedia.org/wiki/%E7%9B%B8%E8%81%9A%E4%B8%80%E5%88%BB',
			buttonText: 'Learn More'
		},
		{
			name: 'Steins;Gate',
			quote: "No one knows what the future holds, that's why its potential is infinite.",
			image: '/images/anime/steins-gate.webp',
			link: 'https://zh.wikipedia.org/wiki/%E5%91%BD%E9%81%8B%E7%9F%B3%E4%B9%8B%E9%96%80',
			buttonText: 'Learn More'
		},
		{
			name: 'Attack on Titan',
			quote: "The world is merciless, and it's also very beautiful.",
			image: '/images/anime/attack-on-titan.webp',
			link: 'https://zh.wikipedia.org/wiki/%E9%80%B2%E6%93%8A%E7%9A%84%E5%B7%A8%E4%BA%BA',
			buttonText: 'Learn More'
		},
		{
			name: 'Eureka Seven',
			quote: 'Freedom is something that you need to actively acquire.',
			image: '/images/anime/eureka-seven.webp',
			link: 'https://zh.wikipedia.org/wiki/%E4%BA%A4%E5%93%8D%E8%AF%97%E7%AF%87',
			buttonText: 'Learn More'
		},
		{
			name: 'Bakuman',
			quote:
				"Don't think 'it would be nice if that came true'. Work hard and make it your reality.",
			image: '/images/anime/bakuman.webp',
			link: 'https://zh.wikipedia.org/wiki/%E7%88%B6%E6%BC%AB%E7%8E%8B',
			buttonText: 'Learn More'
		},
		{
			name: 'Death Note',
			quote: 'The world is rotten, and those who are making it rot deserve to die.',
			image: '/images/anime/death-note.webp',
			link: 'https://zh.wikipedia.org/wiki/%E6%AD%BB%E4%BA%A1%E7%AC%94%E8%AE%B0',
			buttonText: 'Learn More'
		}
	],
	contact: {
		email: 'lorasys@outlook.com',
		tel: '+123456789',
		social: {
			GitHub: {
				name: 'GitHub',
				url: 'https://github.com/lora-sys',
				// // icon: Icons.github,
				icon: GithubSvg,
				navbar: true,
				dark_icon: GithubDarkSvg
			},
			LinkedIn: {
				name: 'LinkedIn',
				url: 'https://www.linkedin.com/in/lora-sys/',
				// // icon: Icons.linkedin,
				icon: LinkedinSvg,
				navbar: false,
				dark_icon: LinkedinDarkSvg
			},
			X: {
				name: 'X',
				url: 'https://x.com/MierPiter33280',
				// // icon: Icons.x,
				icon: TwitterSvg,
				navbar: true,
				dark_icon: TwitterDarkSvg
			},
			PeerList: {
				name: 'PeerList',
				url: 'https://peerlist.io/mierpiter',
				// // icon: Icons.x,
				icon: PeerListSvg,
				navbar: true,
				dark_icon: PeerListDarkSvg
			},
			YouTube: {
				name: 'YouTube',
				url: 'https://www.youtube.com/@MierPiter33280',
				icon: YouTubeSvg,
				navbar: true,
				dark_icon: YouTubeDarkSvg
			},
			Bilibili: {
				name: 'Bilibili',
				url: 'https://space.bilibili.com/431821023?spm_id_from=333.788.0.0',
				icon: BilibiliSvg,
				navbar: true,
				dark_icon: BilibiliDarkSvg
			},
			ZhiHu: {
				name: 'ZhiHu',
				url: 'https://www.zhihu.com/people/lorry-23-28-30',
				icon: zhihuSvg,
				navbar: true,
				dark_icon: zhihuDarkSvg
			},
			email: {
				name: 'Send Email',
				url: 'mailto:lorasys@outlook.com',
				// // icon: Icons.email,
				icon: GmailSvg,
				navbar: false,
				dark_icon: GmailDarkSvg
			}
		}
	},
	work: [],
	education: [
		{
			school: "Xi'an Mingde Institute of Technology",
			href: 'https://www.mdit.edu.cn',
			degree: "Bachelor's Degree of Computer Science (Third Year)",
			logoUrl: MingdeImg,
			start: '2022',
			end: '2026'
		}
	],
	projects: [
		{
			title: 'Newtube-clone',
			href: 'https://github.com/lora-sys/Newtube-clone',
			dates: 'Feb 2026 - Present',
			active: true,
			descriptionHtml: toHtml(
				'A full-stack YouTube clone built with Next.js 15, tRPC, Drizzle ORM, and modern web technologies. Features video upload, streaming, subscriptions, comments, playlists, and creator studio.'
			) as string,
			description:
				'A full-stack YouTube clone built with Next.js 15, tRPC, Drizzle ORM, and modern web technologies. Features video upload, streaming, subscriptions, comments, playlists, and creator studio.',
			technologies: [
				'Next.js',
				'TypeScript',
				'tRPC',
				'PostgreSQL',
				'Drizzle ORM',
				'TailwindCSS',
				'Clerk',
				'Mux'
			],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/Newtube-clone',
					icon: Github
				}
			],
			image: '/images/projects/newtube.webp',
			video: ''
		},
		{
			title: 'Daily-Rss',
			href: 'https://github.com/lora-sys/Daily-Rss',
			dates: 'Dec 2025 - Jan 2026',
			active: true,
			descriptionHtml: toHtml(
				'A sophisticated daily AI news briefing platform that automatically aggregates content from multiple RSS feeds and delivers curated insights via email. Built with Next.js 16, Supabase, and Inngest for cron-based scheduling.'
			) as string,
			description:
				'A sophisticated daily AI news briefing platform that automatically aggregates content from multiple RSS feeds and delivers curated insights via email. Built with Next.js 16, Supabase, and Inngest.',
			technologies: ['Next.js', 'TypeScript', 'Supabase', 'TailwindCSS', 'Inngest', 'Resend'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/Daily-Rss',
					icon: Github
				},
				{
					type: 'Website',
					href: 'https://daily-rss.vercel.app',
					icon: Globe
				}
			],
			image: '/images/projects/dailyrss.webp',
			video: ''
		},
		{
			title: 'TrandingOs',
			href: 'https://github.com/lora-sys/TrandingOs',
			dates: 'Jun 2026 - Present',
			active: true,
			descriptionHtml: toHtml(
				'A personal AI-powered trading terminal. Chat with an AI agent to analyze markets, create trade plans, run backtests, journal trades, and manage a paper portfolio. Features 40+ agent skills, 9 workflows, and a dark glassmorphism UI.'
			) as string,
			description:
				'A personal AI-powered trading terminal with 40+ agent skills, memory system, and dark glassmorphism UI.',
			technologies: [
				'React',
				'TypeScript',
				'TailwindCSS',
				'SQLite',
				'Python',
				'Zustand',
				'TanStack Query'
			],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/TrandingOs',
					icon: Github
				}
			],
			image: '/images/projects/trandingos.webp',
			video: ''
		},
		{
			title: 'aicompanyos',
			href: 'https://github.com/lora-sys/aicompanyos',
			dates: 'Jun 2026 - Present',
			active: true,
			descriptionHtml: toHtml(
				'A loop-driven AI execution harness. 8-layer architecture with Planner, Generator, Evaluator, and Evolution agents. Features Writer-Critic feedback loops with consensus locking. 78/78 E2E tests passing.'
			) as string,
			description:
				'A loop-driven AI execution harness with 8-layer architecture and Writer-Critic feedback loops.',
			technologies: ['TypeScript', 'pnpm', 'Zod', 'MCP Protocol', 'CLI/TUI'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/aicompanyos',
					icon: Github
				}
			],
			image: '/images/projects/aicompanyos.webp',
			video: ''
		},
		{
			title: 'nanochat-studay',
			href: 'https://github.com/lora-sys/nanochat-studay',
			dates: 'Mar 2026',
			active: true,
			descriptionHtml: toHtml(
				"Learning project inspired by Karpathy's nanochat. Implements an end-to-end LLM training pipeline (Pretrain -> SFT -> RL) with custom tokenizer using BPE and regex-based GPT-4 splitting patterns."
			) as string,
			description:
				"Learning project implementing an end-to-end LLM training pipeline inspired by Karpathy's nanochat.",
			technologies: ['Python', 'PyTorch', 'BPE Tokenizer', 'LLM'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/nanochat-studay',
					icon: Github
				}
			],
			image: '/images/projects/nanochat.webp',
			video: ''
		},
		{
			title: 'Emergence',
			href: 'https://github.com/lora-sys/hackthon-agent',
			dates: 'Feb 2026',
			active: true,
			descriptionHtml: toHtml(
				'A multi-agent collaboration protocol built for an online AI agent hackathon. Features real-time AI-agent debate, evidence chain, voting system, and resilience against LLM provider rate limits.'
			) as string,
			description:
				'A multi-agent collaboration protocol with real-time AI debate, evidence chain, and voting system.',
			technologies: ['TypeScript', 'Next.js', 'Zustand', 'SSE', 'OpenAI API'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/hackthon-agent',
					icon: Github
				}
			],
			image: '/images/projects/emergence.webp',
			video: ''
		},
		{
			title: 'Tarot Prediction DApp',
			href: 'https://github.com/lora-sys/demo_monad_hackthon',
			dates: 'Jan 2026',
			active: true,
			descriptionHtml: toHtml(
				'A Web3 tarot card prediction platform built on the Monad Testnet for the Monad Hackathon. Features interactive 3D tarot cards, TRGL token rewards, prediction markets, and MetaMask integration.'
			) as string,
			description:
				'A Web3 tarot card prediction platform on Monad Testnet with 3D cards and token rewards.',
			technologies: ['Solidity', 'React', 'Three.js', 'Hardhat', 'JavaScript', 'Web3'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/demo_monad_hackthon',
					icon: Github
				},
				{
					type: 'Website',
					href: 'https://demo-monad-hackthon.vercel.app',
					icon: Globe
				}
			],
			image: '/images/projects/tarot.webp',
			video: ''
		},
		{
			title: 'Moss',
			href: 'https://github.com/lora-sys/moss',
			dates: '2026',
			active: true,
			descriptionHtml: toHtml(
				'Turns Monad protocol interactions into Agent-callable Capabilities through discover → load → action → simulate. Builds and verifies unsigned transactions; never signs or sends them. TypeScript SDK + MCP server.'
			) as string,
			description:
				'Monad protocol interaction framework for AI agents. Discover, load, simulate, and verify transactions without signing.',
			technologies: ['TypeScript', 'Monad', 'MCP', 'Web3', 'Agents'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/moss',
					icon: Github
				}
			],
			image: '/images/projects/moss.webp',
			video: ''
		},
		{
			title: 'Second Brain',
			href: 'https://github.com/lora-sys/second-brain',
			dates: '2026',
			active: true,
			descriptionHtml: toHtml(
				'Personal second-brain dashboard with Obsidian vault sync, knowledge graph visualization, daily notes, and task tracking. Local-first UI that treats your Obsidian Markdown files as the source of truth.'
			) as string,
			description:
				'Local-first second-brain dashboard — Obsidian vault sync, knowledge graph, daily notes, kanban tasks.',
			technologies: ['JavaScript', 'Obsidian', 'Markdown', 'Knowledge Graph', 'Local-first'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/second-brain',
					icon: Github
				}
			],
			image: '/images/projects/second-brain.webp',
			video: ''
		},
		{
			title: 'MonadMon',
			href: 'https://github.com/lora-sys/monadmon',
			dates: '2026',
			active: true,
			descriptionHtml: toHtml(
				'The first living creatures on Monad. On-chain creature-raising + PvP battle game. Tamagotchi meets crypto — breed, feed, and battle your digital creatures on Monad Testnet.'
			) as string,
			description:
				'On-chain Tamagotchi on Monad. Breed, feed, and battle digital creatures with PvP mechanics.',
			technologies: ['TypeScript', 'Monad', 'Web3', 'GameFi', 'Smart Contracts'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/monadmon',
					icon: Github
				}
			],
			image: '/images/projects/monadmon.webp',
			video: ''
		},
		{
			title: 'Mianshiya-Next',
			href: 'https://github.com/lora-sys/mianshiya-next',
			dates: '2026',
			active: true,
			descriptionHtml: toHtml(
				'Enterprise-grade interview practice platform built with Next.js + Spring Boot + Redis + MySQL + Elasticsearch. Features full-text search, token-based auth, rate limiting, circuit breaker patterns, and an interactive calendar for tracking practice history.'
			) as string,
			description:
				'Full-stack interview platform — Next.js + Spring Boot + Elasticsearch. Full-text search, Sa-Token auth, calendar tracking.',
			technologies: ['Next.js', 'Spring Boot', 'Redis', 'MySQL', 'Elasticsearch', 'Java'],
			links: [
				{
					type: 'Source',
					href: 'https://github.com/lora-sys/mianshiya-next',
					icon: Github
				}
			],
			image: '/images/projects/mianshiya.webp',
			video: ''
		}
	],
	favorites: [
		{
			name: 'Frieren',
			description: '葬送芙莉莲 - A journey through memory and magic',
			background: '/images/favorites/frieren.webp',
			href: 'https://zh.wikipedia.org/wiki/%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E',
			cta: 'Learn More',
			icon: BookOpen
		},
		{
			name: 'The Shawshank Redemption',
			description: 'Hope is a good thing',
			background: '/images/favorites/shawshank.webp',
			href: 'https://zh.wikipedia.org/wiki/%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E',
			cta: 'Learn More',
			icon: Film
		},
		{
			name: 'Music',
			description: 'Play my favorite tracks on Spotify',
			background: '/images/favorites/music.webp',
			href: 'https://open.spotify.com/embed/track/54pvEYFocTlvIAQOfXSjqV?utm_source=generator&theme=0',
			cta: 'Listen Now',
			icon: Headphones,
			isSpotify: true // 特殊标记
		},
		{
			name: 'Bitcoin',
			description: 'Digital gold and the future of money',
			background: '/images/favorites/bitcoin.webp',
			href: 'https://zh.wikipedia.org/wiki/%E5%8C%BA%E5%9D%97%E9%93%BE',
			cta: 'Learn More',
			icon: Coins
		},
		{
			name: 'Black Myth: Wukong',
			description: 'A journey to the West reimagined',
			background: '/images/favorites/black-myth-wukong.jpg',
			href: 'https://zh.wikipedia.org/wiki/%E9%BB%91%E7%A5%9E%E8%AF%9D%EF%BC%9A%E6%82%9F%E7%A9%BA',
			cta: 'Learn More',
			icon: Gamepad2
		}
	],
	hackathons: [
		{
			title: 'ETH Beijing 2026',
			dates: 'June 5th - 7th, 2026',
			location: 'Beijing, China (Kunlun Nest)',
			description:
				'Participated in the ETH Beijing Hackathon hosted by PKU Blockchain DAO and WTF Academy. Built an AI Agent x Blockchain project with a team of 5.',
			descriptionHtml: toHtml(
				'Participated in the ETH Beijing Hackathon hosted by PKU Blockchain DAO and WTF Academy. Built an AI Agent x Blockchain project with a team of 5.'
			) as string,
			image: '',
			links: [
				{
					title: 'Source',
					icon: Github,
					href: 'https://github.com/lora-sys/Hackthon'
				}
			]
		},
		{
			title: 'Monad Blitz Hackathon',
			dates: '2026',
			location: 'Online',
			description:
				'Took part in Monad Blitz — rapid-iteration sprints on Monad. Shipped a working prototype in 48 hours; repo archived after the event.',
			descriptionHtml: toHtml(
				'Took part in Monad Blitz — rapid-iteration sprints on Monad. Shipped a working prototype in 48 hours; repo archived after the event.'
			) as string,
			image: '',
			links: []
		},
		{
			title: 'Monad Hackathon',
			dates: 'January 2026',
			location: 'Online',
			description:
				'Built Tarot Prediction DApp — a Web3 tarot card prediction platform on Monad Testnet with interactive 3D cards, TRGL token system, and prediction markets.',
			image: '',
			links: [
				{
					title: 'Source',
					icon: Github,
					href: 'https://github.com/lora-sys/demo_monad_hackthon'
				}
			]
		},
		{
			title: 'Online AI Agent Hackathon',
			dates: 'February 2026',
			location: 'Online',
			description:
				'Built Emergence — a multi-agent collaboration protocol featuring real-time AI debate, evidence chains, and resilient LLM orchestration.',
			image: '',
			links: [
				{
					title: 'Source',
					icon: Github,
					href: 'https://github.com/lora-sys/hackthon-agent'
				}
			]
		}
	],
	notes: [
		{
			title: '多智能体系统的涌现行为',
			date: '2025-12',
			summary:
				'当多个 LLM 实例协作解决同一任务时，观察到了简单的规则如何导致复杂的群体行为。 swarm intelligence 在工程系统中的潜在应用。',
			tags: ['AI Agents', 'Research']
		},
		{
			title: 'Monad 并行 EVM 性能基准',
			date: '2025-11',
			summary:
				'测试了 Monad 的并行交易执行性能，与以太坊 L1 的对比显示 10x+ TPS 提升。关键瓶颈在于状态依赖分析。',
			tags: ['Web3', 'Monad', 'Benchmark']
		},
		{
			title: 'Vercel AI SDK v3 迁移经验',
			date: '2025-10',
			summary:
				'从 v2 迁移到 v3 的主要变化：useChat hook 重构、流式传输 API 变更、新的 tool calling 语法。迁移成本中等，文档仍在完善中。',
			tags: ['Frontend', 'AI', 'Vercel']
		},
		{
			title: 'Rust for AI Agents: 值得吗？',
			date: '2025-09',
			summary:
				'用 Rust 重写 agent runtime 的利弊分析。内存安全和高并发是优势，但生态和开发速度是瓶颈。结论：核心 runtime 用 Rust，应用层继续用 TypeScript。',
			tags: ['Rust', 'AI Agents', 'Architecture']
		}
	]
};
