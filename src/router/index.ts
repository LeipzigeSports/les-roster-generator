import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import OverwatchView from '../views/OverwatchView.vue'
import LolView from '../views/LolView.vue'
import R6View from '../views/R6View.vue'

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
    },
    {
      path: '/r6',
      name: 'r6',
      component: R6View
    }
  ],
})

export default router
