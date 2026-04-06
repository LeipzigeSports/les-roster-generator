import { ref, watch, type Ref } from 'vue'
import type { Player, Hero } from '../types/hero'

interface UseRosterReturn {
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
  resetRoster: () => void
  isClassicLayout: Ref<boolean>
}

export function useRoster(): UseRosterReturn {
  const CACHE_KEY = 'les_roster_data'

  // Load from localStorage if available
  const savedData = localStorage.getItem(CACHE_KEY)
  const initialData = savedData ? JSON.parse(savedData) : null

  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const teamName = ref<string>(initialData?.teamName || 'Team Name')
  const date = ref<string>(defaultDate)
  const isTransparentBg = ref<boolean>(initialData?.isTransparentBg || false)
  const isClassicLayout = ref<boolean>(initialData?.isClassicLayout || false)
  
  const roles = ref<string[]>([
    'TANK',
    'HITSCAN DPS',
    'HYBRID DPS',
    'FLEX DPS',
    'MAIN SUPPORT',
    'HYBRID SUPPORT',
    'FLEX SUPPORT'
  ])

  const defaultPlayers: Player[] = [
    { id: 'p1', name: 'Spieler1', status: '', heroes: {} },
    { id: 'p2', name: 'Spieler2', status: '', heroes: {} },
    { id: 'p3', name: 'Spieler3', status: '', heroes: {} },
    { id: 'p4', name: 'Spieler4', status: '', heroes: {} },
    { id: 'p5', name: 'Spieler5', status: '', heroes: {} }
  ]

  const loadedPlayers: Player[] = initialData?.players || JSON.parse(JSON.stringify(defaultPlayers))
  // Ensure every player has a unique id (for existing saves without IDs)
  loadedPlayers.forEach(p => {
    if (!p.id) p.id = Math.random().toString(36).substring(2, 9)
  })

  const players = ref<Player[]>(loadedPlayers)

  // Auto-save watch

  watch(
    [teamName, date, isTransparentBg, isClassicLayout, players],
    () => {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          teamName: teamName.value,
          date: date.value,
          isTransparentBg: isTransparentBg.value,
          isClassicLayout: isClassicLayout.value,
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
    if (!role.includes("HYBRID")) {
      if (players.value[playerIndex]!.heroes[role].length < 3) {
        players.value[playerIndex]!.heroes[role].push(hero)
      }
    } else {
      if (players.value[playerIndex]!.heroes[role].length < 2) {
        players.value[playerIndex]!.heroes[role].push(hero)
      }
    }
  }

  const removeHero = (playerIndex: number, role: string, heroIndex: number): void => {
    players.value[playerIndex]!.heroes[role]!.splice(heroIndex, 1)
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
    resetRoster,
    isClassicLayout
  }
}
