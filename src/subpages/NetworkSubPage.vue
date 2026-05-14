<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const card = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const cardId = route.params.id
    
    if (!cardId) {
      throw new Error('No card ID provided in URL')
    }
    
    let allCards = []
    const perPage = 50
    let page = 1

    while (true) {
      const res = await axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/databasecard?per_page=${perPage}&page=${page}&acf_format=standard`)
      const pageCards = Array.isArray(res.data) ? res.data : []
      if (pageCards.length === 0) break
      allCards = allCards.concat(pageCards)
      if (pageCards.length < perPage) break
      page += 1
    }

    const found = allCards.find(item => String(item.id) === String(cardId))
    if (!found) {
      throw new Error(`Card with ID ${cardId} not found`)
    }
    card.value = found
  } catch (err) {
    error.value = "Failed to load company details: " + err.message
  } finally {
    loading.value = false
  }
})

const getLogoUrl = () => {
  if (!card.value?.acf?.logo_) return 'https://via.placeholder.com/150'
  const logo = card.value.acf.logo_
  if (logo.url) return logo.url
  if (logo.sizes?.medium) return logo.sizes.medium
  if (logo.sizes?.large) return logo.sizes.large
  return 'https://via.placeholder.com/150'
}

const getCompanyTypes = () => {
  if (!card.value?.class_list) return []
  return card.value.class_list
    .filter(cls => cls.startsWith('company_type-') && cls !== 'company_type-company' && cls !== 'company_type-institution')
    .map(cls => {
      const name = cls.replace('company_type-', '')
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')
    })
}

const goBack = () => {
  router.push('/network')
}

const isInstitution = () => {
  return card.value?.class_list?.includes('company_type-institution')
}
</script>

<template>
  <div>
    <!-- Top Banner with Back Button -->
    <div v-if="!loading && !error && card" class="bg-semi-dark-blue px-4 md:px-[5%] py-4">
      <button @click="goBack" class="text-off-white hover:text-white flex items-center gap-2 transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Network Database
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="basegrid py-20">
      <div class="col-span-12 text-center text-gray-500">Loading company details...</div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="basegrid py-20">
      <div class="col-span-12 text-center text-red-600">{{ error }}</div>
      <div class="col-span-12 text-center mt-4">
        <button @click="goBack" class="text-blue-600 hover:underline">Return to Network</button>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="card" class="bg-white">
           <!-- Logo Box -->
            <!-- Logo Box -->
            <!-- Logo Box -->
      <div class="basegrid py-12">
        <div class="col-span-12">
          <div class="bg-gray-50 border border-gray-200 rounded-lg h-80 overflow-hidden">
            <img :src="getLogoUrl()" :alt="card.title?.rendered || 'Company Logo'" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

            <!-- Company Info Section -->
      <div class="basegrid py-8">
        <div class="col-span-12">
          <h2 class="text-xl font-bold text-black mb-4" v-html="card.title?.rendered || 'Untitled'"></h2>
          
          <div class="flex flex-wrap gap-3 mb-4">
            <span v-if="isInstitution()" class="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">Institution</span>
            <span v-else class="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">Company</span>
            <span v-for="type in getCompanyTypes()" :key="type" class="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">
              {{ type }}
            </span>
          </div>

          <p v-if="card.acf?.location" class="text-gray-600 text-sm flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
            </svg>
            {{ card.acf?.location }}, Germany
          </p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="basegrid py-12 gap-6 items-start">
        <!-- Left Column - About -->
        <div class="col-span-12 md:col-span-7">
          <div class="bg-white border border-gray-200 rounded-lg p-8">
            <h3 class="text-lg font-bold text-black mb-6">About</h3>
            <p v-if="card.acf?.about" class="text-gray-700 leading-relaxed text-sm">{{ card.acf?.about }}</p>
            <p v-else class="text-gray-500 text-sm">No description available.</p>
          </div>
        </div>

        <!-- Right Column - Contact Info -->
        <div class="col-span-12 md:col-span-5">
          <div class="bg-white border border-gray-200 rounded-lg p-8">
            <h3 class="text-lg font-bold text-black mb-8">Contact Information</h3>
            
            <div class="space-y-6">
              <!-- Email -->
              <div v-if="card.acf?.email" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
                </svg>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                  <a :href="`mailto:${card.acf?.email}`" class="text-gray-900 hover:text-blue-600 transition-colors text-sm break-all">
                    {{ card.acf?.email }}
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div v-if="card.acf?.phone_number" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10.5V7c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path>
                </svg>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                  <a :href="`tel:${card.acf?.phone_number}`" class="text-gray-900 hover:text-blue-600 transition-colors text-sm">
                    {{ card.acf?.phone_number }}
                  </a>
                </div>
              </div>

              <!-- Website -->
              <div v-if="card.acf?.website" class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"></path>
                </svg>
                <div>
                  <p class="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Website</p>
                  <a :href="card.acf?.website" target="_blank" rel="noopener noreferrer" class="text-gray-900 hover:text-blue-600 transition-colors text-sm break-all">
                    {{ card.acf?.website }}
                  </a>
                </div>
              </div>
            </div>

            <!-- Get in Touch Button -->
            
          </div>
        </div>
      </div>
    </div>
  </div>
</template>