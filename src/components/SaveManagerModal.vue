<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  savedTeams: any[]
  currentTeamName: string
}>()

const emit = defineEmits<{
  'close': []
  'save': [name: string]
  'load': [id: string]
  'delete': [id: string]
  'export': []
  'import': [event: Event]
  'download-image': []
  'copy-image': []
}>()

const newSaveName = ref('')

watch(() => props.show, (newVal) => {
  if (newVal) {
    newSaveName.value = props.currentTeamName !== 'Team Name' ? props.currentTeamName : ''
  }
})

const handleSave = () => {
  const nameToSave = newSaveName.value.trim() || 'Unbenanntes Team'
  emit('save', nameToSave)
  newSaveName.value = ''
}

const formatDate = (timestamp: number) => {
  const d = new Date(timestamp)
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div v-if="show" class="help-modal z-50 fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm" @click.self="emit('close')">
    <div class="help-content bg-[#151515] border border-white/10 rounded-xl p-8 max-w-2xl w-full mx-4 overflow-y-auto max-h-[85vh] shadow-2xl relative">
      <!-- Close Button Top Right -->
      <button @click="emit('close')" class="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>

      <h2 class="bold text-4xl mb-6" style="color: #ff6700; font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">Team-Daten verwalten</h2>
      
      <div class="space-y-8 text-lg">
        <!-- Browser Speicherung Section -->
        <section>
          <h3 class="font-bold text-xl mb-4 text-white">Gespeicherte Teams (Browser)</h3>
          <p class="text-xs text-white/40 mb-4 flex items-start gap-1.5">
            <svg class="shrink-0 mt-0.5" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            Speicherstände werden im Browser-Cache gespeichert und gehen beim Leeren des Caches verloren. Zur dauerhaften Sicherung bitte den Datei-Export unter „Manuelles Backup" verwenden.
          </p>
          
          <!-- Save New Team -->
          <div class="mb-6 bg-white/5 p-6 rounded-lg border border-white/10">
            <div class="flex flex-col gap-2">
              <label class="text-sm uppercase tracking-wider text-white/50" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
                Aktuelles Roster speichern
              </label>
              <div class="flex gap-4">
                <input 
                  type="text" 
                  v-model="newSaveName"
                  placeholder="Name für den Speicherstand..."
                  class="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#ff6700] transition-colors"
                  @keyup.enter="handleSave"
                />
                <button 
                  @click="handleSave" 
                  class="px-8 py-3 rounded-lg border transition-all uppercase text-sm tracking-wider cursor-pointer flex items-center justify-center bg-[#ff6700] hover:bg-[#ff8533] text-black border-transparent"
                  style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;"
                >
                  <span class="mb-[2px]">Speichern</span>
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="savedTeams.length === 0" class="text-white/50 italic p-6 text-center border border-white/5 border-dashed rounded-lg">
            Noch keine Teams im Browser gespeichert.
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="team in savedTeams" 
              :key="team.id"
              class="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div class="flex flex-col">
                <span class="font-bold text-white">{{ team.name }}</span>
                <span class="text-sm text-white/50">{{ formatDate(team.dateSaved) }}</span>
              </div>
              
              <div class="flex gap-2">
                <button 
                  @click="emit('load', team.id)" 
                  class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded font-bold text-sm uppercase tracking-wider cursor-pointer flex items-center gap-2"
                  title="Team laden"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                  Laden
                </button>
                <button 
                  @click="emit('delete', team.id)" 
                  class="p-2 bg-transparent hover:bg-white/10 text-white/40 hover:text-white/80 rounded cursor-pointer transition-colors"
                  title="Löschen"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Export & Import -->
        <section class="border-t border-white/10 pt-8 mt-8">
          <h3 class="font-bold text-xl mb-4 text-white">Manuelles Backup (Datei)</h3>
          <div class="flex gap-4">
            <button @click="emit('export')" class="flex-1 p-4 rounded-lg border transition-all uppercase text-sm tracking-wider cursor-pointer flex items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white text-white" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[2px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span class="mb-[2px]">In Datei Exportieren</span>
            </button>
            <button @click="($refs.fileInput as HTMLInputElement).click()" class="flex-1 p-4 rounded-lg border transition-all uppercase text-sm tracking-wider cursor-pointer flex items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white text-white" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[2px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span class="mb-[2px]">Aus Datei Importieren</span>
            </button>
            <input ref="fileInput" type="file" accept=".json" class="hidden" @change="(e) => emit('import', e)" />
          </div>
        </section>

        <!-- Grafik Export -->
        <section class="border-t border-white/10 pt-8 mt-8">
          <h3 class="font-bold text-xl mb-4 text-white">Grafik Export</h3>
          <div class="flex gap-4">
            <button @click="emit('download-image')" class="flex-1 p-4 rounded-lg border transition-all uppercase text-sm tracking-wider cursor-pointer flex items-center justify-center gap-2 bg-[#ff6700] hover:bg-[#ff8533] text-black border-transparent" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[2px]"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span class="mb-[2px]">Als PNG speichern</span>
            </button>
            <button @click="emit('copy-image')" class="flex-1 p-4 rounded-lg border transition-all uppercase text-sm tracking-wider cursor-pointer flex items-center justify-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:border-white text-white" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-[2px]"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span class="mb-[2px]">Grafik kopieren</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-modal {
  z-index: 10000;
}
.help-content::-webkit-scrollbar {
  width: 8px;
}
.help-content::-webkit-scrollbar-track {
  background: #151515;
}
.help-content::-webkit-scrollbar-thumb {
  background: #ff6700;
  border-radius: 4px;
}
</style>
