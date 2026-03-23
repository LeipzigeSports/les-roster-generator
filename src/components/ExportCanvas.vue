<script setup lang="ts">
import {ref} from 'vue'
import * as domtoimage from 'dom-to-image-more'
import type {Player} from '../types/hero'
import {computed} from "vue";

const props = defineProps<{
  teamName: string
  date: string
  roles: string[]
  players: Player[]
}>()

const canvasRef = ref<HTMLDivElement | null>(null)
const mainRoles = ['TANK', 'DPS', 'SUPPORT']

const playerRoleRanges = computed(() =>
  props.players.map(player => {
    const filledRoles = mainRoles.filter(role => player.heroes[role] !== undefined && player.heroes[role].length > 0) ?? []
    console.log(player.heroes);
    if (filledRoles.length === 0) return null

    const startIndex = mainRoles.indexOf(filledRoles[0]!)
    const endIndex = mainRoles.indexOf(filledRoles[filledRoles.length - 1]!)
    return {start: startIndex, end: endIndex}
  })
)

const generateImagePath = (heroName: string): string => {
  return `/src/assets/portraits/${heroName}.png`
}

const playerIsMultiRole = (player: Player): boolean => {
  const rolesPlayed = Object.keys(player.heroes).filter(role => (player.heroes as any)[role]?.length > 0)
  return rolesPlayed.length > 1
}

const downloadImage = async (): Promise<void> => {
  if (!canvasRef.value) {
    alert('Canvas nicht gefunden')
    return
  }

  try {
    // Clone the element and remove the scale transform for clean rendering
    const clone = canvasRef.value.cloneNode(true) as HTMLElement
    clone.style.transform = 'scale(1)'
    clone.style.transformOrigin = 'top left'
    clone.style.position = 'absolute'
    clone.style.left = '-9999px'

    // Remove all borders from all elements
    const allElements = clone.querySelectorAll('*')
    allElements.forEach(el => {
      const htmlEl = el as HTMLElement
      if (htmlEl.classList.contains('important-border')) return
      htmlEl.style.border = 'none'
      htmlEl.style.outline = 'none'
      htmlEl.style.boxShadow = 'none'
      htmlEl.style.textWrap = 'nowrap'
    })

    document.body.appendChild(clone)

    const dataUrl = await domtoimage.toPng(clone, {
      width: 1920,
      height: 1080,
    })

    document.body.removeChild(clone)

    const link = document.createElement('a')
    link.download = `${props.teamName.replace(/\s/g, '_')}_roster.png`
    link.href = dataUrl
    link.click()
  } catch (error) {
    console.error('Error generating image:', error)
    alert('Fehler beim Erstellen der Grafik. Bitte versuche es erneut.')
  }
}

defineExpose({
  downloadImage
})
</script>

<template>
  <div
    ref="canvasRef"
    class="mx-auto"
    style="width: 1920px; height: min-content; background: linear-gradient(180deg, #151515 10%, #482710 50%, #ff6700 100%); transform: scale(1); transform-origin: top center; margin-bottom: -540px; border: none; outline: none;"
  >
    <!-- Header -->
    <div class="pt-16 px-12" style="border: none;">
      <div class="flex justify-between items-start">
        <div class="flex items-center">
          <img src="../assets/icons/LES_ICON-ORANGE.png" alt="logo" class="w-44 h-44 mr-4"/>
          <div class="border-r h-32 ml-10 mr-12 important-border"
               style="border-color: #ff6700"></div>
          <h2 class="text-6xl bold wr" style="color: #e5e5e5;">
            {{ teamName.toUpperCase() }}
          </h2>
        </div>
        <div class="text-3xl" style="color: #e5e5e5;">
          Stand: {{ date }}
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="px-12 pt-12 flex flex-col gap-7" style="border: none; height: min-content">
      <!-- Column Headers -->
      <div class="flex mb-8" style="padding-left: 100px; border: none;">
        <div v-for="role in roles.filter(r => !r.toLowerCase().includes('hybrid'))" :key="role"
             class="text-center flex items-end justify-center"
             style="min-width: 340px; color: #e5e5e5;">
          <div
            class="font-bold text-4xl flex justify-center gap-1 text-wrap flex-nowrap items-center">
            <img v-if="role.includes('TANK')" src="../assets/icons/roles/TankIcon.png" alt="Tank"
                 class="w-20 h-18">
            <img v-if="role.includes('SUPPORT')" src="../assets/icons/roles/SupportIcon.png"
                 alt="Support" class="w-20 h-18">
            <img v-if="role.includes('DPS')" src="../assets/icons/roles/OffenseIcon.png" alt="DPS"
                 class="w-20 h-18">
            <div class="flex flex-col items-start">
              <div v-for="line in role.split(' ')" :key="line"
                   style="font-family: 'Geom Graphic W03 Regular Italic', sans-serif">{{ line }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Player Rows -->
      <div v-for="(player, pIndex) in players" :key="pIndex" class="flex items-center mb-8">
        <div class="italic text-3xl font-bold" style="width: 100px; color: #e5e5e5;">
          {{ player.name.toUpperCase() }}
        </div>

        <div
          style="display: flex; gap: 5px; border-radius: 12px; padding: 4px; align-items: center; margin-left: 68px;"
        >
          <!-- before wrapped range -->
          <div v-for="(role, rIndex) in mainRoles.slice(0, playerRoleRanges[pIndex]?.start || 0)"
               :key="role + '-before'">
            <div class="flex gap-1.5 player-cell" :class="role.toLowerCase().replace(' ', '-')">
            </div>
          </div>

          <!-- wrapped range -->
          <div
            v-if="playerRoleRanges[pIndex]"
            class="flex gap-1.5"
            :class="{ 'multi-role-player': playerIsMultiRole(player) }"
          >
            <div
              v-for="(role, rIndex) in mainRoles.slice(playerRoleRanges[pIndex].start, playerRoleRanges[pIndex].end + 1)"
              :key="role + '-wrapped'"
              class="flex gap-1.5 player-cell"
              :class="[
      role.toLowerCase().replace(' ', '-'),
      {
        'first-in-range': (rIndex + playerRoleRanges[pIndex].start) === playerRoleRanges[pIndex].start,
        'last-in-range':  (rIndex + playerRoleRanges[pIndex].start) === playerRoleRanges[pIndex].end,
        'middle-in-range': (rIndex + playerRoleRanges[pIndex].start) > playerRoleRanges[pIndex].start &&
                           (rIndex + playerRoleRanges[pIndex].start) < playerRoleRanges[pIndex].end,
      }
    ]"

            >
              <img
                v-for="(hero, hIndex) in player.heroes[role] || []"
                :key="hIndex"
                :src="generateImagePath(hero.key)"
                :alt="hero.name"
                class="important-border"
                style="width: 70px; height: 70px; border-radius: 10px; border: none;"
              />
              <!--              <div class="line" v-if="(rIndex + playerRoleRanges[pIndex].start) < playerRoleRanges[pIndex].end"></div>-->
            </div>
          </div>

          <!-- after wrapped range -->

          <div v-if="playerRoleRanges[pIndex]">
            <div
              v-for="role in mainRoles.slice(playerRoleRanges[pIndex].end + 1)"
              :key="role + '-after'"
            >
              <div class="flex gap-1.5 player-cell" :class="role.toLowerCase().replace(' ', '-')">
                <img
                  v-for="(hero, hIndex) in player.heroes[role] || []"
                  :key="hIndex"
                  :src="generateImagePath(hero.key)"
                  :alt="hero.name"
                  class="important-border"
                  style="width: 70px; height: 70px; border-radius: 10px; border: none;"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
