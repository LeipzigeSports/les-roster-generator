<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, watch, nextTick} from 'vue'
import * as domtoimage from 'dom-to-image-more'
import { useToast } from '../composables/useToast'
import type {Player} from '../types/hero'
import LogoIcon from '@/assets/icons/LES_ICON-ORANGE.png'
import BotIcon from '@/assets/icons/roles/BotIcon.svg'
import JungleIcon from '@/assets/icons/roles/JungleIcon.svg'
import MidIcon from '@/assets/icons/roles/MidIcon.svg'
import SupportIconLol from '@/assets/icons/roles/SupportIcon.svg'
import TopIcon from '@/assets/icons/roles/TopIcon.svg'

const props = defineProps<{
  teamName: string
  date: string
  roles: string[]
  players: Player[]
  isTransparentBg: boolean
}>()

const { addToast } = useToast()

const canvasRef = ref<HTMLDivElement | null>(null)

const getProxyUrl = (url: string) => {
  if (!url) return ''
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
}

const prepareClone = async (): Promise<HTMLElement | null> => {
  if (!canvasRef.value) {
    addToast('Canvas nicht gefunden', 'error')
    return null
  }

  // Brief delay to ensure proxy images are rendered
  await new Promise(resolve => setTimeout(resolve, 300))

  const clone = canvasRef.value.cloneNode(true) as HTMLElement
  const renderScale = 2560 / 1920
  clone.style.transform = `scale(${renderScale})`
  clone.style.transformOrigin = 'top left'
  clone.style.position = 'absolute'
  clone.style.left = '-9999px'

  const allElements = clone.querySelectorAll('*')
  allElements.forEach(el => {
    const htmlEl = el as HTMLElement
    if (htmlEl.classList.contains('important-border') || htmlEl.classList.contains('role-column')) return
    htmlEl.style.border = 'none'
    htmlEl.style.outline = 'none'
    htmlEl.style.boxShadow = 'none'
    htmlEl.style.whiteSpace = 'nowrap'
  })

  document.body.appendChild(clone)
  return clone
}

const downloadImage = async (): Promise<void> => {
  try {
    const clone = await prepareClone()
    if (!clone) return

    const renderScale = 2560 / 1920
    const targetHeight = Math.max(1080, clone.scrollHeight)
    const dataUrl = await domtoimage.toPng(clone, {
      width: 1920 * renderScale,
      height: targetHeight * renderScale,
      cacheBust: true
    })

    document.body.removeChild(clone)

    const link = document.createElement('a')
    link.download = `${props.teamName.replace(/\s/g, '_')}_lol_roster.png`
    link.href = dataUrl
    link.click()
    
    addToast('LoL-Grafik erfolgreich gespeichert!', 'success')
  } catch (error) {
    console.error('Error generating image:', error)
    addToast('Fehler beim Speichern. Bitte lade die Seite neu.', 'error')
  }
}

const copyImage = async (): Promise<void> => {
  try {
    const clone = await prepareClone()
    if (!clone) return

    const renderScale = 2560 / 1920
    const targetHeight = Math.max(1080, clone.scrollHeight)
    const blob = await domtoimage.toBlob(clone, {
      width: 1920 * renderScale,
      height: targetHeight * renderScale,
      cacheBust: true
    })

    document.body.removeChild(clone)

    if (blob) {
      await navigator.clipboard.write([
        new window.ClipboardItem({ 'image/png': blob })
      ])
      addToast('LoL-Grafik erfolgreich kopiert!', 'success')
    }
  } catch (error) {
    console.error('Error copying image:', error)
    addToast('Fehler beim Kopieren! Fehlende Berechtigungen?', 'error')
  }
}

const contentRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const internalHeight = ref(1080)
const scale = ref(1)

const columnConfig = props.roles.map(role => ({
    id: role,
    width: 'auto',
    flex: '1'
}))

const updateDimensions = () => {
  if (containerRef.value && contentRef.value) {
    const parentWidth = containerRef.value.offsetWidth
    scale.value = Math.min(parentWidth / 1920, 1)
    internalHeight.value = Math.max(1080, contentRef.value.offsetHeight)
  }
}

watch(() => props.players, () => {
  nextTick(updateDimensions)
}, { deep: true })

onMounted(() => {
  setTimeout(updateDimensions, 100)
  window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDimensions)
})

defineExpose({
  downloadImage,
  copyImage
})
</script>

