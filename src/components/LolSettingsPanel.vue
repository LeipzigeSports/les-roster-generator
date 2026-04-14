<script setup lang="ts">
defineProps<{
  teamName: string
  date: string
  isTransparentBg?: boolean
}>()

defineEmits<{
  'update:teamName': [value: string]
  'update:date': [value: string]
  'update:isTransparentBg': [value: boolean]
}>()
</script>

<template>
  <div class="bg-dark p-6 rounded-lg mb-8">
    <div class="flex flex-wrap gap-6 items-end -mt-1">
      <div class="flex-1 min-w-[200px]">
        <label class="block mb-2 text-4 text-lg font-bold capitalize" style="color: #ff6700; font-family: 'Geom Graphic W03 Regular Italic', sans-serif;">Team Name</label>
        <input
          :value="teamName"
          @input="$emit('update:teamName', ($event.target as HTMLInputElement).value)"
          type="text"
          class="w-full bg-light-dark px-4 py-2 rounded text-white outline-none border border-transparent focus:border-[#ff6700]/30"
        />
      </div>
      <div class="flex-1 min-w-[200px]">
        <label class="block mb-2 text-lg font-bold capitalize" style="color: #ff6700; font-family: 'Geom Graphic W03 Regular Italic', sans-serif;">Datum</label>
        <input
          :value="date"
          @input="$emit('update:date', ($event.target as HTMLInputElement).value)"
          type="date"
          class="w-full bg-light-dark px-4 py-2 rounded text-white outline-none border border-transparent focus:border-[#ff6700]/30"
          style="color-scheme: dark;"
        />
      </div>
      <div class="pb-2 flex flex-col gap-2">
        <label class="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            :checked="isTransparentBg"
            @change="$emit('update:isTransparentBg', ($event.target as HTMLInputElement).checked)"
            class="hidden"
          />
          <div class="w-6 h-6 rounded flex items-center justify-center border-2 transition-colors"
               :class="isTransparentBg ? 'bg-[#ff6700] border-[#ff6700]' : 'bg-transparent border-gray-600 group-hover:border-[#ff6700]'">
            <svg v-if="isTransparentBg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span class="text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Transparenter Hintergrund <span class="text-xs opacity-50 ml-1">(für PNG Export)</span></span>
        </label>
      </div>
    </div>
  </div>
</template>
