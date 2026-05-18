<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js'

const router = useRouter()
const siteLanguage = inject('siteLanguage')

// Helpers globales de traducción
const lbl = (key) => getLabel(key, siteLanguage.value)
const t = (item, field) => getTranslatedContent(item, field, siteLanguage.value)

const cards = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const activeSector = ref('all')

// Diccionario reactivo local para la página de Network
const localLabels = computed(() => {
  if (siteLanguage.value === 'Danish') {
    return {
      searchPlaceholder: "Søg efter navn, sektor, placering...",
      allSectors: "Alle sektorer",
      loadingMembers: "Indlæser medlemmer...",
      noMembers: "Ingen medlemmer fundet."
    }
  } else if (siteLanguage.value === 'German') {
    return {
      searchPlaceholder: "Suche nach Name, Branche, Standort...",
      allSectors: "Alle Branchen",
      loadingMembers: "Mitglieder werden geladen...",
      noMembers: "Keine Mitglieder gefunden."
    }
  } else {
    return {
      searchPlaceholder: "Search by name, sector, location...",
      allSectors: "All Sectors",
      loadingMembers: "Loading members...",
      noMembers: "No members found."
    }
  }
})

const slugify = (value = '') => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

const formatLabel = (value = '') => {
  return String(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const normalize = (item) => {
  const acf = item.acf || {}
  const logoField = acf.logo_ || acf.logo || null
  const logoUrl = logoField && (logoField.url || logoField.sourceUrl || (logoField.sizes && (logoField.sizes.medium || logoField.sizes.medium_large || logoField.sizes.large))) || ''
  const title = (item.title && item.title.rendered) ? item.title.rendered : (item.title || '')
  const phoneNumber = acf.phone_number || acf.phoneNumber || acf.phone || ''
  const companyType = item.company_type || acf.company_type || []
  const location = acf.location || ''
  const classList = Array.isArray(item.class_list) ? item.class_list : []
  
  // Extraemos las etiquetas de los sectores desde la lista de clases de WP
  let companyTypeLabels = []
  classList.forEach(cls => {
    if (cls.startsWith('company_type-') && cls !== 'company_type-company' && cls !== 'company_type-institution') {
      const typeName = cls.replace('company_type-', '')
      companyTypeLabels.push(formatLabel(typeName))
    }
  })
  
  if (companyTypeLabels.length === 0) {
    companyTypeLabels = ['General']
  }
  
  return {
    id: item.id || item.databaseId || null,
    title,
    acf,
    logoUrl,
    phoneNumber,
    companyType,
    location,
    companyTypeLabels,
    rawItem: item // Guardamos la referencia cruda para el bypass del idioma nativo
  }
}

const sectors = computed(() => {
  const unique = new Set()
  cards.value.forEach(card => {
    card.companyTypeLabels.forEach(label => {
      unique.add(slugify(label))
    })
  })
  return ['all', ...Array.from(unique)]
})

const filteredCards = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return cards.value.filter((card) => {
    const title = (card.title || '').toLowerCase()
    const location = (card.location || '').toLowerCase()
    const bySearch = !query || title.includes(query) || location.includes(query)
    const bySector = activeSector.value === 'all' || card.companyTypeLabels.some(label => slugify(label) === activeSector.value)
    return bySearch && bySector
  })
})

