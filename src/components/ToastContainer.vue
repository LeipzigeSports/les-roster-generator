<script setup lang="ts">
import { useToast } from '../composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="px-5 py-4 rounded-lg shadow-2xl flex items-center justify-between gap-4 pointer-events-auto border min-w-[300px]"
        :style="{
          backgroundColor: toast.type === 'success' ? '#1a1a1a' : '#2b1111',
          borderColor: toast.type === 'success' ? '#ff6700' : '#ff4444',
          color: '#e5e5e5'
        }"
      >
        <div class="flex items-center gap-3">
          <!-- Checkmark Icon -->
          <svg v-if="toast.type === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-[#ff6700]" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <!-- Error Icon -->
          <svg v-if="toast.type === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-[#ff4444]" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span class="font-bold text-[13px] uppercase" style="font-family: 'Geom Graphic W03 Bold Italic', sans-serif;">{{ toast.message }}</span>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(50px);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
