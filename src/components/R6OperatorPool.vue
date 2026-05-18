<script setup lang="ts">
import { computed } from 'vue'
import type { R6Operator } from '../types/r6operator'
import { useR6Operators } from '../composables/useR6Operators'

const props = defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  'start-drag': [operator: R6Operator]
}>()

const { attackers, defenders, getOperatorIcon } = useR6Operators()

const startDrag = (operator: R6Operator): void => {
  emit('start-drag', operator)
}
</script>

<template>
  <div class="bg-dark p-6 rounded-lg mb-8">
    <h2 class="text-3xl bold mb-4 -mt-1">Operator Pool</h2>

    <div v-if="loading" class="text-center py-4">
      Lade Operator...
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 max-h-[800px] overflow-y-visible">
      <!-- Attackers -->
      <div>
        <h3 class="text-lg font-bold mb-2 capitalize" style="color: #ff6700">
          Angreifer
        </h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="op in attackers"
            :key="op.id"
            draggable="true"
            @dragstart="startDrag(op)"
            class="cursor-move hero-portrait"
          >
            <img
              :src="getOperatorIcon(op.id)"
              :alt="op.name"
              :title="op.name"
              class="w-16 h-16 rounded border-2 border-gray-600 hover:border-[#ff6700] object-cover transition-colors"
            />
          </div>
        </div>
      </div>

      <!-- Defenders -->
      <div>
        <h3 class="text-lg font-bold mb-2 capitalize" style="color: #ff6700">
          Verteidiger
        </h3>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="op in defenders"
            :key="op.id"
            draggable="true"
            @dragstart="startDrag(op)"
            class="cursor-move hero-portrait"
          >
            <img
              :src="getOperatorIcon(op.id)"
              :alt="op.name"
              :title="op.name"
              class="w-16 h-16 rounded border-2 border-gray-600 hover:border-[#ff6700] object-cover transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
