<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import R6SettingsPanel from '../components/R6SettingsPanel.vue'
import R6OperatorPool from '../components/R6OperatorPool.vue'
import R6RosterTable from '../components/R6RosterTable.vue'
import R6ExportCanvas from '../components/R6ExportCanvas.vue'
import HelpButton from '../components/HelpButton.vue'
import SaveManagerModal from '../components/SaveManagerModal.vue'
import { useR6Operators } from '../composables/useR6Operators'
import { useR6Roster } from '../composables/useR6Roster'
import type { R6Operator } from '../types/r6operator'
import LogoIcon from '@/assets/icons/LES_ICON-ORANGE.png'
import R6Logo from '@/assets/icons/R6_LOGO.svg'
import { useToast } from '../composables/useToast'

const router = useRouter()
const { addToast } = useToast()

const generatingImage = ref(false)
const copyingImage = ref(false)
const showSaveManager = ref(false)

const { loading, operators } = useR6Operators()
const {
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
} = useR6Roster()

const draggedOperator = ref<R6Operator | null>(null)
const exportCanvasRef = ref<InstanceType<typeof R6ExportCanvas> | null>(null)

const startDrag = (operator: R6Operator): void => {
  draggedOperator.value = operator
}

const handleDrop = (playerIndex: number): void => {
  if (draggedOperator.value) {
    addOperator(playerIndex, draggedOperator.value)
    draggedOperator.value = null
  }
}

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const dataParam = urlParams.get('data')
  if (dataParam) {
    try {
      const decoded = decodeURIComponent(escape(window.atob(dataParam)))
      importDataFromString(decoded)
      addToast('Team aus Link geladen!', 'success')
      window.history.replaceState({}, document.title, window.location.pathname)
    } catch (e) {
      console.error(e)
      addToast('Fehler beim Laden des Links', 'error')
    }
  }
})

const handleShare = () => {
  const link = getShareLink()
  navigator.clipboard.writeText(link)
    .then(() => addToast('Link in die Zwischenablage kopiert!', 'success'))
    .catch(() => addToast('Fehler beim Kopieren des Links', 'error'))
}

const handleImport = async (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    try {
      await importData(target.files[0]!)
      addToast('Daten erfolgreich importiert!', 'success')
    } catch (e) {
      addToast('Fehler beim Importieren der Daten.', 'error')
    }
    target.value = ''
  }
}

const handleSaveTeam = (name: string) => {
  saveTeam(name)
  addToast(`Team "${name}" gespeichert!`, 'success')
}

const handleLoadTeam = (id: string) => {
  loadTeam(id)
  showSaveManager.value = false
  addToast('Team geladen!', 'success')
}

const handleDeleteTeam = (id: string) => {
  if (window.confirm('Möchtest du diesen Speicherstand wirklich löschen?')) {
    deleteTeam(id)
    addToast('Speicherstand gelöscht.', 'success')
  }
}

const validateRoster = (): boolean => {
  let warnings: string[] = []
  if (teamName.value === 'Team Name' || teamName.value.trim() === '') {
    warnings.push('- Team Name ist noch auf dem Standardwert oder leer.')
  }
  const playersWithNoOps = players.value.some(p => p.operators.length === 0)
  if (playersWithNoOps) {
    warnings.push('- Mindestens ein Spieler hat noch keine Operator zugewiesen.')
  }
  if (warnings.length > 0) {
    return window.confirm(`Achtung:\n${warnings.join('\n')}\n\nWillst du trotzdem fortfahren?`)
  }
  return true
}

const downloadImage = async (): Promise<void> => {
  if (!validateRoster()) return
  generatingImage.value = true
  if (exportCanvasRef.value) {
    await exportCanvasRef.value.downloadImage()
  }
  generatingImage.value = false
}

const copyImage = async (): Promise<void> => {
  if (!validateRoster()) return
  copyingImage.value = true
  if (exportCanvasRef.value) {
    await exportCanvasRef.value.copyImage()
  }
  copyingImage.value = false
}

