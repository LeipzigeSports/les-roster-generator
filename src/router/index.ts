import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import OverwatchView from '../views/OverwatchView.vue'
import LolView from '../views/LolView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/ow',
      name: 'overwatch',
      component: OverwatchView
    },
    {
      path: '/lol',
      name: 'league',
      component: LolView
    }
  ],
})

export default router
