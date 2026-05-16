import { ref, watch, type Ref } from 'vue'
import type { R6Player, R6Operator } from '../types/r6operator'

export interface SavedTeam {
  id: string;
  name: string;
  dateSaved: number;
  data: any;
}

interface UseR6RosterReturn {
  teamName: Ref<string>
  date: Ref<string>
  isTransparentBg: Ref<boolean>
  players: Ref<R6Player[]>
  addPlayer: () => void
  removePlayer: (index: number) => void
  movePlayer: (fromIndex: number, toIndex: number) => void
  addOperator: (playerIndex: number, operator: R6Operator) => void
  removeOperator: (playerIndex: number, opIndex: number) => void
  toggleMainOperator: (playerIndex: number, opId: string) => void
  resetRoster: () => void
  exportData: () => void
  importData: (file: File) => Promise<void>
  importDataFromString: (jsonString: string) => void
  getShareLink: () => string
  savedTeams: Ref<SavedTeam[]>
  saveTeam: (name: string) => void
  loadTeam: (id: string) => void
  deleteTeam: (id: string) => void
}

export function useR6Roster(): UseR6RosterReturn {
  const CACHE_KEY = 'les_r6_roster_data'

  const savedData = localStorage.getItem(CACHE_KEY)
  const initialData = savedData ? JSON.parse(savedData) : null

  const today = new Date()
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const teamName = ref<string>(initialData?.teamName || 'Team Name')
  const date = ref<string>(defaultDate)
  const isTransparentBg = ref<boolean>(initialData?.isTransparentBg || false)
  
  const defaultPlayers: R6Player[] = [
    { id: 'p1', name: 'Spieler1', status: '', operators: [] },
    { id: 'p2', name: 'Spieler2', status: '', operators: [] },
    { id: 'p3', name: 'Spieler3', status: '', operators: [] },
    { id: 'p4', name: 'Spieler4', status: '', operators: [] },
    { id: 'p5', name: 'Spieler5', status: '', operators: [] }
  ]

  const loadedPlayers: R6Player[] = initialData?.players || JSON.parse(JSON.stringify(defaultPlayers))
  loadedPlayers.forEach(p => {
    if (!p.id) p.id = Math.random().toString(36).substring(2, 9)
  })

  const players = ref<R6Player[]>(loadedPlayers)

  const savedTeams = ref<SavedTeam[]>([])
  const loadedSavedTeams = localStorage.getItem(`${CACHE_KEY}_saved_teams`)
  if (loadedSavedTeams) {
    savedTeams.value = JSON.parse(loadedSavedTeams)
  }

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
      operators: []
    })
  }

  const removePlayer = (index: number): void => {
    players.value.splice(index, 1)
  }

  const movePlayer = (fromIndex: number, toIndex: number): void => {
    const [player] = players.value.splice(fromIndex, 1)
    players.value.splice(toIndex, 0, player!)
  }

  const addOperator = (playerIndex: number, operator: R6Operator): void => {
    if (!operator || !players.value[playerIndex]) return
    if (players.value[playerIndex]!.operators.length < 4) {
      if (!players.value[playerIndex]!.operators.some(op => op.id === operator.id)) {
        players.value[playerIndex]!.operators.push(operator)
      }
    }
  }

  const removeOperator = (playerIndex: number, opIndex: number): void => {
    if (players.value[playerIndex]) {
      const op = players.value[playerIndex]!.operators[opIndex]
      if (op && (players.value[playerIndex] as any).mainOpKeys) {
        (players.value[playerIndex] as any).mainOpKeys = (players.value[playerIndex] as any).mainOpKeys.filter((k: string) => k !== op.id)
      }
      players.value[playerIndex]!.operators.splice(opIndex, 1)
    }
  }

  const toggleMainOperator = (playerIndex: number, opId: string) => {
    const player = players.value[playerIndex]
    if (!player) return
    
    const currentKeys = player.mainOpKeys || []
    if (currentKeys.includes(opId)) {
      player.mainOpKeys = currentKeys.filter(k => k !== opId)
    } else {
      player.mainOpKeys = [...currentKeys, opId]
    }
  }

  const exportData = () => {
    const data = {
      teamName: teamName.value,
      date: date.value,
      isTransparentBg: isTransparentBg.value,
      players: players.value,
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data))
    const downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${teamName.value.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_r6_roster.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const importDataFromString = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString)
      if (data.teamName !== undefined) teamName.value = data.teamName
      if (data.date !== undefined) date.value = data.date
      if (data.isTransparentBg !== undefined) isTransparentBg.value = data.isTransparentBg
      if (data.players !== undefined) players.value = data.players
    } catch (e) {
      console.error("Fehler beim Importieren der Daten:", e)
      throw new Error("Ungültige Roster-Daten")
    }
  }

  const importData = async (file: File) => {
    try {
      const text = await file.text()
      importDataFromString(text)
    } catch (e) {
      console.error("Fehler beim Lesen der Datei:", e)
      throw new Error("Dateifehler")
    }
  }

  const getShareLink = (): string => {
    const data = {
      teamName: teamName.value,
      date: date.value,
      isTransparentBg: isTransparentBg.value,
      players: players.value,
    }
    const jsonStr = JSON.stringify(data)
    const base64 = window.btoa(unescape(encodeURIComponent(jsonStr)))
    return `${window.location.origin}${window.location.pathname}?data=${base64}`
  }

  const saveTeam = (name: string) => {
    const data = {
      teamName: teamName.value,
      date: date.value,
      isTransparentBg: isTransparentBg.value,
      players: players.value,
    }
    const newSave: SavedTeam = {
      id: Date.now().toString(),
      name,
      dateSaved: Date.now(),
      data
    }
    savedTeams.value.push(newSave)
    localStorage.setItem(`${CACHE_KEY}_saved_teams`, JSON.stringify(savedTeams.value))
  }

  const loadTeam = (id: string) => {
    const save = savedTeams.value.find(s => s.id === id)
    if (!save) return
    const data = save.data
    if (data.teamName !== undefined) teamName.value = data.teamName
    if (data.date !== undefined) date.value = data.date
    if (data.isTransparentBg !== undefined) isTransparentBg.value = data.isTransparentBg
    if (data.players !== undefined) players.value = data.players
  }

  const deleteTeam = (id: string) => {
    savedTeams.value = savedTeams.value.filter(s => s.id !== id)
    localStorage.setItem(`${CACHE_KEY}_saved_teams`, JSON.stringify(savedTeams.value))
  }

  return {
    teamName,
    date,
    isTransparentBg,
    players,
    addPlayer,
    removePlayer,
    movePlayer,
    addOperator,
    removeOperator,
    toggleMainOperator,
    resetRoster,
    exportData,
    importData,
    importDataFromString,
    getShareLink,
    savedTeams,
    saveTeam,
    loadTeam,
    deleteTeam
  }
}