const handleReset = () => {
  if (window.confirm('Möchtest du das aktuelle Roster wirklich zurücksetzen? (Alle Daten werden gelöscht)')) {
    resetRoster()
  }
}
</script>

<template>
  <HelpButton />
  <div class="min-h-screen p-8" style="background-color: #000; color: #e5e5e5; display: flex; flex-direction: column; align-items: center;">
    <div class="max-w-[1500px] mx-auto w-full">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-9">
        <div class="flex items-center gap-4">
          <img :src="LogoIcon" alt="LES Logo" class="w-32 h-32 -ml-2 -mb-1" />
          <h1 class="text-5xl bold" style="color: #e5e5e5; line-height: 1.1">
            LES Roster Generator <br>for Rainbow Six Siege
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button @click="router.push('/')" class="p-4 ml-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white transition-all uppercase font-bold text-sm tracking-wider cursor-pointer" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
              Zurück zur Auswahl
          </button>
        </div>
      </div>

      <R6SettingsPanel 
        v-model:teamName="teamName" 
        v-model:date="date" 
        v-model:isTransparentBg="isTransparentBg" 
        @manage-data="showSaveManager = true"
        @share="handleShare"
        @reset="handleReset"
      />

      <R6OperatorPool
        :loading="loading"
        @start-drag="startDrag"
      />

      <R6RosterTable
        :players="players"
        :operators="operators"
        @add-player="addPlayer"
        @remove-player="removePlayer"
        @move-player="movePlayer"
        @drop-operator="handleDrop"
        @add-operator-obj="addOperator"
        @remove-operator="removeOperator"
        @toggle-main-operator="toggleMainOperator"
      />

      <div class="flex justify-center mb-8 gap-6">
        <button
          @click="downloadImage"
          class="flex items-center gap-2 pl-7 pr-8 py-4 rounded text-lg justify-center cursor-pointer"
          style="min-width: 250px; min-height: 60px;"
          :disabled="generatingImage || copyingImage"
        >
          <svg v-if="!generatingImage" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <h3 class="bold" v-if="!generatingImage">Grafik speichern</h3>
          <span v-if="generatingImage" class="flex gap-2 items-center">
            <svg class="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
            <h3 class="bold">Speichern...</h3>
          </span>
        </button>
        
        <button
          @click="copyImage"
          class="flex items-center gap-2 pl-7 pr-8 py-4 rounded text-lg justify-center cursor-pointer"
          style="min-width: 250px; min-height: 60px;"
          :disabled="generatingImage || copyingImage"
        >
          <svg v-if="!copyingImage" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <h3 class="bold" v-if="!copyingImage">Grafik kopieren</h3>
          <span v-if="copyingImage" class="flex gap-2 items-center">
            <svg class="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" viewBox="0 0 24 24"></svg>
            <h3 class="bold">Kopieren...</h3>
          </span>
        </button>
      </div>

    </div>

    <R6ExportCanvas
      ref="exportCanvasRef"
      :team-name="teamName"
      :date="date"
      :players="players"
      :is-transparent-bg="isTransparentBg"
    />

    <div class="w-full text-center mt-12 mb-8 px-4 border-t border-white/5 pt-8">
      <p class="text-[12px] opacity-20 leading-tight tracking-widest" style="color: #e5e5e5; font-family: 'Geom Graphic W03 Regular Italic', sans-serif; text-wrap: balance;">
        Tom Clancy's Rainbow Six Siege ist eine Marke von Ubisoft Entertainment. Alle Operator-Icons und Assets sind Eigentum ihrer jeweiligen Inhaber. Dieses Tool steht in keiner Verbindung zu Ubisoft.
      </p>
    </div>

    <SaveManagerModal 
      :show="showSaveManager" 
      :saved-teams="savedTeams" 
      :current-team-name="teamName"
      @close="showSaveManager = false"
      @save="handleSaveTeam"
      @load="handleLoadTeam"
      @delete="handleDeleteTeam"
      @export="exportData"
      @import="handleImport"
      @download-image="downloadImage"
      @copy-image="copyImage"
    />
  </div>
</template>