<template>
  <div ref="containerRef" class="w-full overflow-hidden mt-12 mb-8 rounded-lg shadow-2xl border border-white/5 bg-black/20 flex justify-center" :style="{ height: `${internalHeight * scale}px`, maxWidth: 'fit-content', justifySelf: 'center' }">
    <div
      ref="canvasRef"
      class="origin-top shrink-0 overflow-hidden"
      :style="`width: 1920px; min-height: 1080px; height: ${internalHeight}px; background: ${isTransparentBg ? 'transparent' : 'linear-gradient(180deg, #151515 0%, #ff6700 400%)'}; transform: scale(${scale}); border: none; outline: none; transition: height 0.3s ease;`"
    >
      <div ref="contentRef" class="w-full flex flex-col pb-[40px]">
        <!-- Header -->
        <div class="pt-16 px-12" style="border: none;">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <img :src="LogoIcon" alt="logo" class="w-44 h-44 mr-4"/>
              <div class="border-r h-32 ml-9 mr-13 important-border"
                   style="border-color: #ff6700"></div>
              <div>
                  <h2 class="text-6xl bold wr" style="-webkit-text-stroke: 1.5px #e5e5e5; color: transparent; padding-left: 10px; margin-top: -4px;">
                    LES
                  </h2>
                  <h2 class="text-6xl bold wr" style="color: #e5e5e5;">
                    {{ teamName.toUpperCase() }}
                  </h2>
              </div>
            </div>
            <div class="text-2xl flex self-end mb-3 text-right" style="line-height: 1.1;color: #e5e5e5;font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
              Stand:<br>{{ date ? date.split('-').reverse().join('.') : '' }}
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="px-12 pt-12 flex flex-col" style="border: none;">
          <!-- Column Headers -->
          <div class="flex mb-8" style="padding-left: 372px; border: none; justify-content: space-between;">
            <div v-for="role in roles" :key="role"
                 class="text-center flex items-end justify-center role-header"
                 :style="{ color: '#e5e5e5', flex: 'none', width: '224px' }">
                <div
                class="text-3xl flex justify-center gap-4 text-wrap flex-nowrap items-center w-full">
                
                <!-- Rollen SVG Icons -->
                <img v-if="role.toUpperCase() === 'TOP'" :src="TopIcon" alt="Top" class="h-14 skew-6">
                <img v-else-if="role.toUpperCase() === 'JUNGLE'" :src="JungleIcon" alt="Jungle" class="h-14 skew-6">
                <img v-else-if="role.toUpperCase() === 'MID'" :src="MidIcon" alt="Mid" class="h-14 skew-6">
                <img v-else-if="role.toUpperCase() === 'BOT'" :src="BotIcon" alt="Bot" class="h-14 skew-6">
                <img v-else-if="role.toUpperCase() === 'SUPPORT'" :src="SupportIconLol" alt="Support" class="h-14 skew-6">
                
                <!-- Rollen Name -->
                <div class="role-name flex flex-col items-start">
                  <div style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; margin-top: -6px; letter-spacing: 0px; text-transform: uppercase; white-space: nowrap;">
                    {{ role }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Player Rows -->
          <div v-for="(player, pIndex) in players" :key="pIndex" class="flex items-center mb-8">
            <div class="flex flex-col justify-center" style="width: 340px; color: #e5e5e5; flex-shrink: 0;">
              <div class="text-3xl leading-tight" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; letter-spacing: -0.25px;">{{ player.name.toUpperCase() }}</div>
              <div v-if="player.status" class="text-2xl -mt-2" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; color: transparent; -webkit-text-stroke: 1px #e5e5e5;">
                {{ player.status.toUpperCase() }}
              </div>
            </div>

            <div style="flex: 1; display: flex; justify-content: space-between; margin-left: 32px;">
              <template v-for="role in roles" :key="role">
                <div class="flex justify-center items-center" style="width: 224px;">
                  <div v-if="player.heroes[role as string] && player.heroes[role as string].length > 0" class="role-column flex justify-center items-center" 
                       style="flex: none; width: 224px; position: relative;">
                    
                      <div class="flex gap-1 shrink-0">
                          <img 
                            v-for="(hero, hIndex) in player.heroes[role as string]" 
                            :key="hIndex" :src="getProxyUrl(hero.portrait)" 
                            :alt="hero.name" 
                            crossorigin="anonymous" 
                            class="important-border" 
                            style="width: 68px; height: 68px; border-radius: 8px; border: 2px solid rgba(255, 255, 255, 0.75);" 
                            :style="{ opacity: (player.mainHeroKeys && player.mainHeroKeys.length > 0) 
                                ? (player.mainHeroKeys.includes(hero.key) ? '1' : '0.5') 
                                : '1' 
                            }"
                          />
                      </div>
                  </div>

                  <!-- Placeholder for empty roles matching Overwatch styling -->
                  <div v-else class="h-[2px] rounded w-full" style="background-color: rgba(255, 255, 255, 0.075);"></div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Canvas Disclaimer -->
        <div class="w-full text-center mt-12 mb-4 px-12 opacity-20">
          <p class="text-[11px] leading-tight tracking-wider" style="color: #e5e5e5; font-family: 'Geom Graphic W03 Regular Italic', sans-serif; text-wrap: balance;">
            Der LES Roster Generator wird nicht von Riot Games unterstützt und spiegelt nicht die Ansichten oder Meinungen von Riot Games oder anderen Personen wider, die offiziell an der Herstellung oder Verwaltung von Riot Games-Eigenschaften beteiligt sind. Riot Games und alle zugehörigen Eigenschaften sind Marken oder eingetragene Marken von Riot Games, Inc.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
