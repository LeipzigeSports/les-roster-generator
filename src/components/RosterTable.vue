<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Player, Hero, HeroesByRole } from '../types/hero'

const props = defineProps<{
  players: Player[]
  roles: string[]
  heroesByRole: HeroesByRole
}>()

const emit = defineEmits<{
  'add-player': []
  'remove-player': [index: number]
  'move-player': [fromIndex: number, toIndex: number]
  'reset-roster': []
  'drop-hero': [playerIndex: number, role: string]
  'add-hero-obj': [playerIndex: number, role: string, hero: Hero]
  'remove-hero': [playerIndex: number, role: string, heroIndex: number]
}>()

const searchState = ref<{
  pIndex: number
  role: string
  query: string
  selectedIndex: number
} | null>(null)

const filteredHeroes = computed(() => {
  if (!searchState.value) return []
  const { role, query } = searchState.value

  let key: 'tank' | 'damage' | 'support' = 'tank'
  if (role.toLowerCase().includes('tank')) key = 'tank'
  else if (role.toLowerCase().includes('dps')) key = 'damage'
  else if (role.toLowerCase().includes('support')) key = 'support'

  const hList = props.heroesByRole?.[key] || []
  if (!query) return hList.sort((a, b) => a.name.localeCompare(b.name))

  return hList
    .filter((h: Hero) => h.name.toLowerCase().startsWith(query.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name))
})

const selectHero = (hero: Hero) => {
  if (searchState.value) {
    emit('add-hero-obj', searchState.value.pIndex, searchState.value.role, hero)
    searchState.value = null
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (!searchState.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (filteredHeroes.value.length > 0) {
      searchState.value.selectedIndex = (searchState.value.selectedIndex + 1) % filteredHeroes.value.length
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (filteredHeroes.value.length > 0) {
      searchState.value.selectedIndex = (searchState.value.selectedIndex - 1 + filteredHeroes.value.length) % filteredHeroes.value.length
    }
  } else if (e.key === 'Enter' && filteredHeroes.value.length > 0) {
    const hero = filteredHeroes.value[searchState.value.selectedIndex]
    if (hero) selectHero(hero)
    const target = e.target as HTMLInputElement
    target.value = ''
    target.blur()
  } else if (e.key === 'Escape') {
    searchState.value = null
    const target = e.target as HTMLInputElement
    target.blur()
  }
}

const canAddHero = (player: Player, role: string) => {
  const count = player.heroes[role]?.length || 0
  const max = role.includes('HYBRID') ? 2 : 3
  return count < max
}

const searchPosition = ref({ top: 0, left: 0, width: 0, height: 0 })

const openSearch = (pIndex: number, role: string, event: MouseEvent) => {
  searchState.value = { pIndex, role, query: '', selectedIndex: 0 }
  
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
    const input = document.querySelector(`.search-input-${pIndex}-${role.replace(/\s+/g, '-')}`) as HTMLInputElement
    if (input) input.focus()
  })
}

