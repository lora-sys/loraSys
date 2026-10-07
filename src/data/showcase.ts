export interface ShowcaseItem {
  name: string
  nameEn?: string
  description: string
  descriptionEn?: string
  image: string
  /** Local path (with base) used when the remote `image` fails to load. */
  imageFallback?: string
  /** Force eager loading for posters that must be available without scroll, e.g. third-party CDN. */
  imageEager?: boolean
  href: string
  medium?: string
  mediumEn?: string
  mediaKind?: 'poster' | 'cover' | 'artwork'
  objectPosition?: string
  posterSource?: string
  sourceLabel?: string
  sourceLabelEn?: string
  broadcastPalette?: [string, string]
  broadcastMotion?: { duration: number; x: number; y: number; scale: number }
  video?: {
    provider: 'youtube' | 'bilibili'
    id: string
    sourceLabel: string
    title?: string
    titleEn?: string
    sourceUrl?: string
    watchUrl?: string
    uploader?: string
    checkedAt?: string
    embed?: boolean
  }
  cta?: string
  spotify?: boolean
  artist?: string
}

// Details and poster artwork: https://kitsu.io/anime/kimagure-orange-road
// Poster source: https://media.kitsu.app/anime/poster_images/972/large.jpg
// Details and poster artwork: https://kitsu.io/anime/city-hunter
// Poster source: https://media.kitsu.app/anime/poster_images/1316/large.jpg
export const anime: ShowcaseItem[] = [
  {
    name: 'Made in Abyss',
    description: 'Even if it costs my humanity, I want to see the truth of the Abyss.',
    image: '/images/anime/made-in-abyss.webp',
    href: 'https://zh.wikipedia.org/wiki/%E4%BE%86%E8%87%AA%E6%B7%B1%E6%B7%B5',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://zh.wikipedia.org/wiki/%E4%BE%86%E8%87%AA%E6%B7%B1%E6%B7%B5',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia',
    broadcastPalette: ['#d99a33', '#4c8177'],
    broadcastMotion: { duration: 9, x: 0.7, y: -0.4, scale: 1.055 },
    video: {
      provider: 'youtube',
      id: 'Sy7cLG6XHRY',
      sourceLabel: 'miabyss.com',
      title: '《来自深渊 觉醒的神秘》正式预告',
      titleEn: 'Awakening Mystery · official trailer',
      sourceUrl: 'https://miabyss.com/movie_part1/movie.html',
      watchUrl: 'https://www.youtube.com/watch?v=Sy7cLG6XHRY',
      uploader: 'KADOKAWAanime',
      checkedAt: '2026-10-02',
      embed: true
    }
  },
  {
    name: '相聚一刻',
    description: '即使在最平凡的日子里，也有人在默默守护着你。',
    image: '/images/anime/xiangjuyike.webp',
    href: 'https://zh.wikipedia.org/wiki/%E7%9B%B8%E8%81%9A%E4%B8%80%E5%88%BB',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://zh.wikipedia.org/wiki/%E7%9B%B8%E8%81%9A%E4%B8%80%E5%88%BB',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia',
    broadcastPalette: ['#a76550', '#d99a33'],
    broadcastMotion: { duration: 9, x: -0.5, y: 0.3, scale: 1.055 }
  },
  {
    name: 'Kimagure Orange☆Road / 橙路',
    description: '夏日、超能力与摇摆不定的青春。',
    image: '/images/anime/kimagure-orange-road.jpg',
    href: 'https://kitsu.io/anime/kimagure-orange-road',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://kitsu.io/anime/kimagure-orange-road',
    sourceLabel: '本地归档图片，作品资料见 Kitsu 页面',
    sourceLabelEn: 'Local archive image; title details on Kitsu',
    broadcastPalette: ['#d99a33', '#a76550'],
    broadcastMotion: { duration: 9, x: 0.4, y: -0.5, scale: 1.055 }
  },
  {
    name: 'City Hunter / 城市猎人',
    video: {
      provider: 'youtube',
      id: 'nLdeQHeuHck',
      sourceLabel: 'cityhunter-movie.com',
      title: '《城市猎人 天使之泪》90秒预告',
      titleEn: 'Angel Dust · 90-second official trailer',
      sourceUrl: 'https://cityhunter-movie.com/news/?article_id=63198',
      watchUrl: 'https://www.youtube.com/watch?v=nLdeQHeuHck',
      uploader: 'Aniplex',
      checkedAt: '2026-10-02',
      embed: true
    },
    description: '新宿的夜、神枪手与危险委托交织成的都市浪漫。',
    image: '/images/anime/city-hunter.jpg',
    href: 'https://kitsu.io/anime/city-hunter',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://kitsu.io/anime/city-hunter',
    sourceLabel: '本地归档图片，作品资料见 Kitsu 页面',
    sourceLabelEn: 'Local archive image; title details on Kitsu',
    broadcastPalette: ['#4c8177', '#d99a33'],
    broadcastMotion: { duration: 9, x: -0.6, y: 0.2, scale: 1.055 }
  },
  {
    name: 'Steins;Gate',
    description: 'No one knows what the future holds; its potential is infinite.',
    image: '/images/anime/steins-gate.webp',
    href: 'https://zh.wikipedia.org/wiki/%E5%91%BD%E9%81%8B%E7%9F%B3%E4%B9%8B%E9%96%80',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://zh.wikipedia.org/wiki/%E5%91%BD%E9%81%8B%E7%9F%B3%E4%B9%8B%E9%96%80',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia',
    broadcastPalette: ['#4c8177', '#755f48'],
    broadcastMotion: { duration: 9, x: 0.5, y: -0.3, scale: 1.055 }
  },
  {
    name: 'Attack on Titan',
    description: 'The world is merciless, and it is also very beautiful.',
    image: '/images/anime/attack-on-titan.webp',
    href: 'https://zh.wikipedia.org/wiki/%E9%80%B2%E6%93%8A%E7%9A%84%E5%B7%A8%E4%BA%BA',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://zh.wikipedia.org/wiki/%E9%80%B2%E6%93%8A%E7%9A%84%E5%B7%A8%E4%BA%BA',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia',
    broadcastPalette: ['#a76550', '#4c8177'],
    broadcastMotion: { duration: 9, x: -0.4, y: 0.4, scale: 1.055 }
  },
  {
    name: 'Eureka Seven',
    description: 'Freedom is something that you need to actively acquire.',
    image: '/images/anime/eureka-seven.webp',
    href: 'https://zh.wikipedia.org/wiki/%E4%BA%A4%E5%93%8D%E8%AF%97%E7%AF%87',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://zh.wikipedia.org/wiki/%E4%BA%A4%E5%93%8D%E8%AF%97%E7%AF%87',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia',
    broadcastPalette: ['#4c8177', '#d99a33'],
    broadcastMotion: { duration: 9, x: 0.6, y: -0.2, scale: 1.055 }
  },
  {
    name: 'Bakuman',
    description: 'Work hard and make the thing you wish for your reality.',
    image: '/images/anime/bakuman.webp',
    href: 'https://zh.wikipedia.org/wiki/%E7%88%B6%E6%BC%AB%E7%8E%8B',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://zh.wikipedia.org/wiki/%E7%88%B6%E6%BC%AB%E7%8E%8B',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia',
    broadcastPalette: ['#d99a33', '#4c8177'],
    broadcastMotion: { duration: 9, x: -0.3, y: 0.5, scale: 1.055 }
  },
  {
    name: 'Death Note',
    description: 'A tense study of justice, power, and consequence.',
    image: '/images/anime/death-note.webp',
    href: 'https://zh.wikipedia.org/wiki/%E6%AD%BB%E4%BA%A1%E7%AC%94%E8%AE%B0',
    mediaKind: 'poster',
    objectPosition: '50% 50%',
    posterSource: 'https://zh.wikipedia.org/wiki/%E6%AD%BB%E4%BA%A1%E7%AC%94%E8%AE%B0',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia',
    broadcastPalette: ['#755f48', '#a76550'],
    broadcastMotion: { duration: 9, x: 0.4, y: -0.4, scale: 1.055 }
  },
  {
    name: '天元突破红莲螺岩',
    description: '从地底钻出自己的天空。',
    image: 'https://cdn.myanimelist.net/images/anime/4/5123l.jpg',
    imageEager: true,
    imageFallback: '/images/anime/gurren-lagann.jpg',
    href: 'https://zh.wikipedia.org/wiki/%E5%A4%A9%E5%85%83%E7%AA%81%E7%A0%B4_%E7%BA%A2%E8%8E%B2%E8%9E%BA%E5%B2%A9',
    mediaKind: 'poster',
    objectPosition: '50% 35%',
    posterSource: 'https://myanimelist.net/anime/2001/Tengen_Toppa_Gurren_Lagann',
    sourceLabel: '海报来源：MyAnimeList',
    sourceLabelEn: 'Poster source: MyAnimeList',
    broadcastPalette: ['#a76550', '#d99a33'],
    broadcastMotion: { duration: 9, x: 0.7, y: 0.2, scale: 1.055 }
  },
  {
    name: '四月是你的谎言',
    description: '有些旋律，会把青春重新点亮。',
    image: 'https://cdn.myanimelist.net/images/anime/1405/143284l.jpg',
    imageEager: true,
    imageFallback: '/images/anime/your-lie-in-april.jpg',
    href: 'https://zh.wikipedia.org/wiki/%E5%9B%9B%E6%9C%88%E6%98%AF%E4%BD%A0%E7%9A%84%E8%B0%8E%E8%A8%80',
    mediaKind: 'poster',
    objectPosition: '50% 32%',
    posterSource: 'https://myanimelist.net/anime/23273/Shigatsu_wa_Kimi_no_Uso',
    sourceLabel: '海报来源：MyAnimeList',
    sourceLabelEn: 'Poster source: MyAnimeList',
    broadcastPalette: ['#d99a33', '#4c8177'],
    broadcastMotion: { duration: 9, x: -0.5, y: -0.3, scale: 1.055 }
  }
]

