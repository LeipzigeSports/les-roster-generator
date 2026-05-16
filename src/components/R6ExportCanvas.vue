<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as domtoimage from 'dom-to-image-more'
import { useToast } from '../composables/useToast'
import type { R6Player } from '../types/r6operator'
import { useR6Operators } from '../composables/useR6Operators'
import LogoIcon from '@/assets/icons/LES_ICON-ORANGE.png'

const props = defineProps<{
  teamName: string
  date: string
  players: R6Player[]
  isTransparentBg: boolean
}>()

const { addToast } = useToast()
const { getOperatorIcon } = useR6Operators()

const canvasRef = ref<HTMLDivElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const internalHeight = ref(1080)
const scale = ref(1)

const CANVAS_WIDTH = 1080

const updateDimensions = () => {
  if (containerRef.value && contentRef.value) {
    const parentWidth = containerRef.value.offsetWidth
    scale.value = Math.min(parentWidth / CANVAS_WIDTH, 1)
    internalHeight.value = Math.max(CANVAS_WIDTH, contentRef.value.offsetHeight)
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

const prepareClone = async (): Promise<HTMLElement | null> => {
  if (!canvasRef.value) {
    addToast('Canvas nicht gefunden', 'error')
    return null
  }

  await new Promise(resolve => setTimeout(resolve, 300))

  const clone = canvasRef.value.cloneNode(true) as HTMLElement
  // For export we use a higher resolution multiplier
  const exportScale = 2 // Export at 2880px width for extra crispiness
  clone.style.transform = `scale(${exportScale})`
  clone.style.transformOrigin = 'top left'
  clone.style.position = 'absolute'
  clone.style.left = '-9999px'

  const allElements = clone.querySelectorAll('*')
  allElements.forEach(el => {
    const htmlEl = el as HTMLElement
    if (htmlEl.classList.contains('important-border')) return
    htmlEl.style.border = 'none'
    htmlEl.style.outline = 'none'
    htmlEl.style.boxShadow = 'none'
    if (!htmlEl.classList.contains('allow-wrap')) {
      htmlEl.style.whiteSpace = 'nowrap'
    }
  })

  document.body.appendChild(clone)
  return clone
}

const downloadImage = async (): Promise<void> => {
  try {
    const clone = await prepareClone()
    if (!clone) return

    const exportScale = 2
    const targetHeight = Math.max(CANVAS_WIDTH, clone.scrollHeight / exportScale)
    
    const dataUrl = await domtoimage.toPng(clone, {
      width: CANVAS_WIDTH * exportScale,
      height: targetHeight * exportScale,
      cacheBust: true
    })

    document.body.removeChild(clone)

    const link = document.createElement('a')
    link.download = `${props.teamName.replace(/\s/g, '_')}_r6_roster.png`
    link.href = dataUrl
    link.click()
    
    addToast('R6-Grafik erfolgreich gespeichert!', 'success')
  } catch (error) {
    console.error('Error generating image:', error)
    addToast('Fehler beim Speichern.', 'error')
  }
}

const copyImage = async (): Promise<void> => {
  try {
    const clone = await prepareClone()
    if (!clone) return

    const exportScale = 2
    const targetHeight = Math.max(CANVAS_WIDTH, clone.scrollHeight / exportScale)
    
    const blob = await domtoimage.toBlob(clone, {
      width: CANVAS_WIDTH * exportScale,
      height: targetHeight * exportScale,
      cacheBust: true
    })

    document.body.removeChild(clone)

    if (blob) {
      await navigator.clipboard.write([
        new window.ClipboardItem({ 'image/png': blob })
      ])
      addToast('R6-Grafik erfolgreich kopiert!', 'success')
    }
  } catch (error) {
    console.error('Error copying image:', error)
    addToast('Fehler beim Kopieren!', 'error')
  }
}

defineExpose({ downloadImage, copyImage })
</script>

<template>
  <div ref="containerRef" class="w-full overflow-hidden mt-12 mb-8 rounded-lg shadow-2xl border border-white/5 bg-black/20 flex justify-center" :style="{ height: `${internalHeight * scale}px`, maxWidth: 'fit-content', justifySelf: 'center' }">
    <div
      ref="canvasRef"
      class="origin-top shrink-0 overflow-hidden"
      :style="`width: ${CANVAS_WIDTH}px; min-height: 1080px; height: ${internalHeight}px; background: ${isTransparentBg ? 'transparent' : 'linear-gradient(180deg, #151515 0%, #ff6700 400%)'}; transform: scale(${scale}); border: none; outline: none; transition: height 0.3s ease;`"
    >
      <div ref="contentRef" class="w-full flex flex-col pb-16">
        <!-- Header -->
        <div class="pt-16 px-12" style="border: none;">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <img :src="LogoIcon" alt="logo" class="w-40 h-40 mr-2"/>
              <div class="border-r h-28 ml-6 mr-8 important-border"
                   style="border-color: #ff6700"></div>
              <div>
                  <h2 class="text-6xl bold wr" style="-webkit-text-stroke: 1px #e5e5e5; color: transparent; padding-left: 10px; margin-top: -4px; font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
                    LES
                  </h2>
                  <h2 class="text-6xl bold wr" style="color: #e5e5e5; font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
                    {{ teamName.toUpperCase() }}
                  </h2>
              </div>
            </div>
            <div class="text-2xl flex self-end mb-3 text-right" style="line-height: 1.1; color: #e5e5e5; font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
              Stand:<br>{{ date ? date.split('-').reverse().join('.') : '' }}
            </div>
          </div>
        </div>

        <!-- Roster Section -->
        <div class="px-16 pt-16 flex flex-col gap-10">
          <div v-for="(player, pIndex) in players" :key="pIndex" class="flex items-center">
            <!-- Player Info -->
            <div class="flex flex-col justify-center" style="width: 400px; color: #e5e5e5; flex-shrink: 0;">
              <div class="text-4xl leading-tight" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; letter-spacing: -0.25px;">
                {{ player.name.toUpperCase() }}
              </div>
              <div v-if="player.status" class="text-2xl -mt-1" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; color: transparent; -webkit-text-stroke: 1px #e5e5e5;">
                {{ player.status.toUpperCase() }}
              </div>
            </div>

            <!-- Operators -->
            <div class="flex gap-6 items-center flex-1 justify-end">
              <div 
                v-for="(op, opIdx) in player.operators" 
                :key="`${op.id}-${opIdx}`"
                class="w-24 h-24 bg-white/5 rounded-lg border-2 border-white/20 p-0 important-border"
                :style="{ opacity: (player as any).mainOpKeys?.length ? ((player as any).mainOpKeys.includes(op.id) ? '1' : '0.5') : '1' }"
              >
                <img 
                  :src="getOperatorIcon(op.id)" 
                  class="w-full h-full object-contain"
                  crossorigin="anonymous"
                />
              </div>
              <div 
                v-for="i in (4 - player.operators.length)" 
                :key="`empty-${i}`"
                class="w-24 h-24 rounded-lg border-2 border-dashed border-white/5 important-border"
              ></div>
            </div>
          </div>
        </div>

        <div class="w-full text-center mt-12 px-16 opacity-20">
          <p class="allow-wrap text-[14px] leading-tight tracking-wider" style="color: #e5e5e5; font-family: 'Geom Graphic W03 Regular Italic', sans-serif; text-wrap: balance; white-space: normal;">
            Tom Clancy's Rainbow Six Siege ist eine Marke von Ubisoft Entertainment. Dieses Tool steht in keiner Verbindung zu Ubisoft. Alle Operator-Icons und Assets sind Eigentum ihrer jeweiligen Inhaber.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
