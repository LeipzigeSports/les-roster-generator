import { ref, onMounted } from 'vue'
import type { Champion } from '../types/champion'

export function useChampions() {
  const champions = ref<Champion[]>([])
  const loading = ref<boolean>(true)
  const currentVersion = ref<string>('')
  
  const loadChampions = async () => {
    try {
      loading.value = true
      
      // 1. Fetch latest Data Dragon version
      const versionRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json')
      const versions = await versionRes.json()
      currentVersion.value = versions[0] // versions[0] is always the most recent patch
      
      // 2. Fetch Champion Master List (de_DE translation if possible, or en_US)
      const dataRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${currentVersion.value}/data/de_DE/champion.json`)
      const dataJson = await dataRes.json()
      
      const champsData = dataJson.data
      const parsedChamps: Champion[] = []
      
      for (const key in champsData) {
        const champ = champsData[key]
        parsedChamps.push({
          id: champ.id,
          key: champ.key,
          name: champ.name,
          title: champ.title,
          tags: champ.tags,
          image: champ.image,
          // 3. Automatically construct portrait CDN URL using the dynamic version chunk
          portraitUrl: `https://ddragon.leagueoflegends.com/cdn/${currentVersion.value}/img/champion/${champ.id}.png`
        })
      }
      
      // Sort Champions alphabetically by localized name
      champions.value = parsedChamps.sort((a, b) => a.name.localeCompare(b.name))
      
    } catch (error) {
      console.error('Error loading LoL champions API:', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadChampions()
  })

  return {
    champions,
    loading,
    currentVersion
  }
}
