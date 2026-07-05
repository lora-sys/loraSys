import {
	CodeIcon,
	Github,
	Globe,
	HomeIcon,
	NotebookIcon,
	Youtube,
	BookOpen,
	Film,
	Headphones,
	Coins,
	Gamepad2,
	HeartIcon,
	FilmIcon
} from '@lucide/svelte';
import { marked } from 'marked';
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
	initials: 'XD',
	url: 'https://github.com/lora-sys',
	img: 'https://avatars.githubusercontent.com/u/176668951?v=4',
	location: 'Xian, China',
	locationLink: 'https://www.google.com/maps/place/xian',
	description:
		'Builder of evolving systems. Turning ambitious ideas into reality. Always building, learning, and shipping.',
	// Pre-compiled HTML from markdown summary — avoids runtime parsing on every render
	summaryHtml: marked.parse(
		"Builder of evolving systems. Turning ambitious ideas into reality. Always building, learning, and shipping.\n\nI am a student at [Xi'an Mingde Institute of Technology](/#education), majoring in Computer Science. I love exploring new areas \u2014 AI, blockchain, Web3, and full-stack development. I have participated in hackathons including Monad Hackathon, Monad Blitz, ETH Beijing 2026, and multiple online AI agent hackathons. I have 103+ public repos on GitHub covering AI agents, Web3 dApps, full-stack applications, and more."
	) as string,
	// Legacy raw markdown field (kept for backwards compatibility)
	summary:
		"Builder of evolving systems. Turning ambitious ideas into reality. Always building, learning, and shipping.\n\nI am a student at [Xi'an Mingde Institute of Technology](/#education), majoring in Computer Science. I love exploring new areas \u2014 AI, blockchain, Web3, and full-stack development. I have participated in hackathons including Monad Hackathon, Monad Blitz, ETH Beijing 2026, and multiple online AI agent hackathons. I have 103+ public repos on GitHub covering AI agents, Web3 dApps, full-stack applications, and more.",
	avatarUrl: 'https://avatars.githubusercontent.com/u/176668951?v=4',
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
				url: 'https://www.linkedin.com/in/sikandar-bhide/',
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
			descriptionHtml: marked.parse(
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
			image: 'https://raw.githubusercontent.com/lora-sys/Newtube-clone/main/logo/architecture.png',
			video: ''
		},
		{
			title: 'Daily-Rss',
			href: 'https://github.com/lora-sys/Daily-Rss',
			dates: 'Dec 2025 - Jan 2026',
			active: true,
			descriptionHtml: marked.parse(
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
			image:
				'https://raw.githubusercontent.com/lora-sys/Daily-Rss/main/public/Snipaste_2025-12-28_16-28-54.png',
			video: ''
		},
		{
			title: 'TrandingOs',
			href: 'https://github.com/lora-sys/TrandingOs',
			dates: 'Jun 2026 - Present',
			active: true,
			descriptionHtml: marked.parse(
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
			image: 'https://raw.githubusercontent.com/lora-sys/TrandingOs/main/images/image1.jpg',
			video: ''
		},
		{
			title: 'aicompanyos',
			href: 'https://github.com/lora-sys/aicompanyos',
			dates: 'Jun 2026 - Present',
			active: true,
			descriptionHtml: marked.parse(
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
			image: 'https://raw.githubusercontent.com/lora-sys/aicompanyos/main/image/1.png',
			video: ''
		},
		{
			title: 'nanochat-studay',
			href: 'https://github.com/lora-sys/nanochat-studay',
			dates: 'Mar 2026',
			active: true,
			descriptionHtml: marked.parse(
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
			image: 'https://opengraph.githubassets.com/1/lora-sys/nanochat-studay',
			video: ''
		},
		{
			title: 'Emergence',
			href: 'https://github.com/lora-sys/hackthon-agent',
			dates: 'Feb 2026',
			active: true,
			descriptionHtml: marked.parse(
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
			image:
				'https://raw.githubusercontent.com/lora-sys/hackthon-agent/master/docs/assets/emergence-demo.png',
			video: ''
		},
		{
			title: 'Tarot Prediction DApp',
			href: 'https://github.com/lora-sys/demo_monad_hackthon',
			dates: 'Jan 2026',
			active: true,
			descriptionHtml: marked.parse(
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
			image: 'https://opengraph.githubassets.com/1/lora-sys/demo_monad_hackthon',
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
			background: 'https://upload.wikimedia.org/wikipedia/zh/a/a6/Black_Myth_Wukong_cover_art.jpg',
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
			descriptionHtml: marked.parse(
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
			description: 'Participated in the Monad Blitz hackathon, building on the Monad blockchain.',
			descriptionHtml: marked.parse(
				'Participated in the Monad Blitz hackathon, building on the Monad blockchain.'
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
	]
};