const handleBlur = () => {
  // Delay to allow mousedown on suggestions to trigger first
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

const selectStatus = (player: Player, val: string) => {
  if (val === 'CUSTOM') {
    player.customStatus = true
    if (['', 'TRYOUT', 'IGL', 'MANAGER', 'CAPTAIN'].includes(player.status || '')) {
      player.status = '...'
    }
  } else {
    player.customStatus = false
    player.status = val
  }
  activeStatusDropdown.value = null
}

const handleOutsideInteraction = (e: Event) => {
  if (e instanceof MouseEvent) {
    const target = e.target as HTMLElement
    // Don't close if interacting with the toggle buttons or the menus themselves
    if (target.closest('.subtle-dropdown-btn') || 
        target.closest('.status-dropdown-menu') || 
        target.closest('.add-hero-btn') || 
        target.closest('.hero-search-overlay')) {
      return
    }
  }
  
  activeStatusDropdown.value = null
  searchState.value = null
}

import { onMounted, onUnmounted } from 'vue'

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
          @click="emit('reset-roster')"
          class="flex items-center text-lg gap-2 pl-3.5 pr-4 py-2 rounded justify-center cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
          style="color: #ff6700; background: transparent; border-color: rgba(255, 103, 0, 0.3);"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset
        </button>
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
          <th class="p-2 text-left w-32">Spieler</th>
          <th v-for="role in roles" :key="role" class="p-2 text-center min-w-[124px]">
            {{ role }}
          </th>
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
              class="bg-light-dark text-lg px-1.5 py-0.5 rounded w-32 text-white block outline-none border border-transparent focus:border-[#ff6700]/30"
            />
            <div class="flex flex-col gap-1 mt-1">
              <div class="relative w-32 status-dropdown">
                <button
                  @click.stop="toggleStatusDropdown(pIndex, $event)"
                  class="subtle-dropdown-btn group"
                >
                  <span class="truncate">{{ !player.status && !player.customStatus ? 'Status...' : (['TRYOUT', 'IGL', 'MANAGER', 'CAPTAIN'].includes(player.status || '') && !player.customStatus ? player.status : 'Custom') }}</span>
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
                      :class="{ 'active': ((!opt && !player.status && !player.customStatus) || (opt === player.status && !player.customStatus) || (opt === 'CUSTOM' && player.customStatus)) }"
                    >
                      {{ opt || 'Keine Auswahl' }}
                    </div>
                  </div>
                </Teleport>
              </div>
              <input
                v-if="player.customStatus || (player.status && !['', 'TRYOUT', 'IGL', 'MANAGER', 'CAPTAIN'].includes(player.status))"
                v-model="player.status"
                type="text"
                placeholder="Benutzerdefinierter Status..."
                class="bg-light-dark px-1.5 py-1 rounded w-32 text-gray-300 text-[10px] border border-white/5 italic outline-none focus:border-[#ff6700]/30"
              />
            </div>
          </td>
          <td
            v-for="role in roles"
            :key="role"
            class="p-2 relative"
            @dragover.prevent
            @drop="emit('drop-hero', pIndex, role)"
          >
            <TransitionGroup
              name="hero-item"
              tag="div"
              class="flex gap-1 justify-center min-h-16 items-center bg-light-dark/40 rounded p-1.5 min-w-[130px] relative"
            >
              <div
                v-for="(hero, hIndex) in player.heroes[role] || []"
                :key="hero.key"
                class="relative group cursor-pointer"
                @click="emit('remove-hero', pIndex, role, hIndex)"
              >
                <img
                  :src="hero.portrait"
                  :alt="hero.name"
                  class="w-10 h-10 rounded border border-white/10"
                />
                <div class="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity z-10">
                  <span class="text-white text-lg">×</span>
                </div>
              </div>

              <!-- Inline Search/Add -->
              <div v-if="canAddHero(player, role)" :key="'add-btn-' + role" class="flex items-center">
                <button
                  v-if="!(searchState?.pIndex === pIndex && searchState?.role === role)"
                  @click.stop="openSearch(pIndex, role, $event)"
                  class="add-hero-btn"
                  title="Held suchen"
                >
                  <span class="text-xl mb-0.25">+</span>
                </button>
                
                <Teleport to="body">
                  <div
                    v-if="searchState?.pIndex === pIndex && searchState?.role === role"
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
                        placeholder="Held suchen..."
                        :class="`search-input-${pIndex}-${role.replace(/\s+/g, '-')}`"
                        class="hero-search-input"
                        :value="searchState.query"
                        @input="(e: any) => searchState!.query = e.target.value"
                        @keydown="handleKeyDown"
                        @blur="handleBlur"
                      />

                      <div v-if="searchState.query" class="hero-suggestions-list">
                        <div
                          v-for="(hero, idx) in filteredHeroes"
                          :key="hero.key"
                          @mousedown.prevent="selectHero(hero)"
                          class="hero-suggestion-item"
                          :class="{ 'active': searchState.selectedIndex === idx }"
                        >
                          <img :src="hero.portrait" :alt="hero.name" class="hero-suggestion-img" />
                          <span class="hero-suggestion-name">{{ hero.name }}</span>
                        </div>
                        <div v-if="filteredHeroes.length === 0" class="p-3 text-[10px] text-gray-500 text-center uppercase font-bold">
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
