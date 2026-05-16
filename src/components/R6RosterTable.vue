<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import type { R6Player, R6Operator } from '../types/r6operator'
import { useR6Operators } from '../composables/useR6Operators'

const props = defineProps<{
  players: R6Player[]
  operators: R6Operator[]
}>()

const emit = defineEmits<{
  'add-player': []
  'remove-player': [index: number]
  'move-player': [fromIndex: number, toIndex: number]
  'drop-operator': [playerIndex: number]
  'add-operator-obj': [playerIndex: number, operator: R6Operator]
  'remove-operator': [playerIndex: number, opIndex: number]
  'toggle-main-operator': [playerIndex: number, opId: string]
}>()

const { getOperatorIcon } = useR6Operators()

const searchState = ref<{
  pIndex: number
  query: string
  selectedIndex: number
} | null>(null)

const filteredOperators = computed(() => {
  if (!searchState.value) return []
  const { query } = searchState.value

  const list = props.operators

  if (!query) return list.slice().sort((a, b) => a.name.localeCompare(b.name))

  return list
    .filter((op: R6Operator) => op.name.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const selectOperator = (operator: R6Operator) => {
  if (searchState.value) {
    emit('add-operator-obj', searchState.value.pIndex, operator)
    searchState.value = null
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!searchState.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (filteredOperators.value.length > 0) {
      searchState.value.selectedIndex = (searchState.value.selectedIndex + 1) % filteredOperators.value.length
      scrollToSelected()
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (filteredOperators.value.length > 0) {
      searchState.value.selectedIndex = (searchState.value.selectedIndex - 1 + filteredOperators.value.length) % filteredOperators.value.length
      scrollToSelected()
    }
  } else if (e.key === 'Enter' && filteredOperators.value.length > 0) {
    const op = filteredOperators.value[searchState.value.selectedIndex]
    if (op) selectOperator(op)
    const target = e.target as HTMLInputElement
    target.value = ''
    target.blur()
  } else if (e.key === 'Escape') {
    searchState.value = null
    const target = e.target as HTMLInputElement
    target.blur()
  }
}

const scrollToSelected = () => {
  nextTick(() => {
    const list = document.querySelector('.hero-suggestions-list')
    const selected = list?.querySelector('.hero-suggestion-item.active') as HTMLElement
    if (list && selected) {
      const listRect = list.getBoundingClientRect()
      const selectedRect = selected.getBoundingClientRect()
      
      if (selectedRect.bottom > listRect.bottom) {
        list.scrollTop += (selectedRect.bottom - listRect.bottom)
      } else if (selectedRect.top < listRect.top) {
        list.scrollTop -= (listRect.top - selectedRect.top)
      }
    }
  })
}

const canAddOperator = (player: R6Player) => {
  return player.operators.length < 4
}

const searchPosition = ref({ top: 0, left: 0, width: 0, height: 0 })

const openSearch = (pIndex: number, event: MouseEvent) => {
  searchState.value = { pIndex, query: '', selectedIndex: 0 }
  
  const btn = event.currentTarget as HTMLElement
  const cell = btn.closest('td')
  if (cell) {
    const rect = cell.getBoundingClientRect()
    searchPosition.value = {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  }

  nextTick(() => {
    const input = document.querySelector(`.search-input-${pIndex}`) as HTMLInputElement
    if (input) input.focus()
  })
}

const handleBlur = () => {
  setTimeout(() => {
    searchState.value = null
  }, 200)
}

const activeStatusDropdown = ref<number | null>(null)

// --- Row Drag & Drop ---
const dragRowIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)
const dragFromHandle = ref(false)

const onRowDragStart = (index: number, e: DragEvent) => {
  if (!dragFromHandle.value) {
    e.preventDefault()
    return
  }
  dragRowIndex.value = index
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
  }
}

const onRowDragOver = (index: number, e: DragEvent) => {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverIndex.value = index
}

const onRowDrop = (toIndex: number, e: DragEvent) => {
  e.preventDefault()
  if (dragRowIndex.value !== null && dragRowIndex.value !== toIndex) {
    emit('move-player', dragRowIndex.value, toIndex)
  }
  dragRowIndex.value = null
  dragOverIndex.value = null
}

const onRowDragEnd = () => {
  dragRowIndex.value = null
  dragOverIndex.value = null
}

const dropdownPosition = ref({ top: 0, left: 0, width: 0 })
const statusPresets = ['', 'TRYOUT', 'IGL', 'MANAGER', 'CAPTAIN', 'CUSTOM']

const toggleStatusDropdown = (pIndex: number, event: MouseEvent) => {
  if (activeStatusDropdown.value === pIndex) {
    activeStatusDropdown.value = null
    return
  }

  const btn = (event.currentTarget as HTMLElement)
  const rect = btn.getBoundingClientRect()
  
  dropdownPosition.value = {
    top: rect.bottom + 6,
    left: rect.left,
    width: rect.width
  }

  activeStatusDropdown.value = pIndex
}

const selectStatus = (player: R6Player, val: string) => {
  if (val === 'CUSTOM') {
    (player as any).customStatus = true
    if (['', 'TRYOUT', 'IGL', 'MANAGER', 'CAPTAIN'].includes(player.status || '')) {
      player.status = '...'
    }
  } else {
    (player as any).customStatus = false
    player.status = val
  }
  activeStatusDropdown.value = null
}

const handleOutsideInteraction = (e: Event) => {
  if (e instanceof MouseEvent) {
    const target = e.target as HTMLElement
    if (target.closest('.subtle-dropdown-btn') || 
        target.closest('.status-dropdown-menu') || 
        target.closest('.add-hero-btn') || 
        target.closest('.hero-search-overlay') ||
        target.closest('.hero-suggestions-list')) {
      return
    }
  }

  if (e.type === 'scroll') {
    const target = e.target as HTMLElement
    if (target.closest?.('.hero-suggestions-list')) {
      return
    }
  }
  
  activeStatusDropdown.value = null
  searchState.value = null
}

onMounted(() => {
  window.addEventListener('scroll', handleOutsideInteraction, true)
  window.addEventListener('resize', handleOutsideInteraction)
  window.addEventListener('mousedown', handleOutsideInteraction)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleOutsideInteraction, true)
  window.removeEventListener('resize', handleOutsideInteraction)
  window.removeEventListener('mousedown', handleOutsideInteraction)
})
</script>

<template>
  <div class="bg-dark p-6 rounded-lg mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-3xl bold ml-1">Roster</h2>
      <div class="flex gap-4">
        <button
          @click="emit('add-player')"
          class="flex items-center text-lg gap-2 pl-3.5 pr-4 py-2 rounded text-white cursor-pointer"
        >
          <span>+</span> Spieler hinzufügen
        </button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full mt-2">
        <thead>
        <tr class="text-sm" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif; text-transform: uppercase; line-height: 1.1;">
          <th class="p-2 w-6"></th>
          <th class="p-2 text-left w-64">Spieler</th>
          <th class="p-2 text-center">Operators (max. 4)</th>
          <th class="p-2 w-12"></th>
        </tr>
        </thead>
        <TransitionGroup name="player-row" tag="tbody">
          <tr
            v-for="(player, pIndex) in players"
            :key="player.id"
            draggable="true"
            class="border-t border-gray-700/50 transition-colors"
            :class="{ 'bg-[#ff6700]/10': dragOverIndex === pIndex && dragRowIndex !== pIndex }"
            @dragstart="onRowDragStart(pIndex, $event)"
            @dragover="onRowDragOver(pIndex, $event)"
            @drop="onRowDrop(pIndex, $event)"
            @dragend="onRowDragEnd"
          >
          <td
            class="drag-handle-cell"
            @mousedown="dragFromHandle = true"
            @mouseup="dragFromHandle = false"
            @mouseleave="dragFromHandle = false"
          >
            <div class="drag-handle">
              <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                <circle cx="2" cy="2" r="1.5"/>
                <circle cx="8" cy="2" r="1.5"/>
                <circle cx="2" cy="7" r="1.5"/>
                <circle cx="8" cy="7" r="1.5"/>
                <circle cx="2" cy="12" r="1.5"/>
                <circle cx="8" cy="12" r="1.5"/>
              </svg>
            </div>
          </td>
          <td class="p-2">
            <input
              v-model="player.name"
              type="text"
              class="bg-light-dark text-lg px-1.5 py-0.5 rounded w-56 text-white block outline-none border border-transparent focus:border-[#ff6700]/30"
            />
            <div class="flex flex-col gap-1 mt-1">
              <div class="relative w-56 status-dropdown">
                <button
                  @click.stop="toggleStatusDropdown(pIndex, $event)"
                  class="subtle-dropdown-btn group"
                >
                  <span class="truncate">{{ !player.status && !(player as any).customStatus ? 'Status...' : (['TRYOUT', 'IGL', 'MANAGER', 'CAPTAIN'].includes(player.status || '') && !(player as any).customStatus ? player.status : 'Custom') }}</span>
                  <span class="text-[7px] opacity-40 group-hover:opacity-100 transition-opacity">▼</span>
                </button>

                <Teleport to="body">
                  <div
                    v-if="activeStatusDropdown === pIndex"
                    class="status-dropdown-menu animate-fade-in"
                    :style="{
                      top: dropdownPosition.top + 'px',
                      left: dropdownPosition.left + 'px',
                      width: dropdownPosition.width + 'px'
                    }"
                  >
                    <div
                      v-for="opt in statusPresets"
                      :key="opt"
                      @click.stop="selectStatus(player, opt)"
                      class="status-dropdown-item"
                      :class="{ 'active': ((!opt && !player.status && !(player as any).customStatus) || (opt === player.status && !(player as any).customStatus) || (opt === 'CUSTOM' && (player as any).customStatus)) }"
                    >
                      {{ opt || 'Keine Auswahl' }}
                    </div>
                  </div>
                </Teleport>
              </div>
              <input
                v-if="(player as any).customStatus || (player.status && !['', 'TRYOUT', 'IGL', 'MANAGER', 'CAPTAIN'].includes(player.status))"
                v-model="player.status"
                type="text"
                placeholder="Benutzerdefinierter Status..."
                class="bg-light-dark px-1.5 py-1 rounded w-56 text-gray-300 text-[10px] border border-white/5 italic outline-none focus:border-[#ff6700]/30"
              />
            </div>
          </td>
          <td
            class="p-2 relative"
            @dragover.prevent
            @drop="emit('drop-operator', pIndex)"
          >
            <TransitionGroup
              name="hero-item"
              tag="div"
              class="flex gap-1 justify-center min-h-24 items-center bg-light-dark/40 rounded p-1.5 min-w-[200px] relative"
            >
              <div
                v-for="(op, opIdx) in player.operators"
                :key="`${op.id}-${opIdx}`"
                class="relative group cursor-pointer"
              >
                <img
                  :src="getOperatorIcon(op.id)"
                  :alt="op.name"
                  class="w-18 h-18 rounded border transition-all"
                  :class="(player as any).mainOpKeys?.includes(op.id) ? 'border-[#ff6700] ring-1 ring-[#ff6700]/50' : 'border-white/10'"
                  @click="emit('remove-operator', pIndex, opIdx)"
                />
                
                <!-- Main Toggle Star -->
                <button
                  @click.stop="emit('toggle-main-operator', pIndex, op.id)"
                  class="main-hero-star"
                  :class="{ active: (player as any).mainOpKeys?.includes(op.id) }"
                  :title="(player as any).mainOpKeys?.includes(op.id) ? 'Markierung als Main entfernen' : 'als Main markieren'"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1.7L15 8.3L22.2 9.3L17 14.3L18.2 21.5L12 18L5.8 21.5L7 14.3L1.8 9.3L9 8.3L12 1.7Z" />
                  </svg>
                </button>

                <div class="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity z-10 pointer-events-none">
                  <span class="text-white text-lg">×</span>
                </div>
              </div>

              <!-- Inline Search/Add -->
              <div v-if="canAddOperator(player)" :key="'add-btn'" class="flex items-center">
                <button
                  v-if="!(searchState?.pIndex === pIndex)"
                  @click.stop="openSearch(pIndex, $event)"
                  class="add-hero-btn"
                  title="Operator suchen"
                >
                  <span class="text-xl mb-0.25">+</span>
                </button>
                
                <Teleport to="body">
                  <div
                    v-if="searchState?.pIndex === pIndex"
                    class="hero-search-overlay animate-fade-in"
                    :style="{
                      top: searchPosition.top + 'px',
                      left: searchPosition.left + 'px',
                      width: searchPosition.width + 'px',
                      height: searchPosition.height + 'px'
                    }"
                  >
                    <div class="hero-search-bg"></div>
                    
                    <div class="w-full relative px-2">
                      <input
                        type="text"
                        placeholder="Operator suchen..."
                        :class="`search-input-${pIndex}`"
                        class="hero-search-input"
                        :value="searchState.query"
                        @input="(e: Event) => searchState!.query = (e.target as HTMLInputElement).value"
                        @keydown="handleKeyDown"
                        @blur="handleBlur"
                      />

                      <div v-if="searchState.query" class="hero-suggestions-list">
                        <div
                          v-for="(op, idx) in filteredOperators"
                          :key="op.id"
                          @mousedown.prevent="selectOperator(op)"
                          class="hero-suggestion-item"
                          :class="{ 'active': searchState.selectedIndex === idx }"
                        >
                          <img :src="getOperatorIcon(op.id)" :alt="op.name" class="hero-suggestion-img" />
                          <span class="hero-suggestion-name">{{ op.name }}</span>
                        </div>
                        <div v-if="filteredOperators.length === 0" class="p-3 text-[10px] text-gray-500 text-center uppercase font-bold">
                          Keine Treffer
                        </div>
                      </div>
                    </div>
                  </div>
                </Teleport>
              </div>
            </TransitionGroup>
          </td>
          <td class="p-2 text-center">
            <button
              @click="emit('remove-player', pIndex)"
              class="delete-row-btn text-gray-600 hover:text-red-500 transition-colors font-bold text-xl cursor-pointer rounded"
            >
              ×
            </button>
          </td>
        </tr>
        </TransitionGroup>
      </table>
    </div>
  </div>
</template>

<style scoped>
.add-hero-btn {
  width: 48px;
  height: 48px;
}
.hero-suggestion-img {
  width: 48px;
  height: 48px;
}
.hero-suggestion-name {
  font-size: 14px;
}
.subtle-dropdown-btn {
  width: 100% !important;
}
</style>
