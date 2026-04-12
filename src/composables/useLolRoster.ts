import { ref, watch, type Ref } from 'vue'
import type { Hero, Player } from '../types/hero'

interface UseLolRosterReturn {
  teamName: Ref<string>
  date: Ref<string>
  isTransparentBg: Ref<boolean>
  roles: Ref<string[]>
  players: Ref<Player[]>
  addPlayer: () => void
  removePlayer: (index: number) => void
  movePlayer: (fromIndex: number, toIndex: number) => void
  dropHero: (playerIndex: number, role: string, hero: Hero) => void
  removeHero: (playerIndex: number, role: string, heroIndex: number) => void
  toggleMainHero: (playerIndex: number, heroKey: string) => void
  resetRoster: () => void
}

export function useLolRoster(): UseLolRosterReturn {
  const CACHE_KEY = 'les_roster_lol_data'

  // Load from localStorage if available
  const savedData = localStorage.getItem(CACHE_KEY)
  const initialData = savedData ? JSON.parse(savedData) : null

  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const teamName = ref<string>(initialData?.teamName || 'Team Name')
  const date = ref<string>(defaultDate)
  const isTransparentBg = ref<boolean>(initialData?.isTransparentBg || false)
  
  const roles = ref<string[]>([
    'TOP',
    'JUNGLE',
    'MID',
    'BOT',
    'SUPPORT'
  ])

  const defaultPlayers: Player[] = [
    { id: 'p1', name: 'Spieler1', status: '', heroes: {} },
    { id: 'p2', name: 'Spieler2', status: '', heroes: {} },
    { id: 'p3', name: 'Spieler3', status: '', heroes: {} },
    { id: 'p4', name: 'Spieler4', status: '', heroes: {} },
    { id: 'p5', name: 'Spieler5', status: '', heroes: {} }
  ]

  const loadedPlayers: Player[] = initialData?.players || JSON.parse(JSON.stringify(defaultPlayers))
  loadedPlayers.forEach(p => {
    if (!p.id) p.id = Math.random().toString(36).substring(2, 9)
  })

  const players = ref<Player[]>(loadedPlayers)

  watch(
    [teamName, date, isTransparentBg, players],
    () => {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          teamName: teamName.value,
          date: date.value,
          isTransparentBg: isTransparentBg.value,
          players: players.value,
        })
      )
    },
    { deep: true }
  )

  const resetRoster = () => {
    localStorage.removeItem(CACHE_KEY)
    teamName.value = 'Team Name'
    date.value = defaultDate
    players.value = JSON.parse(JSON.stringify(defaultPlayers))
  }

  const addPlayer = (): void => {
    players.value.push({
      id: Math.random().toString(36).substring(2, 9),
      name: `Spieler${players.value.length + 1}`,
      status: '',
      heroes: {}
    })
  }

  const removePlayer = (index: number): void => {
    players.value.splice(index, 1)
  }

  const movePlayer = (fromIndex: number, toIndex: number): void => {
    const [player] = players.value.splice(fromIndex, 1)
    players.value.splice(toIndex, 0, player!)
  }

  const dropHero = (playerIndex: number, role: string, hero: Hero): void => {
    if (!hero) return

    if (!players.value[playerIndex]!.heroes[role]) {
      players.value[playerIndex]!.heroes[role] = []
    }

    if (players.value[playerIndex]!.heroes[role]!.some(h => h.key === hero.key)) {
      return
    }

    // High level requirement check: 3 champions per role
    if (players.value[playerIndex]!.heroes[role].length < 3) {
      players.value[playerIndex]!.heroes[role].push(hero)
    }
  }

  const removeHero = (playerIndex: number, role: string, heroIndex: number): void => {
    players.value[playerIndex]!.heroes[role]!.splice(heroIndex, 1)
  }

  const toggleMainHero = (playerIndex: number, heroKey: string): void => {
    const player = players.value[playerIndex]
    if (!player) return

    if (!player.mainHeroKeys) {
      player.mainHeroKeys = []
    }

    const index = player.mainHeroKeys.indexOf(heroKey)
    if (index > -1) {
      player.mainHeroKeys.splice(index, 1)
    } else {
      player.mainHeroKeys.push(heroKey)
    }
  }

  return {
    teamName,
    date,
    isTransparentBg,
    roles,
    players,
    addPlayer,
    removePlayer,
    movePlayer,
    dropHero,
    removeHero,
    toggleMainHero,
    resetRoster
  }
}
