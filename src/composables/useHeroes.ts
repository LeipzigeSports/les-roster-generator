import { ref, computed, onMounted, type Ref, type ComputedRef } from 'vue'
import type { Hero, HeroesByRole } from '../types/hero'

interface UseHeroesReturn {
  heroes: Ref<Hero[]>
  loading: Ref<boolean>
  heroesByRole: ComputedRef<HeroesByRole>
}

export function useHeroes(): UseHeroesReturn {
  const heroes = ref<Hero[]>([])
  const loading = ref<boolean>(true)

  const heroesByRole = computed<HeroesByRole>(() => {
    const grouped: HeroesByRole = {
      tank: [],
      damage: [],
      support: []
    }

    heroes.value.forEach((hero: Hero) => {
      const role = hero.role as keyof HeroesByRole
      if (grouped[role]) {
        grouped[role].push(hero)
      }
    })

    return grouped
  })

  const loadHeroes = async (): Promise<void> => {
    try {
      const response = await fetch('https://overfast-api.tekrop.fr/heroes')
      heroes.value = await response.json()
    } catch (error) {
      console.error('Error loading heroes:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadHeroes()
  })

  return {
    heroes,
    loading,
    heroesByRole
  }
}
