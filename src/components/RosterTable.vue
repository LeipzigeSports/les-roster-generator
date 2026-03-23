<script setup lang="ts">
import type { Player } from '../types/hero'

defineProps<{
  players: Player[]
  roles: string[]
}>()

const emit = defineEmits<{
  'add-player': []
  'remove-player': [index: number]
  'drop-hero': [playerIndex: number, role: string]
  'remove-hero': [playerIndex: number, role: string, heroIndex: number]
}>()
</script>

<template>
  <div class="bg-gray-800 p-6 rounded-lg mb-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">Roster</h2>
      <button
        @click="emit('add-player')"
        class="flex items-center gap-2 px-4 py-2 rounded text-white cursor-pointer"
        style="background-color: #ff6700"
      >
        <span>+</span> Spieler hinzufügen
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
        <tr>
          <th class="p-2 text-left">Spieler</th>
          <th v-for="role in roles" :key="role" class="p-2 text-center min-w-32">
            {{ role }}
          </th>
          <th class="p-2"></th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(player, pIndex) in players"
          :key="pIndex"
          class="border-t border-gray-700"
        >
          <td class="p-2">
            <input
              v-model="player.name"
              type="text"
              class="bg-gray-700 px-2 py-1 rounded w-32 text-white"
            />
          </td>
          <td
            v-for="role in roles"
            :key="role"
            class="p-2"
            @dragover.prevent
            @drop="emit('drop-hero', pIndex, role.split(' ')[1] ?? role)"
          >
            <div class="flex gap-1 justify-center min-h-14 items-center bg-gray-700 rounded p-2">
              <div
                v-for="(hero, hIndex) in player.heroes[role] || []"
                :key="hIndex"
                class="relative group cursor-pointer"
                @click="emit('remove-hero', pIndex, role, hIndex)"
              >
                <img
                  :src="hero.portrait"
                  :alt="hero.name"
                  class="w-12 h-12 rounded"
                />
                <div class="absolute inset-0 bg-red-500 opacity-0 group-hover:opacity-50 rounded flex items-center justify-center">
                  <span class="opacity-0 group-hover:opacity-100 text-white font-bold">×</span>
                </div>
              </div>
            </div>
          </td>
          <td class="p-2">
            <button
              @click="emit('remove-player', pIndex)"
              class="text-red-500 hover:text-red-400 font-bold text-xl cursor-pointer"
            >
              ×
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
