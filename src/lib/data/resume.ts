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

import BuildSpaceImg from '$lib/imgs/buildspace.jpg';
import WaterLooImg from '$lib/imgs/waterloo.png';

import AtomicImg from '$lib/imgs/atomic.png';
import MingdeImg from '$lib/imgs/mingde.png';
import ShopifyImg from '$lib/imgs/shopify.svg';
import SplunkImg from '$lib/imgs/splunk.svg';
import LimeImg from '$lib/imgs/lime.svg';

// Your resume data
export const DATA = {
	name: 'lora',
	initials: 'XD',
	url: 'https://github.com/lora-sys',
	img: 'https://avatars.githubusercontent.com/u/176668951?v=4',
	location: 'Xian, China',
	locationLink: 'https://www.google.com/maps/place/xian',
	description:
		'Software Engineer turned Entrepreneur. I love building things and helping people. Very active on Twitter.',
	// Pre-compiled HTML from markdown summary — avoids runtime parsing on every render
	summaryHtml: marked.parse(
		'At the end of 2022, I quit my job as a software engineer to go fulltime into building and scaling my own SaaS businesses. In the past, [I pursued a double degree in computer science and business](/#education), [interned at big tech companies in Silicon Valley](https://www.youtube.com/watch?v=d-LJ2e5qKdE), and [competed in over 21 hackathons for fun](/#hackathons). I also had the pleasure of being a part of the first ever in-person cohort of buildspace called [buildspace sf1](https://buildspace.so/sf1).'
	) as string,
	// Legacy raw markdown field (kept for backwards compatibility)
	summary:
		'At the end of 2022, I quit my job as a software engineer to go fulltime into building and scaling my own SaaS businesses. In the past, [I pursued a double degree in computer science and business](/#education), [interned at big tech companies in Silicon Valley](https://www.youtube.com/watch?v=d-LJ2e5qKdE), and [competed in over 21 hackathons for fun](/#hackathons). I also had the pleasure of being a part of the first ever in-person cohort of buildspace called [buildspace sf1](https://buildspace.so/sf1).',
	avatarUrl: 'https://avatars.githubusercontent.com/u/176668951?v=4',
	skills: [
		'Svelte',
		'Sveltekit',
		'Typescript',
		'Node.js',
		'Python',
		'Go',
		'Postgres',
		'Docker',
		'Kubernetes',
		'Java',
		'C++'
	],
	navbar: [
		{ href: '/', icon: HomeIcon, label: 'Home' },
		{ href: '/blog', icon: NotebookIcon, label: 'Blog' },
		{ href: '/#anime', icon: FilmIcon, label: 'Anime' },
		{ href: '/#favorites', icon: HeartIcon, label: 'Favorites' },
		{ href: '#projects', icon: CodeIcon, label: 'Projects' }
	],
	anime: [
		{
			name: 'Made in Abyss',
			quote:
				"I'll go even deeper. Even if it costs me my humanity, I want to see the truth of the Abyss.",
			image: '/images/anime/made-in-abyss.jpg',
			link: 'https://zh.wikipedia.org/wiki/%E4%BE%86%E8%87%AA%E6%B7%B1%E6%B7%B5',
			buttonText: 'Learn More'
		},
		{
			name: '相聚一刻',
			quote: '即使在最平凡的日子里，也有人在默默守护着你。',
			image: '/images/anime/xiangjuyike.jpg',
			link: 'https://zh.wikipedia.org/wiki/%E7%9B%B8%E8%81%9A%E4%B8%80%E5%88%BB',
			buttonText: 'Learn More'
		},
		{
			name: 'Steins;Gate',
			quote: "No one knows what the future holds, that's why its potential is infinite.",
			image: '/images/anime/steins-gate.jpg',
			link: 'https://zh.wikipedia.org/wiki/%E5%91%BD%E9%81%8B%E7%9F%B3%E4%B9%8B%E9%96%80',
			buttonText: 'Learn More'
		},
		{
			name: 'Attack on Titan',
			quote: "The world is merciless, and it's also very beautiful.",
			image: '/images/anime/attack-on-titan.jpg',
			link: 'https://zh.wikipedia.org/wiki/%E9%80%B2%E6%93%8A%E7%9A%84%E5%B7%A8%E4%BA%BA',
			buttonText: 'Learn More'
		},
		{
			name: 'Eureka Seven',
			quote: 'Freedom is something that you need to actively acquire.',
			image: '/images/anime/eureka-seven.jpg',
			link: 'https://zh.wikipedia.org/wiki/%E4%BA%A4%E5%93%8D%E8%AF%97%E7%AF%87',
			buttonText: 'Learn More'
		},
		{
			name: 'Bakuman',
			quote:
				"Don't think 'it would be nice if that came true'. Work hard and make it your reality.",
			image: '/images/anime/bakuman.jpg',
			link: 'https://zh.wikipedia.org/wiki/%E7%88%B6%E6%BC%AB%E7%8E%8B',
			buttonText: 'Learn More'
		},
		{
			name: 'Death Note',
			quote: 'The world is rotten, and those who are making it rot deserve to die.',
			image: '/images/anime/death-note.jpg',
			link: 'https://zh.wikipedia.org/wiki/%E6%AD%BB%E4%BA%A1%E7%AC%94%E8%AE%B0',
			buttonText: 'Learn More'
		}
	],
	contact: {
		email: 'hello@example.com',
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
				url: 'https://www.youtube.com/',
				icon: YouTubeSvg,
				navbar: true,
				dark_icon: YouTubeDarkSvg
			},
			Bilibili: {
				name: 'Bilibili',
				url: 'https://space.bilibili.com/',
				icon: BilibiliSvg,
				navbar: true,
				dark_icon: BilibiliDarkSvg
			},
			email: {
				name: 'Send Email',
				url: '#',
				// // icon: Icons.email,
				icon: GmailSvg,
				navbar: false,
				dark_icon: GmailDarkSvg
			}
		}
	},
	work: [
		{
			company: 'Atomic Finance',
			href: 'https://atomic.finance',
			badges: [],
			location: 'Remote',
			title: 'Bitcoin Protocol Engineer',
			logoUrl: AtomicImg,
			start: 'May 2021',
			end: 'Oct 2022',
			description:
				'Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.'
		},
		{
			company: 'Shopify',
			badges: [],
			href: 'https://shopify.com',
			location: 'Remote',
			title: 'Software Engineer',
			logoUrl: ShopifyImg,
			start: 'January 2021',
			end: 'April 2021',
			description:
				'Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.'
		},
		{
			company: 'Nvidia',
			href: 'https://nvidia.com/',
			badges: [],
			location: 'Santa Clara, CA',
			title: 'Software Engineer',
			logoUrl: '',
			start: 'January 2020',
			end: 'April 2020',
			description:
				'Architected and wrote the entire MVP of the GeForce Now Cloud Gaming internal admin and A/B testing dashboard using React, Redux, TypeScript, and Python.'
		},
		{
			company: 'Splunk',
			href: 'https://splunk.com',
			badges: [],
			location: 'San Jose, CA',
			title: 'Software Engineer',
			logoUrl: SplunkImg,
			start: 'January 2019',
			end: 'April 2019',
			description:
				'Co-developed a prototype iOS app with another intern in Swift for the new Splunk Phantom security orchestration product (later publicly demoed and launched at .conf annual conference in Las Vegas). Implemented a realtime service for the iOS app in Django (Python) and C++; serialized data using protobufs transmitted over gRPC resulting in an approximate 500% increase in data throughput.'
		},
		{
			company: 'Lime',
			href: 'https://li.me/',
			badges: [],
			location: 'San Francisco, CA',
			title: 'Software Engineer',
			logoUrl: LimeImg,
			start: 'January 2018',
			end: 'April 2018',
			description:
				'Proposed and implemented an internal ruby API for sending/receiving commands to scooters over LTE networks. Developed a fully automated bike firmware update system to handle asynchronous firmware updates of over 100,000+ scooters worldwide, and provide progress reports in real-time using React, Ruby on Rails, PostgreSQL and AWS EC2 saving hundreds of developer hours.'
		},
		{
			company: 'Mitre Media',
			href: 'https://mitremedia.com/',
			badges: [],
			location: 'Toronto, ON',
			title: 'Software Engineer',
			logoUrl: '',
			start: 'May 2017',
			end: 'August 2017',
			description:
				'Designed and implemented a robust password encryption and browser cookie storage system in Ruby on Rails. Leveraged the Yahoo finance API to develop the dividend.com equity screener'
		}
	],
	education: [
		{
			school: 'Buildspace',
			href: 'https://buildspace.so',
			degree: 's3, s4, sf1, s5',
			logoUrl: BuildSpaceImg,
			start: '2023',
			end: '2024'
		},
		{
			school: 'University of Waterloo',
			href: 'https://uwaterloo.ca',
			degree: "Bachelor's Degree of Computer Science (BCS)",
			logoUrl: WaterLooImg,
			start: '2016',
			end: '2021'
		},
		{
			school: 'Wilfrid Laurier University',
			href: 'https://wlu.ca',
			degree: "Bachelor's Degree of Business Administration (BBA)",
			logoUrl: '',
			start: '2016',
			end: '2021'
		},
		{
			school: "Xi'an Mingde Institute of Technology",
			href: 'https://www.mdit.edu.cn',
			degree: '',
			logoUrl: MingdeImg,
			start: '2022',
			end: '2024'
		},
		{
			school: 'International Baccalaureate',
			href: 'https://ibo.org',
			degree: 'IB Diploma',
			logoUrl: '',
			start: '2012',
			end: '2016'
		}
	],
	projects: [
		{
			title: 'Chat Collect',
			href: 'https://chatcollect.com',
			dates: 'Jan 2024 - Feb 2024',
			active: true,
			descriptionHtml: marked.parse(
				'With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.'
			) as string,
			description:
				'With the release of the [OpenAI GPT Store](https://openai.com/blog/introducing-the-gpt-store), I decided to build a SaaS which allows users to collect email addresses from their GPT users. This is a great way to build an audience and monetize your GPT API usage.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Stripe',
				'Shadcn UI',
				'Magic UI'
			],
			links: [
				{
					type: 'Website',
					href: 'https://chatcollect.com',
					// icon: <Icons.globe className="size-3" />,
					icon: Globe
				}
			],
			image: '',
			video: 'https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4'
		},
		{
			title: 'Magic UI',
			href: 'https://magicui.design',
			dates: 'June 2023 - Present',
			active: true,
			descriptionHtml: marked.parse(
				'Designed, developed and sold animated UI components for developers.'
			) as string,
			description: 'Designed, developed and sold animated UI components for developers.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Stripe',
				'Shadcn UI',
				'Magic UI'
			],
			links: [
				{
					type: 'Website',
					href: 'https://magicui.design',
					// icon: <Icons.globe className="size-3" />,
					icon: Globe
				},
				{
					type: 'Source',
					href: 'https://github.com/magicuidesign/magicui',
					icon: Github
					// icon: <Icons.github className="size-3" />,
				}
			],
			image: '',
			video: 'https://cdn.magicui.design/bento-grid.mp4'
		},
		{
			title: 'llm.report',
			href: 'https://llm.report',
			dates: 'April 2023 - September 2023',
			active: true,
			descriptionHtml: marked.parse(
				'Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.'
			) as string,
			description:
				'Developed an open-source logging and analytics platform for OpenAI: Log your ChatGPT API requests, analyze costs, and improve your prompts.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Shadcn UI',
				'Magic UI',
				'Stripe',
				'Cloudflare Workers'
			],
			links: [
				{
					type: 'Website',
					href: 'https://llm.report',
					icon: Globe
					// icon: <Icons.globe className="size-3" />,
				},
				{
					type: 'Source',
					href: 'https://github.com/dillionverma/llm.report',
					icon: Github
					// icon: <Icons.github className="size-3" />,
				}
			],
			image: '',
			video: 'https://cdn.llm.report/openai-demo.mp4'
		},
		{
			title: 'Automatic Chat',
			href: 'https://automatic.chat',
			dates: 'April 2023 - March 2024',
			active: true,
			descriptionHtml: marked.parse(
				'Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.'
			) as string,
			description:
				'Developed an AI Customer Support Chatbot which automatically responds to customer support tickets using the latest GPT models.',
			technologies: [
				'Next.js',
				'Typescript',
				'PostgreSQL',
				'Prisma',
				'TailwindCSS',
				'Shadcn UI',
				'Magic UI',
				'Stripe',
				'Cloudflare Workers'
			],
			links: [
				{
					type: 'Website',
					href: 'https://automatic.chat',
					icon: Globe
					// icon: <Icons.globe className="size-3" />,
				}
			],
			image: '',
			video: 'https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4'
		}
	],
	favorites: [
		{
			name: 'Frieren',
			description: '葬送芙莉莲 - A journey through memory and magic',
			background: '/images/favorites/frieren.jpg',
			href: 'https://zh.wikipedia.org/wiki/%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E',
			cta: 'Learn More',
			icon: BookOpen
		},
		{
			name: 'The Shawshank Redemption',
			description: 'Hope is a good thing',
			background: '/images/favorites/shawshank.jpg',
			href: 'https://zh.wikipedia.org/wiki/%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E',
			cta: 'Learn More',
			icon: Film
		},
		{
			name: 'Music',
			description: 'Play my favorite tracks on Spotify',
			background: '/images/favorites/music.jpg',
			href: 'https://open.spotify.com/embed/track/4SqWKzw0CbA05TGszDgMlc?utm_source=generator&theme=0',
			cta: 'Listen Now',
			icon: Headphones,
			isSpotify: true // 特殊标记
		},
		{
			name: 'Bitcoin',
			description: 'Digital gold and the future of money',
			background: '/images/favorites/bitcoin.jpg',
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
			title: 'Hack Western 5',
			dates: 'November 23rd - 25th, 2018',
			location: 'London, Ontario',
			description:
				'Developed a mobile application which delivered bedtime stories to children using augmented reality.',
			image: '/hackline/hack-western.png',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg',
			links: []
		},
		{
			title: 'Hack The North',
			dates: 'September 14th - 16th, 2018',
			location: 'Waterloo, Ontario',
			description:
				'Developed a mobile application which delivers university campus wide events in real time to all students.',
			image: '/hackline/hack-the-north.png',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg',
			links: []
		},
		{
			title: 'FirstNet Public Safety Hackathon',
			dates: 'March 23rd - 24th, 2018',
			location: 'San Francisco, California',
			description:
				'Developed a mobile application which communcicates a victims medical data from inside an ambulance to doctors at hospital.',
			// icon: "public",
			image: '/hackline/firstnet.png',
			links: []
		},
		{
			title: 'DeveloperWeek Hackathon',
			dates: 'February 3rd - 4th, 2018',
			location: 'San Francisco, California',
			description:
				'Developed a web application which aggregates social media data regarding cryptocurrencies and predicts future prices.',
			image: '/hackline/developer-week.jpg',
			links: [
				{
					title: 'Github',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/cryptotrends/cryptotrends'
				}
			]
		},
		{
			title: 'HackDavis',
			dates: 'January 20th - 21st, 2018',
			location: 'Davis, California',
			description:
				'Developed a mobile application which allocates a daily carbon emission allowance to users to move towards a sustainable environment.',
			image: '/hackline/hack-davis.png',
			win: 'Best Data Hack',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2018/white.svg',
			links: [
				{
					title: 'Devpost',
					icon: Globe,
					// icon: <Icons.globe className="h-4 w-4" />,
					href: 'https://devpost.com/software/my6footprint'
				},
				{
					title: 'ML',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/Wallet6/my6footprint-machine-learning'
				},
				{
					title: 'iOS',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/Wallet6/CarbonWallet'
				},
				{
					title: 'Server',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/Wallet6/wallet6-server'
				}
			]
		},
		{
			title: 'ETH Waterloo',
			dates: 'October 13th - 15th, 2017',
			location: 'Waterloo, Ontario',
			description:
				'Developed a blockchain application for doctors and pharmacists to perform trustless transactions and prevent overdosage in patients.',
			image: '/hackline/eth-waterloo.png',
			links: [
				{
					title: 'Organization',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/ethdocnet'
				}
			]
		},
		{
			title: 'Hack The North',
			dates: 'September 15th - 17th, 2017',
			location: 'Waterloo, Ontario',
			description:
				'Developed a virtual reality application allowing users to see themselves in third person.',
			image: '/hackline/hack-the-north.png',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg',
			links: [
				{
					title: 'Streamer Source',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/justinmichaud/htn2017'
				},
				{
					title: 'Client Source',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/dillionverma/RTSPClient'
				}
			]
		},
		{
			title: 'Hack The 6ix',
			dates: 'August 26th - 27th, 2017',
			location: 'Toronto, Ontario',
			description:
				'Developed an open platform for people shipping items to same place to combine shipping costs and save money.',
			image: '/hackline/hack-the-6ix.jpg',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg',
			links: [
				{
					title: 'Source',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/ShareShip/ShareShip'
				},
				{
					title: 'Site',
					icon: Globe,
					// icon: <Icons.globe className="h-4 w-4" />,
					href: 'https://share-ship.herokuapp.com/'
				}
			]
		},
		{
			title: 'Stupid Hack Toronto',
			dates: 'July 23rd, 2017',
			location: 'Toronto, Ontario',
			description:
				'Developed a chrome extension which tracks which facebook profiles you have visited and immediately texts your girlfriend if you visited another girls page.',
			image: '/hackline/stupid-hackathon.png',
			links: [
				{
					title: 'Source',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/nsagirlfriend/nsagirlfriend'
				}
			]
		},
		{
			title: 'Global AI Hackathon - Toronto',
			dates: 'June 23rd - 25th, 2017',
			location: 'Toronto, Ontario',
			descriptionHtml: marked.parse(
				'Developed a python library which can be imported to any python game and change difficulty of the game based on real time emotion of player. Uses OpenCV and webcam for facial recognition, and a custom Machine Learning Model trained on a [Kaggle Emotion Dataset](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/leaderboard) using [Tensorflow](https://www.tensorflow.org/Tensorflow) and [Keras](https://keras.io/). This project recieved 1st place prize at the Global AI Hackathon - Toronto and was also invited to demo at [NextAI Canada](https://www.nextcanada.com/next-ai).'
			) as string,
			description:
				'Developed a python library which can be imported to any python game and change difficulty of the game based on real time emotion of player. Uses OpenCV and webcam for facial recognition, and a custom Machine Learning Model trained on a [Kaggle Emotion Dataset](https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/leaderboard) using [Tensorflow](https://www.tensorflow.org/Tensorflow) and [Keras](https://keras.io/). This project recieved 1st place prize at the Global AI Hackathon - Toronto and was also invited to demo at [NextAI Canada](https://www.nextcanada.com/next-ai).',
			image: '/hackline/global-ai-hackathon.jpg',
			win: '1st Place Winner',
			links: [
				{
					title: 'Article',
					icon: Globe,
					// icon: <Icons.globe className="h-4 w-4" />,
					href: 'https://syncedreview.com/2017/06/26/global-ai-hackathon-in-toronto/'
				},
				{
					title: 'Source',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/TinySamosas/'
				}
			]
		},
		{
			title: 'McGill AI for Social Innovation Hackathon',
			dates: 'June 17th - 18th, 2017',
			location: 'Montreal, Quebec',
			description: 'Developed realtime facial microexpression analyzer using AI',
			image: '/hackline/ai-for-social-good.jpg',
			links: []
		},
		{
			title: 'Open Source Circular Economy Days Hackathon',
			dates: 'June 10th, 2017',
			location: 'Toronto, Ontario',
			description:
				"Developed a custom admin interface for food waste startup <a href='http://genecis.co/'>Genecis</a> to manage their data and provide analytics.",
			image: '/hackline/open-source-circular-economy-days.jpg',
			win: '1st Place Winner',
			links: [
				{
					title: 'Source',
					icon: Github,
					// icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/dillionverma/genecis'
				}
			]
		},
		{
			title: "Make School's Student App Competition 2017",
			dates: 'May 19th - 21st, 2017',
			location: 'International',
			description: 'Improved PocketDoc and submitted to online competition',
			image: '/hackline/make-school-hackathon.png',
			win: 'Top 10 Finalist | Honourable Mention',
			links: [
				{
					title: 'Medium Article',
					icon: Github,
					// icon: <Icons.globe className="h-4 w-4" />,
					href: 'https://medium.com/make-school/the-winners-of-make-schools-student-app-competition-2017-a6b0e72f190a'
				},
				{
					title: 'Devpost',
					icon: Globe,
					// icon: <Icons.globe className="h-4 w-4" />,
					href: 'https://devpost.com/software/pocketdoc-react-native'
				},
				{
					title: 'YouTube',
					icon: Youtube,
					// icon: <Icons.youtube className="h-4 w-4" />,
					href: 'https://www.youtube.com/watch?v=XwFdn5Rmx68'
				},
				{
					title: 'Source',
					icon: Github,
					href: 'https://github.com/dillionverma/pocketdoc-react-native'
				}
			]
		},
		{
			title: 'HackMining',
			dates: 'May 12th - 14th, 2017',
			location: 'Toronto, Ontario',
			description: 'Developed neural network to optimize a mining process',
			image: '/hackline/hack-mining.png',
			links: []
		},
		{
			title: 'Waterloo Equithon',
			dates: 'May 5th - 7th, 2017',
			location: 'Waterloo, Ontario',
			description:
				'Developed Pocketdoc, an app in which you take a picture of a physical wound, and the app returns common solutions or cures to the injuries or diseases.',
			image: '/hackline/waterloo-equithon.png',
			links: [
				{
					title: 'Devpost',
					icon: Globe,
					// icon: <Icons.globe className="h-4 w-4" />,
					href: 'https://devpost.com/software/pocketdoc-react-native'
				},
				{
					title: 'YouTube',
					icon: Youtube,
					// icon: <Icons.youtube className="h-4 w-4" />,
					href: 'https://www.youtube.com/watch?v=XwFdn5Rmx68'
				},
				{
					title: 'Source',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/dillionverma/pocketdoc-react-native'
				}
			]
		},
		{
			title: 'SpaceApps Waterloo',
			dates: 'April 28th - 30th, 2017',
			location: 'Waterloo, Ontario',
			description:
				'Developed Earthwatch, a web application which allows users in a plane to virtually see important points of interest about the world below them. They can even choose to fly away from their route and then fly back if they choose. Special thanks to CesiumJS for providing open source world and plane models.',
			image: '/hackline/space-apps.png',
			links: [
				{
					title: 'Source',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/dillionverma/earthwatch'
				}
			]
		},
		{
			title: 'MHacks 9',
			dates: 'March 24th - 26th, 2017',
			location: 'Ann Arbor, Michigan',
			description:
				'Developed Super Graphic Air Traffic, a VR website made to introduce people to the world of air traffic controlling. This project was built completely using THREE.js as well as a node backend server.',
			image: '/hackline/mhacks-9.png',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg',
			links: [
				{
					title: 'Source',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/dillionverma/threejs-planes'
				}
			]
		},
		{
			title: 'StartHacks I',
			dates: 'March 4th - 5th, 2017',
			location: 'Waterloo, Ontario',
			description:
				'Developed at StartHacks 2017, Recipic is a mobile app which allows you to take pictures of ingredients around your house, and it will recognize those ingredients using ClarifAI image recognition API and return possible recipes to make. Recipic recieved 1st place at the hackathon for best pitch and hack.',
			image: '/hackline/starthacks.png',
			win: '1st Place Winner',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg',
			links: [
				{
					title: 'Source (Mobile)',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/mattBlackDesign/recipic-ionic'
				},
				{
					title: 'Source (Server)',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/mattBlackDesign/recipic-rails'
				}
			]
		},
		{
			title: 'QHacks II',
			dates: 'February 3rd - 5th, 2017',
			location: 'Kingston, Ontario',
			description: 'Developed a mobile game which enables city-wide manhunt with random lobbies',
			image: '/hackline/qhacks.png',
			mlh: 'https://s3.amazonaws.com/logged-assets/trust-badge/2017/white.svg',
			links: [
				{
					title: 'Source (Mobile)',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/dillionverma/human-huntr-react-native'
				},
				{
					title: 'Source (API)',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/mattBlackDesign/human-huntr-rails'
				}
			]
		},
		{
			title: 'Terrible Hacks V',
			dates: 'November 26th, 2016',
			location: 'Waterloo, Ontario',
			description:
				'Developed a mock of Windows 11 with interesting notifications and functionality',
			image: '/hackline/terrible-hacks-v.png',
			links: [
				{
					title: 'Source',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/justinmichaud/TerribleHacks2016-Windows11'
				}
			]
		},
		{
			title: 'Portal Hackathon',
			dates: 'October 29, 2016',
			location: 'Kingston, Ontario',
			description:
				"Developed an internal widget for uploading assignments using Waterloo's portal app",
			image: '/hackline/portal-hackathon.png',
			links: [
				{
					title: 'Source',
					icon: Github,
					//   // icon: <Icons.github className="h-4 w-4" />,
					href: 'https://github.com/UWPortalSDK/crowmark'
				}
			]
		}
	]
};