// Spotify verified track: Living Inside Of Your Love — Yutaka Yokokura
// https://open.spotify.com/track/2RGoMak3qjAjMfR0duV2Dp
// Artwork source: https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025673b6305b503f473b26e2fb
export const favorites: ShowcaseItem[] = [
  // Official series header artwork: https://dw9to29mmj727.cloudfront.net/promo/2016/5433-Tier03_SeriesHeader_20C_2000x800.jpg
  {
    name: '20世纪少年',
    medium: '漫画',
    mediumEn: 'Manga',
    nameEn: '20th Century Boys',
    description: '童年暗号、友情与末日预言，交织成一场跨越二十年的谜局。',
    descriptionEn:
      'Childhood codes, old friendships, and a doomsday mystery unfolding across decades.',
    image: '/images/favorites/20th-century-boys.webp',
    href: 'https://www.viz.com/naoki-urasawa-s-20th-century-boys',
    posterSource:
      'https://dw9to29mmj727.cloudfront.net/promo/2016/5433-Tier03_SeriesHeader_20C_2000x800.jpg',
    sourceLabel: 'VIZ 官方系列横幅',
    sourceLabelEn: 'Official series banner from VIZ'
  },
  {
    name: 'The Shawshank Redemption',
    medium: '电影',
    mediumEn: 'Film',
    description: 'Hope is a good thing, maybe the best of things.',
    image: '/images/favorites/shawshank.webp',
    href: 'https://zh.wikipedia.org/wiki/%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E',
    posterSource:
      'https://zh.wikipedia.org/wiki/%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia'
  },
  {
    name: 'Living Inside Of Your Love',
    medium: '音乐',
    mediumEn: 'Music',
    artist: 'Yutaka Yokokura',
    description: 'Yutaka Yokokura — a luminous jazz-fusion and city-pop favorite.',
    image: '/images/favorites/living-inside-of-your-love.jpg',
    href: 'https://open.spotify.com/embed/track/2RGoMak3qjAjMfR0duV2Dp?utm_source=generator&theme=0',
    posterSource:
      'https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e025673b6305b503f473b26e2fb',
    sourceLabel: 'Spotify 专辑封面',
    sourceLabelEn: 'Album artwork from Spotify',
    cta: 'Listen now',
    spotify: true
  },
  {
    name: 'Bitcoin',
    medium: '想法',
    mediumEn: 'Ideas',
    description: 'Digital scarcity, open networks, and programmable money.',
    image: '/images/favorites/bitcoin-mark.webp',
    href: 'https://zh.wikipedia.org/wiki/%E6%AF%94%E7%89%B9%E5%B8%81',
    posterSource: 'https://bitcoin.org/en/',
    sourceLabel: '原创比特币符号插图，参考 bitcoin.org',
    sourceLabelEn: 'Original Bitcoin symbol illustration; reference: bitcoin.org'
  },
  {
    name: 'Black Myth: Wukong',
    video: {
      provider: 'bilibili',
      id: 'BV1oH4y1c7Kk',
      sourceLabel: 'bilibili.com',
      title: '《黑神话：悟空》最终预告',
      titleEn: 'Black Myth: Wukong · final trailer',
      sourceUrl: 'https://www.bilibili.com/video/BV1oH4y1c7Kk/',
      watchUrl: 'https://www.bilibili.com/video/BV1oH4y1c7Kk/',
      uploader: '黑神话 / Game Science',
      checkedAt: '2026-10-02',
      embed: false
    },
    medium: '游戏',
    mediumEn: 'Game',
    description: 'A Journey to the West reimagined.',
    image: '/images/favorites/black-myth-wukong.jpg',
    href: 'https://zh.wikipedia.org/wiki/%E9%BB%91%E7%A5%9E%E8%AF%9D%EF%BC%9A%E6%82%9F%E7%A9%BA',
    posterSource:
      'https://zh.wikipedia.org/wiki/%E9%BB%91%E7%A5%9E%E8%AF%9D%EF%BC%9A%E6%82%9F%E7%A9%BA',
    sourceLabel: '本地归档图片，作品资料见维基百科页面',
    sourceLabelEn: 'Local archive image; title details on Wikipedia'
  }
]

