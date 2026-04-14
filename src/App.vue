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
        Inoffizielles Community-Projekt. Alle Logos & Spiel-Inhalte sind Eigentum von Blizzard Entertainment & Riot Games.
      </p>
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
