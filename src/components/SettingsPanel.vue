<script setup lang="ts">
defineProps<{
  teamName: string
  date: string
  isTransparentBg?: boolean
  isClassicLayout?: boolean
}>()

defineEmits<{
  'update:teamName': [value: string]
  'update:date': [value: string]
  'update:isTransparentBg': [value: boolean]
  'update:isClassicLayout': [value: boolean]
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
        
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              :checked="isClassicLayout"
              @change="$emit('update:isClassicLayout', ($event.target as HTMLInputElement).checked)"
              class="hidden"
            />
            <div class="w-6 h-6 rounded flex items-center justify-center border-2 transition-colors"
                 :class="isClassicLayout ? 'bg-[#ff6700] border-[#ff6700]' : 'bg-transparent border-gray-600 group-hover:border-[#ff6700]'">
              <svg v-if="isClassicLayout" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <span class="text-white opacity-80 group-hover:opacity-100 transition-opacity whitespace-nowrap">Helden dynamisch anordnen</span>
          </label>
          
          <div class="relative group/tooltip flex items-center justify-center ml-1">
            <div class="w-4 h-4 rounded-full border border-gray-500 text-gray-400 flex items-center justify-center text-[10px] cursor-help font-bold hover:text-[#ff6700] hover:border-[#ff6700] transition-colors">?</div>
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-100 bg-[#1a1a1a] border border-white/10 text-gray-300 text-sm p-3 rounded shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 pointer-events-none leading-relaxed">
              Hebt die feste Zentrierung der Hybrid-Rolle auf. Die Hybrid-Helden werden nicht mehr exakt mittig in der Spalte platziert, sondern verteilen sich dynamisch anhand der Anzahl gewählter Main- und Flex-Helden.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
