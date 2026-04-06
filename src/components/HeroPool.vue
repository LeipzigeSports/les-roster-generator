<script setup lang="ts">
import type { HeroesByRole, Hero } from '../types/hero'

defineProps<{
  heroesByRole: HeroesByRole
  loading: boolean
}>()
const emit = defineEmits<{
  'start-drag': [hero: Hero]
}>()

const startDrag = (hero: Hero): void => {
  emit('start-drag', hero)
}
</script>

<template>
  <div class="bg-dark p-6 rounded-lg mb-8">
    <h2 class="text-3xl bold mb-4 -mt-1">Heroes</h2>

    <div v-if="loading" class="text-center py-4">
      Lade Heroes...
    </div>

    <div v-else class="space-y-4 max-h-96 overflow-y-visible">
      <div v-for="(heroList, role) in heroesByRole" :key="role">
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
              class="w-12 h-12 rounded border-2 border-gray-600 hover:border-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
