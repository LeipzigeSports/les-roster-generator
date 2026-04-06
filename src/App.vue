<script setup lang="ts">
import { ref } from 'vue'
import SettingsPanel from './components/SettingsPanel.vue'
import HeroPool from './components/HeroPool.vue'
import RosterTable from './components/RosterTable.vue'
import ExportCanvas from './components/ExportCanvas.vue'
import HelpButton from './components/HelpButton.vue'
import PrivacyModal from './components/PrivacyModal.vue'
import ToastContainer from './components/ToastContainer.vue'
import { useHeroes } from './composables/useHeroes'
import { useRoster } from './composables/useRoster'
import type { Hero } from './types/hero'
import LogoIcon from '@/assets/icons/LES_ICON-ORANGE.png'

const generatingImage = ref(false)
const copyingImage = ref(false)
const showPrivacy = ref(false)

const { loading, heroesByRole } = useHeroes()
const {
  teamName,
  date,
  isTransparentBg,
  isClassicLayout,
  roles,
  players,
  addPlayer,
  removePlayer,
  movePlayer,
  dropHero,
  removeHero,
  resetRoster
} = useRoster()

const draggedHero = ref<Hero | null>(null)
const exportCanvasRef = ref<InstanceType<typeof ExportCanvas> | null>(null)

const startDrag = (hero: Hero): void => {
  draggedHero.value = hero
}

const handleDrop = (playerIndex: number, role: string): void => {
  if (draggedHero.value) {
    dropHero(playerIndex, role, draggedHero.value)
    draggedHero.value = null
  }
}

const validateRoster = (): boolean => {
  let warnings: string[] = []
  
  if (teamName.value === 'Team Name' || teamName.value.trim() === '') {
    warnings.push('- Team Name ist noch auf dem Standardwert oder leer.')
  }
  
  const playersWithNoHeroes = players.value.some(p => {
    return Object.values(p.heroes).every(hList => hList.length === 0)
  })
  
  if (playersWithNoHeroes) {
    warnings.push('- Mindestens ein Spieler hat noch keine Helden zugewiesen.')
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
  <ToastContainer />
  <HelpButton />
  <PrivacyModal :show="showPrivacy" @close="showPrivacy = false" />
  <div class="min-h-screen p-8" style="background-color: #000; color: #e5e5e5;">
    <div class="max-w-[1500px] mx-auto">
      <div class="flex items-center gap-4 mb-9">
        <img :src="LogoIcon" alt="LES Logo" class="w-32 h-32 -ml-2 -mb-1" />
        <h1 class="text-5xl bold" style="color: #e5e5e5; line-height: 1.1">
          LES Roster Generator <br>for Overwatch
        </h1>
      </div>

      <SettingsPanel v-model:teamName="teamName" v-model:date="date" v-model:isTransparentBg="isTransparentBg" v-model:isClassicLayout="isClassicLayout" />

      <HeroPool
        :heroes-by-role="heroesByRole"
        :loading="loading"
        @start-drag="startDrag"
      />

      <RosterTable
        :players="players"
        :roles="roles"
        :heroes-by-role="heroesByRole"
        @add-player="addPlayer"
        @remove-player="removePlayer"
        @move-player="movePlayer"
        @reset-roster="handleReset"
        @drop-hero="handleDrop"
        @add-hero-obj="dropHero"
        @remove-hero="removeHero"
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
            <svg
              class="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"
              viewBox="0 0 24 24"
            ></svg>
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
            <svg
              class="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full"
              viewBox="0 0 24 24"
            ></svg>
            <h3 class="bold">Kopieren...</h3>
          </span>
        </button>
      </div>

    </div>


    <ExportCanvas
      ref="exportCanvasRef"
      :team-name="teamName"
      :date="date"
      :roles="roles"
      :players="players"
      :is-transparent-bg="isTransparentBg"
      :is-classic-layout="isClassicLayout"
    />

    <div class="flex flex-col items-center mt-8 mb-8">
      <p class="text-lg" style="color: #e5e5e5; opacity: 0.3;">Overwatch und alle zugehörigen Grafiken sind Eigentum von Blizzard Entertainment. Keine offizielle Partnerschaft.</p>
      <div class="flex gap-4 mt-2 text-sm font-bold uppercase" style="color: #ff6700; opacity: 0.67;">
        <a href="https://leipzigesports.de/impressum" target="_blank" class="hover:underline cursor-pointer">Impressum</a>
        <span style="opacity: 0.3; color: #e5e5e5; font-weight: normal;">|</span>
        <button @click="showPrivacy = true" class="hover:underline cursor-pointer uppercase" style="background:none; border:none; padding:0; color: inherit; font-size:inherit; font-weight: inherit;">Datenschutz</button>
      </div>
    </div>
  </div>


</template>
