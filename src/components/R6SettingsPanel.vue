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
  'manage-data': []
  'share': []
  'reset': []
}>()
</script>

<template>
  <div class="bg-dark p-6 rounded-lg mb-8">
    <!-- Action Menu Bar -->
    <div class="flex justify-start gap-4 mb-6 pb-6 border-b border-white/5">
      <button @click="$emit('manage-data')" class="px-6 py-3 rounded text-sm uppercase tracking-wider transition-all border border-[#ff6700]/30 hover:border-[#ff6700] text-[#ff6700] bg-[#ff6700]/10 hover:bg-[#ff6700]/20 flex items-center gap-2 cursor-pointer" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[2px]"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
        <span class="mb-[2px]">Speichern & Laden</span>
      </button>

      <button @click="$emit('share')" class="px-6 py-3 rounded text-sm uppercase tracking-wider transition-all border border-white/10 hover:border-white/40 text-white/70 hover:text-white bg-white/5 hover:bg-white/10 flex items-center gap-2 cursor-pointer" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[2px]"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        <span class="mb-[2px]">Teilen</span>
      </button>

      <button
        @click="$emit('reset')"
        class="flex items-center text-sm uppercase tracking-wider gap-2 px-6 py-3 rounded justify-center cursor-pointer opacity-70 hover:opacity-100 transition-all hover:bg-[#ff6700]/10 ml-auto"
        style="color: #ff6700; background: transparent; border: 1px solid rgba(255, 103, 0, 0.3); font-family: 'Geom Graphic W03 Bold Italic', sans-serif;"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[2px]">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span class="mb-[2px]">Reset</span>
      </button>
    </div>

    <!-- General Settings -->
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