onMounted(async () => {
  try {
    const uniqueCards = []
    const seenKeys = new Set()
    const perPage = 50
    let page = 1
    const cacheBuster = Date.now() // Saltamos la caché interna de red

    while (true) {
      const res = await axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/databasecard?per_page=${perPage}&page=${page}&acf_format=standard&v=${cacheBuster}`)
      const pageItems = Array.isArray(res.data) ? res.data : []

      if (pageItems.length === 0) {
        break
      }

      for (const item of pageItems) {
        const normalized = normalize(item)
        const key = normalized.id || normalized.title
        if (!seenKeys.has(key)) {
          seenKeys.add(key)
          uniqueCards.push(normalized)
        }
      }

      if (pageItems.length < perPage) {
        break
      }

      page += 1
    }

    cards.value = uniqueCards
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">
        {{ lbl('nav.network') }}
      </h1>
    </div>
    <div class="col-span-12 md:col-span-7">
      <p class="text-off-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        {{ lbl('about.hero_subtitle') }}
      </p>
    </div>
  </section>

  <div class="basegrid py-12">
    <div class="col-span-12 mb-10" v-if="!loading && !error">
      <div class="relative max-w-sm mb-8">
        <span class="absolute inset-y-0 left-3 flex items-center">
          <svg class="w-5 h-5 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </span>
        <input v-model="searchQuery" type="text" :placeholder="localLabels.searchPlaceholder" 
          class=" text-blue w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>

      <p class="text-blue mb-4 text-sm font-medium">{{ lbl('general.filterBy') }}</p>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="sector in sectors"
          :key="sector"
          @click="activeSector = sector"
          :class="activeSector === sector ? 'bg-semi-dark-blue text-white' : 'bg-white border border-gray-200 text-blue'"
          class="px-4 py-2 rounded-xl transition-all text-sm hover:bg-semi-dark-blue hover:text-white"
        >
          {{ sector === 'all' ? localLabels.allSectors : formatLabel(sector) }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 col-span-12">
      <div v-if="loading" class="col-span-12 text-center py-20 text-gray-500">{{ localLabels.loadingMembers }}</div>
      <div v-else-if="error" class="col-span-12 text-center py-20 text-red-600">Failed to load members: {{ error }}</div>

      <template v-else>
        <router-link 
          v-for="card in filteredCards" 
          :key="card.id" 
          :to="`/network/${card.id}`"
          class="flex flex-col border border-gray-200 rounded-lg p-4 bg-white cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all"
        >
          <div class="flex gap-4 mb-3">
            <div class="w-22 h-22 rounded-full border border-gray-300 shrink-0 flex items-center justify-center bg-white">
              <img :src="card.logoUrl || 'https://via.placeholder.com/80'" :alt="siteLanguage === 'English' ? card.title : t(card.rawItem, 'title')" class="w-full h-full object-contain rounded-full" />
            </div>
            
            <div class="flex-1 min-w-0 items-center">
              <h3 class="text-base font-bold text-dark-blue mb-1" v-html="siteLanguage === 'English' ? card.title : t(card.rawItem, 'title')"></h3>
              
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" class="flex-shrink-0">
                  <g fill="none" fill-rule="evenodd">
                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
                    <path fill="#0D1B2A" d="M12 2a9 9 0 0 1 9 9c0 3.074-1.676 5.59-3.442 7.395a20.4 20.4 0 0 1-2.876 2.416l-.426.29l-.2.133l-.377.24l-.336.205l-.416.242a1.87 1.87 0 0 1-1.854 0l-.416-.242l-.52-.32l-.192-.125l-.41-.273a20.6 20.6 0 0 1-3.093-2.566C4.676 16.589 3 14.074 3 11a9 9 0 0 1 9-9m0 2a7 7 0 0 0-7 7c0 2.322 1.272 4.36 2.871 5.996a18 18 0 0 0 2.222 1.91l.458.326q.222.155.427.288l.39.25l.343.209l.289.169l.455-.269l.367-.23q.293-.186.627-.417l.458-.326a18 18 0 0 0 2.222-1.91C17.728 15.361 19 13.322 19 11a7 7 0 0 0-7-7m0 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4"/>
                  </g>
                </svg>
                <p class="text-sm text-gray-600">
                  {{ siteLanguage === 'English' ? (card.location || 'DE-DK Region') : (t(card.rawItem, 'location') || 'DE-DK Region') }}
                </p>
              </div>
              
              <div class="flex gap-2 mt-2 flex-wrap">
                <span v-for="type in card.companyTypeLabels" :key="type" class="px-3 py-1 text-xs rounded-lg border border-gray-300 bg-white text-gray-700">{{ type }}</span>
              </div>
            </div>
          </div>
        </router-link>

        <div v-if="filteredCards.length === 0" class="col-span-12 text-center py-20 text-blue">{{ localLabels.noMembers }}</div>
      </template>
    </div>
  </div>
</template>