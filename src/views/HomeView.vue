<script setup lang="ts">
import { useRouter } from 'vue-router'
import LogoIcon from '@/assets/icons/LES_ICON-ORANGE.png'

const router = useRouter()
</script>

<template>
  <div class="flex-grow p-8 flex flex-col items-center justify-center">
    <div class="text-center mb-16">
      <img :src="LogoIcon" alt="LES Logo" class="w-48 h-48 mx-auto mb-8" />
      <h1 class="text-6xl bold uppercase" style="color: #e5e5e5; line-height: 1.1">
        LES Roster Generator
      </h1>
      <p class="text-xl mt-4 opacity-50" style="font-family: 'Geom Graphic W03 Regular Italic', sans-serif;">Wähle dein Spiel</p>
    </div>

    <div class="flex gap-8 flex-wrap justify-center max-w-4xl">
      <!-- Overwatch Card -->
      <div 
        @click="router.push('/ow')"
        class="game-card cursor-pointer group flex flex-col items-center justify-center p-8 rounded-xl border border-white/10 transition-all w-80 h-96 hover:border-[#ff6700]"
      >
        <div class="mb-8 p-6 bg-white/5 rounded-full group-hover:scale-110 transition-transform flex items-center justify-center">
          <img 
            src="https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/5/55/Overwatch_circle_logo.svg" 
            alt="OW" 
            class="w-32 h-32 opacity-90 group-hover:opacity-100 transition-opacity" 
            style="filter: brightness(0) invert(1);"
          />
        </div>
        <h2 class="text-3xl bold uppercase text-[#e5e5e5] text-center leading-[0.95]">Overwatch</h2>
      </div>

      <!-- League of Legends Card -->
      <div 
        @click="router.push('/lol')"
        class="game-card cursor-pointer group flex flex-col items-center justify-center p-8 rounded-xl border border-white/10 transition-all w-80 h-96 hover:border-[#ff6700]"
      >
        <div class="mb-8 p-6 bg-white/5 rounded-full group-hover:scale-110 transition-transform flex items-center justify-center">
          <img 
            src="https://cdn.simpleicons.org/leagueoflegends/white" 
            alt="LoL" 
            class="w-30 h-30 opacity-80 group-hover:opacity-100 transition-opacity" 
            style="filter: brightness(0) invert(1);"
          />
        </div>
        <h2 class="text-3xl bold uppercase text-[#e5e5e5] text-center leading-[0.95]">League of Legends</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-card {
  background-color: rgba(21, 21, 21, 0.75);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  backdrop-filter: blur(8px);
}
.game-card:hover {
  background-color: rgba(255, 103, 0, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(0,0,0,0.8);
}
</style>
