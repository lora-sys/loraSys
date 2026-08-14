export const projectCategories = ['Featured', 'Open Source', 'AI Agents', 'Tools'] as const

export type ProjectCategory = (typeof projectCategories)[number]

const categoriesByProject: Record<string, ProjectCategory[]> = {
  'Newtube Clone': ['Featured', 'Open Source', 'Tools'],
  'Daily RSS': ['Featured', 'Open Source', 'Tools'],
  TradingOS: ['Featured', 'Open Source', 'AI Agents', 'Tools'],
  'AI Company OS': ['Featured', 'Open Source', 'AI Agents', 'Tools'],
  'Nanochat Study': ['Open Source'],
  Emergence: ['Open Source', 'AI Agents'],
  'Tarot Prediction DApp': ['Open Source'],
  MOSS: ['Open Source', 'AI Agents', 'Tools'],
  'Second Brain': ['Open Source', 'Tools'],
  MonadMon: ['Open Source'],
  'Mianshiya Next': ['Open Source', 'Tools']
}

export const getProjectCategories = (title: string) => categoriesByProject[title] ?? ['Open Source']
