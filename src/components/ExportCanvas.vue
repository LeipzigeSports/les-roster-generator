<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, watch, nextTick} from 'vue'
import * as domtoimage from 'dom-to-image-more'
import { useToast } from '../composables/useToast'
import type {Player} from '../types/hero'
import LogoIcon from '@/assets/icons/LES_ICON-ORANGE.png'
import TankIcon from '@/assets/icons/roles/TankIcon.png'
import SupportIcon from '@/assets/icons/roles/SupportIcon.png'
import OffenseIcon from '@/assets/icons/roles/OffenseIcon.png'

const props = defineProps<{
  teamName: string
  date: string
  roles: string[]
  players: Player[]
  isTransparentBg: boolean
  isClassicLayout: boolean
}>()

const { addToast } = useToast()

const canvasRef = ref<HTMLDivElement | null>(null)

const getProxyUrl = (url: string) => {
  if (!url) return ''
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`
}

function getRoleRangeWithHeroes(player: Player, roles: string[]): string[] {
  const filledRoles = roles.filter(role => (player.heroes[role as string]?.length || 0) > 0)
  if (filledRoles.length === 0) return []

  const firstRole = filledRoles[0]!
  const lastRole = filledRoles[filledRoles.length - 1]!
  const startIndex = roles.indexOf(firstRole)
  const endIndex = roles.indexOf(lastRole)

  return roles.slice(startIndex, endIndex + 1)
}

const playerRoleRanges = computed(() =>
  props.players.map(player => {

    const filledRoles = props.roles.filter(role => (player.heroes[role as string]?.length || 0) > 0)
    if (filledRoles.length === 0) return null

    const startIndex = props.roles.indexOf(filledRoles[0]!)
    const endIndex = props.roles.indexOf(filledRoles[filledRoles.length - 1]!)
    return {start: startIndex, end: endIndex}
  })
)

const playerIsMultiRole = (player: Player): boolean => {
  const rolesPlayed = Object.keys(player.heroes).filter(role => (player.heroes[role as string]?.length || 0) > 0)
  return rolesPlayed.length > 1
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
    link.download = `${props.teamName.replace(/\s/g, '_')}_roster.png`
    link.href = dataUrl
    link.click()
    
    addToast('Grafik erfolgreich gespeichert!', 'success')
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
      addToast('Grafik erfolgreich kopiert!', 'success')
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

const columnConfig = [
  { id: 'TANK', width: '230px', flex: 'none', subroles: ['TANK'] },
  { id: 'DPS', width: 'auto', flex: '1', subroles: ['HITSCAN DPS', 'HYBRID DPS', 'FLEX DPS'] },
  { id: 'SUPPORT', width: 'auto', flex: '1', subroles: ['MAIN SUPPORT', 'HYBRID SUPPORT', 'FLEX SUPPORT'] }
]

const updateDimensions = () => {
  if (containerRef.value && contentRef.value) {
    const parentWidth = containerRef.value.offsetWidth
    scale.value = Math.min(parentWidth / 1920, 1)
    
    // Measure actual height of internal content which doesn't have a fixed height
    internalHeight.value = Math.max(1080, contentRef.value.offsetHeight)
  }
}

// Update height when players or data changes
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
      <div ref="contentRef" class="w-full flex flex-col pb-[20px]">
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
          <div class="flex mb-8" style="padding-left: 288px; border: none;">
            <div v-for="role in roles.filter(r => !r.toLowerCase().includes('hybrid'))" :key="role"
                 class="text-center flex items-end role-header"
                 :style="{ color: '#e5e5e5', flex: role.includes('TANK') ? 'none' : '1', width: role.includes('TANK') ? '230px' : 'auto' }">
              <div
                class="text-3xl flex justify-center gap-0 text-wrap flex-nowrap items-center">
                <img v-if="role.includes('TANK')" :src="TankIcon" alt="Tank"
                     class="h-18 skew-6">
                <img v-if="role.includes('SUPPORT')" :src="SupportIcon"
                     alt="Support" class="h-18 skew-6">
                <img v-if="role.includes('DPS')" :src="OffenseIcon" alt="DPS"
                     class="h-18 skew-6">
                <div class="role-name flex flex-col items-start" style="margin-top: 8px;">
                  <div v-for="line in role.split(' ')" :key="line"
                       style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; margin-top: -6px; letter-spacing: 0px;">{{ line }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Player Rows -->
          <div v-for="(player, pIndex) in players" :key="pIndex" class="flex items-center mb-8">
            <div class="flex flex-col justify-center" style="width: 220px; color: #e5e5e5; flex-shrink: 0;">
              <div class="text-3xl leading-tight" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; letter-spacing: -0.25px;">{{ player.name.toUpperCase() }}</div>
              <div v-if="player.status" class="text-2xl -mt-2" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; color: transparent; -webkit-text-stroke: 1px #e5e5e5;">
                {{ player.status.toUpperCase() }}
              </div>
            </div>

            <div style="width: 100%; display: flex; gap: 24px; align-items: center; margin-left: 68px;">
              
              <!-- Dynamic Columns -->
              <template v-for="col in columnConfig" :key="col.id">
                <div v-if="col.subroles.some(sr => (player.heroes[sr as string]?.length || 0) > 0)" 
                    class="role-column" 
                    :style="{ 
                      width: col.width, 
                      flex: col.flex, 
                      display: col.subroles.length > 1 && !isClassicLayout ? 'grid' : 'flex', 
                      gridTemplateColumns: col.subroles.length > 1 && !isClassicLayout ? '1fr auto 1fr' : 'none',
                      justifyContent: col.subroles.length > 1 && isClassicLayout ? 'space-between' : 'flex-start',
                      alignItems: 'center', 
                      minWidth: 0,
                      position: 'relative'
                    }">
                  
                  <template v-if="col.subroles.length > 1 && !isClassicLayout">
                    <!-- MAIN (Links) -->
                    <div class="flex items-center min-w-0 w-full" :class="(player.heroes[col.subroles[1]!]?.length || 0) > 0 || (player.heroes[col.subroles[2]!]?.length || 0) > 0 ? 'pr-2' : ''">
                      <div class="flex gap-1 shrink-0" :class="{'multi-role-player': (player.heroes[col.subroles[0]!]?.length || 0) > 1}">
                        <img 
                          v-for="(hero, hIndex) in player.heroes[col.subroles[0]!] || []" 
                          :key="hIndex" :src="getProxyUrl(hero.portrait)" 
                          :alt="hero.name" 
                          crossorigin="anonymous" 
                          class="important-border" 
                          style="width: 70px; height: 70px; border-radius: 8px; border: 2px solid rgba(255, 255, 255, 0.75);" 
                          :style="{ opacity: (player.mainHeroKeys && player.mainHeroKeys.length > 0) 
                              ? (player.mainHeroKeys.includes(hero.key) ? '1' : '0.5') 
                              : '1' 
                          }"
                        />
                      </div>
                      <div class="flex-grow h-[2px] rounded" :style="{ marginLeft: (player.heroes[col.subroles[0]!]?.length || 0) > 0 ? '8px' : '0', backgroundColor: 'rgba(255, 255, 255, 0.075)' }"></div>
                    </div>

                    <!-- HYBRID (Mitte) -->
                    <div class="flex justify-center shrink-0">
                      <div class="flex gap-1" :class="{'multi-role-player': (player.heroes[col.subroles[1]!]?.length || 0) > 1}">
                        <img 
                          v-for="(hero, hIndex) in player.heroes[col.subroles[1]!] || []" 
                          :key="hIndex" :src="getProxyUrl(hero.portrait)" 
                          :alt="hero.name" 
                          crossorigin="anonymous" 
                          class="important-border" 
                          style="width: 70px; height: 70px; border-radius: 8px; border: 2px solid rgba(255, 255, 255, 0.75);" 
                          :style="{ opacity: (player.mainHeroKeys && player.mainHeroKeys.length > 0) 
                              ? (player.mainHeroKeys.includes(hero.key) ? '1' : '0.5') 
                              : '1' 
                          }"
                        />
                      </div>
                    </div>

                    <!-- FLEX (Rechts) -->
                    <div class="flex items-center min-w-0 w-full" :class="(player.heroes[col.subroles[0]!]?.length || 0) > 0 || (player.heroes[col.subroles[1]!]?.length || 0) > 0 ? 'pl-2' : ''">
                      <div class="flex-grow h-[2px] rounded" :style="{ marginRight: (player.heroes[col.subroles[2]!]?.length || 0) > 0 ? '8px' : '0', backgroundColor: 'rgba(255, 255, 255, 0.075)' }"></div>
                      <div class="flex gap-1 shrink-0" :class="{'multi-role-player': (player.heroes[col.subroles[2]!]?.length || 0) > 1}">
                        <img 
                          v-for="(hero, hIndex) in player.heroes[col.subroles[2]!] || []" 
                          :key="hIndex" :src="getProxyUrl(hero.portrait)" 
                          :alt="hero.name" 
                          crossorigin="anonymous" 
                          class="important-border" 
                          style="width: 70px; height: 70px; border-radius: 8px; border: 2px solid rgba(255, 255, 255, 0.75);" 
                          :style="{ opacity: (player.mainHeroKeys && player.mainHeroKeys.length > 0) 
                              ? (player.mainHeroKeys.includes(hero.key) ? '1' : '0.5') 
                              : '1' 
                          }"
                        />
                      </div>
                    </div>
                  </template>

                  <template v-else-if="col.subroles.length > 1 && isClassicLayout">
                    <template v-for="(subrole, srIndex) in col.subroles" :key="subrole">
                      <div class="flex gap-1" :class="{'multi-role-player': (player.heroes[subrole]?.length || 0) > 1}"
                           :style="col.subroles.length > 1 ? (srIndex === 0 ? {marginRight: (player.heroes[subrole]?.length || 0) > 0 ? '8px' : '0'} : (srIndex === 1 ? {margin: (player.heroes[subrole]?.length || 0) > 0 ? '0 8px' : '0'} : {marginLeft: (player.heroes[subrole]?.length || 0) > 0 ? '8px' : '0'})) : {}">
                        <img 
                          v-for="(hero, hIndex) in player.heroes[subrole] || []" 
                          :key="hIndex" :src="getProxyUrl(hero.portrait)" 
                          :alt="hero.name" 
                          crossorigin="anonymous" 
                          class="important-border" 
                          style="width: 70px; height: 70px; border-radius: 8px; border: 2px solid rgba(255, 255, 255, 0.75);" 
                          :style="{ opacity: (player.mainHeroKeys && player.mainHeroKeys.length > 0) 
                              ? (player.mainHeroKeys.includes(hero.key) ? '1' : '0.5') 
                              : '1' 
                          }"
                        />
                      </div>
                      
                      <!-- Separator Line -->
                      <div v-if="srIndex < col.subroles.length - 1" class="flex-grow h-[2px] rounded" style="background-color: rgba(255, 255, 255, 0.075);"></div>
                    </template>
                  </template>

                  <template v-else>
                    <div v-for="(subrole, srIndex) in col.subroles" :key="subrole" class="flex items-center">
                      <div class="flex gap-1" :class="{'multi-role-player': (player.heroes[subrole]?.length || 0) > 1}">
                        <img 
                          v-for="(hero, hIndex) in player.heroes[subrole] || []" 
                          :key="hIndex" :src="getProxyUrl(hero.portrait)" 
                          :alt="hero.name" 
                          crossorigin="anonymous" 
                          class="important-border" 
                          style="width: 70px; height: 70px; border-radius: 8px; border: 2px solid rgba(255, 255, 255, 0.75);" 
                          :style="{ opacity: (player.mainHeroKeys && player.mainHeroKeys.length > 0) 
                              ? (player.mainHeroKeys.includes(hero.key) ? '1' : '0.5') 
                              : '1' 
                          }"
                        />
                      </div>
                    </div>
                  </template>
                </div>
                
                <!-- Column is Empty -->
                <div v-else class="h-[2px] rounded" :style="{ width: col.width, flex: col.flex, minWidth: 0, backgroundColor: 'rgba(255, 255, 255, 0.075)' }"></div>
              </template>

            </div>
          </div>
        </div>

        <!-- Canvas Disclaimer -->
        <div class="w-full text-center mt-6 mb-4 px-12 opacity-20">
          <p class="text-[11px] leading-tight tracking-wider" style="color: #e5e5e5; font-family: 'Geom Graphic W03 Regular Italic', sans-serif; text-wrap: balance;">
            Overwatch und alle zugehörigen Grafiken sind Eigentum von Blizzard Entertainment. Keine offizielle Partnerschaft.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
