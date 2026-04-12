<script setup lang="ts">
import { ref } from 'vue'
import SettingsPanel from '../components/SettingsPanel.vue'
import HeroPool from '../components/HeroPool.vue'
import RosterTable from '../components/RosterTable.vue'
import ExportCanvas from '../components/ExportCanvas.vue'
import HelpButton from '../components/HelpButton.vue'
import { useHeroes } from '../composables/useHeroes'
import { useRoster } from '../composables/useRoster'
import type { Hero } from '../types/hero'
import LogoIcon from '@/assets/icons/LES_ICON-ORANGE.png'
import { useRouter } from 'vue-router'

const router = useRouter()

const generatingImage = ref(false)
const copyingImage = ref(false)

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
  toggleMainHero,
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
  <HelpButton />
  <div class="min-h-screen p-8" style="background-color: #000; color: #e5e5e5; display: flex; flex-direction: column; align-items: center;">
    <div class="max-w-[1500px] mx-auto">
      
      <!-- Header -->
      <div class="flex items-center justify-between mb-9">
        <div class="flex items-center gap-4">
          <img :src="LogoIcon" alt="LES Logo" class="w-32 h-32 -ml-2 -mb-1" />
          <h1 class="text-5xl bold" style="color: #e5e5e5; line-height: 1.1">
            LES Roster Generator <br>for Overwatch
          </h1>
        </div>
        <button @click="router.push('/')" class="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white transition-all uppercase font-bold text-sm tracking-wider cursor-pointer" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
            Zurück zur Auswahl
        </button>
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
        @toggle-main-hero="toggleMainHero"
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

    <!-- Canvas Disclaimer -->
    <div class="w-full text-center mt-12 mb-8 px-4 border-t border-white/5 pt-8">
      <p class="text-[12px] opacity-20 leading-tight tracking-widest" style="color: #e5e5e5; font-family: 'Geom Graphic W03 Regular Italic', sans-serif; text-wrap: balance;">
        Der LES Roster Generator wird nicht von Blizzard Entertainment unterstützt und spiegelt nicht die Ansichten oder Meinungen von Blizzard Entertainment oder anderen Personen wider, die offiziell an der Herstellung oder Verwaltung von Blizzard Entertainment-Eigenschaften beteiligt sind. Overwatch und alle zugehörigen Eigenschaften sind Marken oder eingetragene Marken von Blizzard Entertainment, Inc.
      </p>
    </div>
  </div>
</template>