const copy: Record<string, [string, string, string, string]> = {
  "Made in Abyss": [
    "来自深渊",
    "即使付出代价，也想探索深渊的真相。",
    "Made in Abyss",
    "Exploring the Abyss, despite the cost."
  ],
  "相聚一刻": [
    "相聚一刻",
    "平凡日子里的相遇与守护。",
    "Maison Ikkoku",
    "Companionship in ordinary days."
  ],
  "Kimagure Orange☆Road / 橙路": [
    "橙路",
    "夏日、超能力与摇摆不定的青春。",
    "Kimagure Orange Road",
    "Summer, psychic powers and uncertain young love."
  ],
  "City Hunter / 城市猎人": [
    "城市猎人",
    "新宿的夜、神枪手与危险委托。",
    "City Hunter",
    "Shinjuku nights, a marksman and dangerous assignments."
  ],
  "Steins;Gate": [
    "命运石之门",
    "未来尚未确定，选择仍有可能。",
    "Steins;Gate",
    "An uncertain future shaped by choices."
  ],
  "Attack on Titan": [
    "进击的巨人",
    "残酷世界中的生存与选择。",
    "Attack on Titan",
    "Survival and choices in a merciless world."
  ],
  "Eureka Seven": [
    "交响诗篇",
    "自由需要主动争取。",
    "Eureka Seven",
    "Freedom that must be actively pursued."
  ],
  "Bakuman": [
    "爆漫王",
    "将想画的故事变成作品。",
    "Bakuman",
    "Turning a story you want to draw into finished work."
  ],
  "Death Note": [
    "死亡笔记",
    "正义、权力与后果之间的冲突。",
    "Death Note",
    "A conflict between justice, power and consequences."
  ],
  "天元突破红莲螺岩": [
    "天元突破红莲螺岩",
    "从地底走向自己的天空。",
    "Gurren Lagann",
    "A journey from underground to an open sky."
  ],
  "四月是你的谎言": [
    "四月是你的谎言",
    "音乐与青春的记忆。",
    "Your Lie in April",
    "Music and memories of youth."
  ],
  "The Shawshank Redemption": [
    "肖申克的救赎",
    "困境中的希望与坚持。",
    "The Shawshank Redemption",
    "Hope and persistence through hardship."
  ],
  "Living Inside Of Your Love": [
    "Living Inside Of Your Love",
    "横仓裕的爵士融合与城市流行音乐。",
    "Living Inside Of Your Love",
    "Jazz fusion and city pop by Yutaka Yokokura."
  ],
  "Bitcoin": [
    "比特币",
    "数字稀缺性、开放网络与可编程货币。",
    "Bitcoin",
    "Digital scarcity, open networks and programmable money."
  ],
  "Black Myth: Wukong": [
    "黑神话：悟空",
    "以西游故事为背景的游戏。",
    "Black Myth: Wukong",
    "A game inspired by Journey to the West."
  ]
}
export const localizeShowcase = (item: ShowcaseItem, en: boolean): ShowcaseItem => {
  const entry = copy[item.name]
  return {
    ...item,
    name: entry ? entry[en ? 2 : 0] : en ? (item.nameEn ?? item.name) : item.name,
    sourceLabel: en ? (item.sourceLabelEn ?? item.sourceLabel) : item.sourceLabel,
    description: entry
      ? entry[en ? 3 : 1]
      : en
        ? (item.descriptionEn ?? item.description)
        : item.description,
    medium: en ? (item.mediumEn ?? item.medium) : item.medium,
    video: item.video
      ? { ...item.video, title: en ? (item.video.titleEn ?? item.video.title) : item.video.title }
      : undefined,
    cta: item.spotify ? (en ? 'Listen' : '收听') : item.cta
  }
}
