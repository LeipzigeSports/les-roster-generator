<script setup lang="ts">
import { ref } from 'vue'
const showHelp = ref(false)
</script>

<template>
  <div class="fixed top-4 right-4 z-[100]">
    <!-- Help Button with icon-like label -->
    <button 
      @click="showHelp = true" 
      class="help-btn flex items-center justify-center gap-2 hover:scale-105 transition-transform"
      style="background-color: #ff6700; color: #151515; border-radius: 999px; width: 48px; height: 48px; font-family: 'Geom Graphic W03 Bold Italic', sans-serif; cursor: pointer; border: none; font-size: 24px; box-shadow: 0 4px 12px rgba(255,103,0,0.4);"
    >
      ?
    </button>

    <!-- Modal Background -->
    <Transition name="fade">
      <div v-if="showHelp" class="help-modal" @click.self="showHelp = false">
        <!-- Modal Content -->
        <div class="help-content overflow-y-auto max-h-[90vh]">
          
          <div class="flex justify-between items-center mb-10 border-b border-white/10 pb-4">
            <h2 class="bold text-4xl" style="color: #ff6700; font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">HILFE & ANLEITUNG</h2>
            <button @click="showHelp = false" class="text-3xl opacity-50 hover:opacity-100 transition-opacity cursor-pointer">✕</button>
          </div>

          <div class="grid gap-x-12 gap-y-10">
            <!-- Step 1 -->
            <div class="flex gap-6 items-start group">
              <div class="w-12 h-12 flex-shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-[#ff6700] transition-colors">
                <span class="text-2xl bold text-[#ff6700]">1</span>
              </div>
              <div class="flex-grow">
                <h2 class="bold text-xl mb-1" style="color: #e5e5e5">Titel & Einstellungen</h2>
                <p class="opacity-70">Passe Teamnamen und Datum oben an. Mit der Option <strong>"Transparenter Hintergrund"</strong> kannst du den Hintergrund der Grafik bei Bedarf deaktivieren.</p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-6 items-start group">
              <div class="w-12 h-12 flex-shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-[#ff6700] transition-colors">
                <span class="text-2xl bold text-[#ff6700]">2</span>
              </div>
              <div class="flex-grow">
                <h3 class="bold text-xl mb-1" style="color: #e5e5e5">Helden zuweisen</h3>
                <p class="opacity-70">Nutze <strong>Drag & Drop</strong> aus dem Pool oben oder klicke auf das 
                  <span class="inline-flex items-center justify-center px-1 py-1 bg-white/5 rounded border border-white/10 align-middle -mt-1 mr-1">
                    <span class="text-lg" style="color: #e5e5e5; line-height: 1; font-family: 'Geom Graphic W03 Bold Italic', sans-serif; font-size: 1.1rem;">+</span>
                  </span>
                  <strong>Plus</strong> in einer Tabellenzelle, um Helden hinzuzufügen. Ein Klick auf ein bereits zugewiesenes Bild entfernt dieses wieder.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex gap-6 items-start group">
              <div class="w-12 h-12 flex-shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-[#ff6700] transition-colors">
                <span class="text-2xl bold text-[#ff6700]">3</span>
              </div>
              <div class="flex-grow">
                <h3 class="bold text-xl mb-1" style="color: #e5e5e5">Roster verwalten</h3>
                <p class="opacity-70">Sortiere Spieler über den 
                  <span class="inline-flex items-center gap-1.5 align-middle px-1.5 py-1.5 bg-white/5 rounded border border-white/10 -mt-1">
                    <svg width="8" height="11" viewBox="1 1 8 12" fill="#e5e5e5"><circle cx="2" cy="2" r="1.5"/><circle cx="8" cy="2" r="1.5"/><circle cx="2" cy="7" r="1.5"/><circle cx="8" cy="7" r="1.5"/><circle cx="2" cy="12" r="1.5"/><circle cx="8" cy="12" r="1.5"/></svg>
                  </span> 
                  <strong> Griff</strong> um und lege über das <strong>Status-Menü</strong> Rollen fest. Markiere zudem Charaktere als <strong>Main</strong>, indem du oben rechts auf den 
                  <span class="inline-flex items-center justify-center px-0.5 py-1.5 bg-white/5 rounded border border-white/10 align-middle -mt-1 mr-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#e5e5e5"><path d="M12 1.7L15 8.3L22.2 9.3L17 14.3L18.2 21.5L12 18L5.8 21.5L7 14.3L1.8 9.3L9 8.3L12 1.7Z" /></svg>
                  </span>
                  <strong>Stern</strong> klickst (erscheint beim Hovern). Alle Änderungen werden automatisch im Browser gespeichert.
                </p>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="flex gap-6 items-start group">
              <div class="w-12 h-12 flex-shrink-0 bg-white/5 rounded-lg flex items-center justify-center border border-white/20 group-hover:border-[#ff6700] transition-colors">
                <span class="text-2xl bold text-[#ff6700]">4</span>
              </div>
              <div class="flex-grow">
                <h3 class="bold text-xl mb-1" style="color: #e5e5e5">Export & Teilen</h3>
                <p class="opacity-70">Klicke auf <strong>"Grafik speichern"</strong> zum Download oder auf <strong>"Grafik kopieren"</strong>, um das Bild direkt in die Zwischenablage zu übernehmen.</p>
              </div>
            </div>
          </div>

          <div class="mt-12 flex pt-6 border-t border-white/10 justify-center mr-2">
            <button 
              @click="showHelp = false" 
              class="flex items-center justify-center px-12 py-3 rounded-md text-xl cursor-pointer hover:scale-105 transition-all">
              ALLES KLAR!
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.help-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
