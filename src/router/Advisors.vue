<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import axios from 'axios'
import { getLabel } from '../utils/translationFunction.js'

const siteLanguage = inject('siteLanguage')
const lbl = (key) => getLabel(key, siteLanguage.value)

const advisors = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const filterRole = ref('all')

const localLabels = computed(() => {
  if (siteLanguage.value === 'Danish') {
    return {
      heroSubtitle: "Få forbindelse til erfarne rådgivere, der hjælper dig med at navigere grænseoverskridende muligheder.",
      searchPlaceholder: "Søg efter navn, specialitet, lokation...",
      allRoles: "Alle specialiteter",
      yearsExp: "års erfaring",
      languagesLabel: "Sprog",
      locationLabel: "Lokation",
      emailBtn: "E-mail",
      callBtn: "Ring",
      noAdvisors: "Ingen rådgivere fundet.",
      loadingAdvisors: "Indlæser rådgivere..."
    }
  } else if (siteLanguage.value === 'German') {
    return {
      heroSubtitle: "Vernetzen Sie sich mit erfahrenen Beratern, die Ihnen helfen, grenzüberschreitende Möglichkeiten zu nutzen.",
      searchPlaceholder: "Nach Name, Spezialität, Standort suchen...",
      allRoles: "Alle Spezialitäten",
      yearsExp: "Jahre Erfahrung",
      languagesLabel: "Sprachen",
      locationLabel: "Standort",
      emailBtn: "E-Mail",
      callBtn: "Anrufen",
      noAdvisors: "Keine Berater gefunden.",
      loadingAdvisors: "Berater werden geladen..."
    }
  } else {
    return {
      heroSubtitle: "Connect with experienced advisors to help navigate cross-border opportunities.",
      searchPlaceholder: "Search by name, specialty, location...",
      allRoles: "All Specialties",
      yearsExp: "years experience",
      languagesLabel: "Languages",
      locationLabel: "Location",
      emailBtn: "Email",
      callBtn: "Call",
      noAdvisors: "No advisors found.",
      loadingAdvisors: "Loading advisors..."
    }
  }
})

const formatLanguages = (langs) => {
  if (!langs || langs.length === 0) return ''
  const langMap = {
    'German':  { English: 'German',  Danish: 'Tysk',   German: 'Deutsch' },
    'Danish':  { English: 'Danish',  Danish: 'Dansk',  German: 'Dänisch' },
    'English': { English: 'English', Danish: 'Engelsk', German: 'Englisch' }
  }
  return langs.map(l => langMap[l]?.[siteLanguage.value] || l).join(', ')
}

// Language-agnostic baseline extraction phase
const normalize = (item) => {
  const acf = item.acf || {}
  const imageField = acf.image || null
  const imageUrl = imageField && (
    imageField.url ||
    imageField.sourceUrl ||
    (imageField.sizes && (imageField.sizes.medium || imageField.sizes.large))
  ) || ''
  const title = item.title?.rendered || item.title || ''
  const languages = Array.isArray(acf.languages) ? acf.languages : []

  return {
    id: item.id || null,
    name: title,
    imageUrl,
    email: acf.email || '',
    phone: acf.phone_number || '',
    languages,
    acf
  }
}

// REACTIVE HUB: Swaps Role and Specialties instantly when language shifts
const localizedAdvisors = computed(() => {
  const lang = siteLanguage.value

  return advisors.value.map(advisor => {
    const acf = advisor.acf || {}

    // 1. Role Translation from WordPress ACF custom language fields
    let currentRole = acf.role || ''
    if (lang === 'Danish' && acf.role_dk) currentRole = acf.role_dk
    if (lang === 'German' && acf.role_de) currentRole = acf.role_de

    // 2. Specialties Array Translation from WordPress ACF custom language fields
    let specs = []
    const specialtiesRaw = (lang === 'Danish' && acf.specialties_dk) ? acf.specialties_dk :
                           (lang === 'German' && acf.specialties_de) ? acf.specialties_de :
                           acf.specialties || ''
    if (Array.isArray(specialtiesRaw)) {
      specs = specialtiesRaw
    } else if (typeof specialtiesRaw === 'string' && specialtiesRaw) {
      specs = specialtiesRaw.split(',').map(s => s.trim()).filter(Boolean)
    }

    return {
      ...advisor,
      role: currentRole,
      specialties: specs,
      experience: acf.experience || '', // Experience reads straight across cleanly
      location: acf.location || ''      // Location reads straight across cleanly
    }
  })
})

const roles = computed(() => {
  const unique = new Set()
  localizedAdvisors.value.forEach(a => { if (a.role) unique.add(a.role) })
  return ['all', ...Array.from(unique)]
})

