<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PrivacyModal from './components/PrivacyModal.vue'
import ToastContainer from './components/ToastContainer.vue'
import BackgroundSVG from './assets/backgrounds/LES_WALLPAPER_2024.svg'

const showPrivacy = ref(false)
const route = useRoute()

const wrapperStyle = computed(() => {
  if (route.name === 'home' || route.path === '/') {
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), url(${BackgroundSVG})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: '#000'
    }
  }
  return {
    backgroundColor: '#000'
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col relative" :style="wrapperStyle">
    <ToastContainer />
    <PrivacyModal :show="showPrivacy" @close="showPrivacy = false" />
    
    <main class="flex-grow flex flex-col">
      <router-view />
    </main>
  
    <div class="flex flex-col items-center pb-8 z-10">
      <p v-if="route.name === 'home' || route.path === '/'" 
         class="text-[10px] tracking-widest opacity-30 mb-4 px-8 text-center" 
         style="color: #e5e5e5; font-family: 'Geom Graphic W03 Regular Italic', sans-serif; text-wrap: balance;">
        Inoffizielles Community-Projekt. Alle Logos & Spiel-Inhalte sind Eigentum von Blizzard Entertainment, Riot Games & Ubisoft Entertainment.
      </p>
      
      <a href="https://github.com/LeipzigeSports/les-roster-generator" target="_blank" class="flex items-center gap-2 mb-2 hover:opacity-100 transition-opacity opacity-40 mt-2" style="color: #e5e5e5;">
        <svg height="18" width="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <span class="text-[11px] uppercase tracking-wider" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">GitHub Repository</span>
      </a>

      <div class="flex gap-4 mt-2 text-sm font-bold uppercase" style="color: #ff6700; opacity: 0.67;">
        <a href="https://leipzigesports.de/impressum" target="_blank" class="hover:underline cursor-pointer">Impressum</a>
        <span style="opacity: 0.3; color: #e5e5e5; font-weight: normal;">|</span>
        <button @click="showPrivacy = true" class="hover:underline cursor-pointer uppercase" style="background:none; border:none; padding:0; color: inherit; font-size:inherit; font-weight: inherit;">Datenschutz</button>
      </div>
    </div>

  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #000;
  overflow-x: hidden;
}
</style>
