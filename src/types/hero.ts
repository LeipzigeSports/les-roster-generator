export interface Hero {
  key: string
  name: string
  portrait: string
  role: string
}

export interface HeroesByRole {
  tank: Hero[]
  damage: Hero[]
  support: Hero[]
}

export interface Player {
  id: string
  name: string
  status?: string
  customStatus?: boolean
  heroes: Record<string, Hero[]>
  mainHeroKeys?: string[]
}