const filteredAdvisors = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return localizedAdvisors.value.filter(advisor => {
    const bySearch = !query ||
      advisor.name.toLowerCase().includes(query) ||
      advisor.location.toLowerCase().includes(query) ||
      advisor.role.toLowerCase().includes(query)
    const byRole = filterRole.value === 'all' || advisor.role === filterRole.value
    return bySearch && byRole
  })
})

onMounted(async () => {
  try {
    const listRes = await axios.get(
      `http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/advisor?per_page=100&acf_format=standard&v=${Date.now()}`
    )
    const items = Array.isArray(listRes.data) ? listRes.data : []

    const details = await Promise.all(
      items.map(item =>
        axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/advisor/${item.id}?acf_format=standard&v=${Date.now()}`)
      )
    )

    const seen = new Set()
    const unique = []
    for (const res of details) {
      const normalized = normalize(res.data)
      const key = normalized.id || normalized.name
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(normalized)
      }
    }
    advisors.value = unique
  } catch (err) {
    console.error('Error fetching advisors:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
      <div class="col-span-12">
        <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">{{ lbl('nav.advisors') }}</h1>
      </div>
      <div class="col-span-12 md:col-span-7">
        <p class="text-off-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
          {{ localLabels.heroSubtitle }}
        </p>
      </div>
    </section>

    <div class="basegrid py-12">

      <div v-if="loading" class="col-span-12 text-center py-20 text-gray-500">
        {{ localLabels.loadingAdvisors }}
      </div>

      <div v-else-if="error" class="col-span-12 text-center py-20 text-red-600">
        Failed to load advisors: {{ error }}
      </div>

      <template v-else>
        <div class="col-span-12 mb-10">
          <div class="relative max-w-sm mb-8">
            <span class="absolute inset-y-0 left-3 flex items-center">
              <svg class="w-5 h-5 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="localLabels.searchPlaceholder"
              class="text-blue w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <p class="text-blue mb-4 text-sm font-medium">{{ lbl('general.filterBy') }}</p>

          <div class="flex flex-wrap gap-3">
            <button
              v-for="role in roles"
              :key="role"
              @click="filterRole = role"
              :class="filterRole === role ? 'bg-semi-dark-blue text-white' : 'bg-white border border-gray-200 text-blue'"
              class="px-4 py-2 rounded-xl transition-all text-sm hover:bg-semi-dark-blue hover:text-white"
            >
              {{ role === 'all' ? localLabels.allRoles : role }}
            </button>
          </div>
        </div>

        <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <template v-if="filteredAdvisors.length > 0">
            <div
              v-for="advisor in filteredAdvisors"
              :key="advisor.id"
              class="flex gap-0 border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-all overflow-hidden"
            >
              <div class="w-40 shrink-0 bg-gray-100 overflow-hidden">
                <img
                  :src="advisor.imageUrl || 'https://via.placeholder.com/160x220'"
                  :alt="advisor.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <div class="flex-1 min-w-0 flex flex-col p-4">
                <h3 class="text-base font-bold text-dark-blue">{{ advisor.name }}</h3>
                <p v-if="advisor.role" class="text-sm text-blue mb-3 font-medium">{{ advisor.role }}</p>

                <div v-if="advisor.specialties && advisor.specialties.length > 0" class="flex items-center gap-1 flex-wrap mb-3">
                  <svg class="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  <span
                    v-for="specialty in advisor.specialties.slice(0, 3)"
                    :key="specialty"
                    class="px-2 py-0.5 text-xs rounded border border-gray-300 bg-white text-gray-700"
                  >
                    {{ specialty }}
                  </span>
                </div>

                <div v-if="advisor.experience" class="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                  <span>{{ advisor.experience }} {{ localLabels.yearsExp }}</span>
                </div>

                <p v-if="advisor.languages.length > 0" class="text-xs text-gray-600 mb-1">
                  <span class="font-semibold">{{ localLabels.languagesLabel }}:</span>
                  {{ formatLanguages(advisor.languages) }}
                </p>

                <div v-if="advisor.location" class="flex items-center gap-1 text-xs text-gray-600 mb-3">
                  <span class="font-semibold">{{ localLabels.locationLabel }}: </span>{{ advisor.location }}
                </div>

                <div class="flex gap-2 mt-auto">
                  <a
                    v-if="advisor.email"
                    :href="`mailto:${advisor.email}`"
                    class="flex-1 flex justify-center items-center gap-1 bg-semi-dark-blue text-white px-3 py-2 rounded-lg hover:opacity-90 transition-colors text-xs font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    {{ localLabels.emailBtn }}
                  </a>
                  <a
                    v-if="advisor.phone"
                    :href="`tel:${advisor.phone}`"
                    class="flex-1 flex justify-center items-center gap-1 bg-white border border-gray-300 text-dark-blue px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-xs font-medium"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    {{ localLabels.callBtn }}
                  </a>
                </div>
              </div>
            </div>
          </template>

          <div v-else class="col-span-12 text-center py-20 text-blue">
            {{ localLabels.noAdvisors }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>