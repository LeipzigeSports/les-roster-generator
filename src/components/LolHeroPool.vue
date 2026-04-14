<script setup lang="ts">
import { computed } from 'vue'
import type { Hero } from '../types/hero'

const props = defineProps<{
  champions: any[]
  loading: boolean
}>()

const emit = defineEmits<{
  'start-drag': [hero: Hero]
}>()

const groupedChampions = computed(() => {
  const groups: Record<string, Hero[]> = {
    'Assassin': [],
    'Fighter': [],
    'Mage': [],
    'Marksman': [],
    'Support': [],
    'Tank': []
  }

  props.champions.forEach(champ => {
    // Map Champion to Hero type for compatibility
    const hero: Hero = {
      key: champ.id,
      name: champ.name,
      portrait: champ.portraitUrl,
      role: champ.tags[0]?.toLowerCase() === 'marksman' ? 'damage' : 
            (champ.tags[0]?.toLowerCase() === 'tank' ? 'tank' : 'support') // Placeholder role for type compatibility
    }

    const primaryTag = champ.tags[0]
    if (groups[primaryTag]) {
      groups[primaryTag].push(hero)
    } else {
      // Fallback
      if (!groups['Others']) groups['Others'] = []
      groups['Others'].push(hero)
    }
  })

  return groups
})

const startDrag = (hero: Hero): void => {
  emit('start-drag', hero)
}
</script>

<template>
  <div class="bg-dark p-6 rounded-lg mb-8">
    <h2 class="text-3xl bold mb-4 -mt-1">Champion Pool</h2>

    <div v-if="loading" class="text-center py-4">
      Lade Champions...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-h-[800px] overflow-y-visible">
      <div v-for="(heroList, role) in groupedChampions" :key="role">
        <h3 class="text-lg font-bold mb-2 capitalize" style="color: #ff6700">
          {{ role }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="hero in heroList"
            :key="hero.key"
            draggable="true"
            @dragstart="startDrag(hero)"
            class="cursor-move hero-portrait"
          >
            <img
              :src="hero.portrait"
              :alt="hero.name"
              :title="hero.name"
              class="w-12 h-12 rounded border-2 border-gray-600 hover:border-[#ff6700] object-cover transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
