export interface ShowcaseItem { name: string; description: string; image: string; href: string; cta?:string; spotify?:boolean }

export const anime: ShowcaseItem[] = [
  ['Made in Abyss', 'Even if it costs my humanity, I want to see the truth of the Abyss.', 'made-in-abyss.webp', 'https://zh.wikipedia.org/wiki/%E4%BE%86%E8%87%AA%E6%B7%B1%E6%B7%B5'],
  ['相聚一刻', '即使在最平凡的日子里，也有人在默默守护着你。', 'xiangjuyike.webp', 'https://zh.wikipedia.org/wiki/%E7%9B%B8%E8%81%9A%E4%B8%80%E5%88%BB'],
  ['Steins;Gate', 'No one knows what the future holds; its potential is infinite.', 'steins-gate.webp', 'https://zh.wikipedia.org/wiki/%E5%91%BD%E9%81%8B%E7%9F%B3%E4%B9%8B%E9%96%80'],
  ['Attack on Titan', 'The world is merciless, and it is also very beautiful.', 'attack-on-titan.webp', 'https://zh.wikipedia.org/wiki/%E9%80%B2%E6%93%8A%E7%9A%84%E5%B7%A8%E4%BA%BA'],
  ['Eureka Seven', 'Freedom is something that you need to actively acquire.', 'eureka-seven.webp', 'https://zh.wikipedia.org/wiki/%E4%BA%A4%E5%93%8D%E8%AF%97%E7%AF%87'],
  ['Bakuman', 'Work hard and make the thing you wish for your reality.', 'bakuman.webp', 'https://zh.wikipedia.org/wiki/%E7%88%B6%E6%BC%AB%E7%8E%8B'],
  ['Death Note', 'A tense study of justice, power, and consequence.', 'death-note.webp', 'https://zh.wikipedia.org/wiki/%E6%AD%BB%E4%BA%A1%E7%AC%94%E8%AE%B0'],
].map(([name, description, image, href]) => ({ name, description, image: `/images/anime/${image}`, href }))

export const favorites: ShowcaseItem[] = [
  ['Frieren', '葬送的芙莉莲 — a journey through memory and magic', 'frieren.webp', 'https://zh.wikipedia.org/wiki/%E8%91%AC%E9%80%81%E7%9A%84%E8%8A%99%E8%8E%89%E8%8E%B2'],
  ['The Shawshank Redemption', 'Hope is a good thing, maybe the best of things.', 'shawshank.webp', 'https://zh.wikipedia.org/wiki/%E8%82%96%E7%94%B3%E5%85%8B%E7%9A%84%E6%95%91%E8%B5%8E'],
  ['Music', 'A favorite track that keeps me company while I build.', 'music.webp', 'https://open.spotify.com/embed/track/54pvEYFocTlvIAQOfXSjqV?utm_source=generator&theme=0'],
  ['Bitcoin', 'Digital scarcity, open networks, and programmable money.', 'bitcoin.webp', 'https://zh.wikipedia.org/wiki/%E6%AF%94%E7%89%B9%E5%B8%81'],
  ['Black Myth: Wukong', 'A Journey to the West reimagined.', 'black-myth-wukong.jpg', 'https://zh.wikipedia.org/wiki/%E9%BB%91%E7%A5%9E%E8%AF%9D%EF%BC%9A%E6%82%9F%E7%A9%BA'],
].map(([name, description, image, href]) => ({ name, description, image: `/images/favorites/${image}`, href, cta:name==='Music'?'Listen now':'Learn more', spotify:name==='Music' }))
