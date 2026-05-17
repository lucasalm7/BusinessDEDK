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
      <div class="basegrid py-12">
        <div class="col-span-12">
          <div class="bg-gray-50 border border-gray-200 rounded-full h-100 w-100 overflow-hidden items-center justify-center flex mx-auto">
            <img :src="getLogoUrl()" :alt="card.title?.rendered || 'Company Logo'" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

            <!-- Company Info Section -->
      <div class="basegrid py-8">
        <div class="col-span-12">
          <h2 class="text-xl font-bold text-black mb-4" v-html="card.title?.rendered || 'Untitled'"></h2>
          
        <div class="flex flex-wrap gap-3 mb-4">
            <span v-if="isInstitution()" class="px-3 py-1 text-xs rounded-lg border border-gray-300 bg-white text-blue">Institution</span>
            <span v-else class="px-3 py-1 text-xs rounded-xl border border-gray-300 bg-white text-blue">Company</span>
            <span v-for="type in getCompanyTypes()" :key="type" class="px-3 py-1 text-xs rounded-lg border border-gray-300 bg-white text-gray-700">
              {{ type }}
            </span>
          </div>

          <p v-if="card.acf?.location" class="text-primary text-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
              <path fill="#0D1B2A" d="M12 2a9 9 0 0 1 9 9c0 3.074-1.676 5.59-3.442 7.395a20.4 20.4 0 0 1-2.876 2.416l-.426.29l-.2.133l-.377.24l-.336.205l-.416.242a1.87 1.87 0 0 1-1.854 0l-.416-.242l-.52-.32l-.192-.125l-.41-.273a20.6 20.6 0 0 1-3.093-2.566C4.676 16.589 3 14.074 3 11a9 9 0 0 1 9-9m0 2a7 7 0 0 0-7 7c0 2.322 1.272 4.36 2.871 5.996a18 18 0 0 0 2.222 1.91l.458.326q.222.155.427.288l.39.25l.343.209l.289.169l.455-.269l.367-.23q.293-.186.627-.417l.458-.326a18 18 0 0 0 2.222-1.91C17.728 15.361 19 13.322 19 11a7 7 0 0 0-7-7m0 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4"/>
            </g>
          </svg>
            {{ card.acf?.location }}
          </p>
        </div>
      </div>

            <!-- Main Content -->
      <div class="basegrid py-12 gap-6 items-start">
        <!-- Left Column - About -->
        <div class="col-span-12 md:col-span-7 self-start">
          <div class="bg-white border border-gray-200 rounded-lg p-8">
            <h3 class="text-lg font-bold text-primary mb-6">About</h3>
            <p v-if="card.acf?.about" class="text-primary leading-relaxed text-sm whitespace-pre-wrap">{{ card.acf?.about }}</p>
            <p v-else class="text-gray-500 text-sm">No description available.</p>
          </div>
        </div>

                <!-- Right Column - Contact Info -->
        <div class="col-span-12 md:col-span-5 self-start">
          <div class="bg-white border border-gray-200 rounded-lg p-8">
            <h3 class="text-lg font-bold text-primary mb-8">Contact Information</h3>
            
            <div class="space-y-6">
              <!-- Email -->
              <div v-if="card.acf?.email" class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mt-1 shrink-0">
                  <path fill="#0d1b2a" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5-8-5zm0 12H4V8l8 5l8-5z"/>
                </svg>
                <div>
                  <p class="text-xs text-primary uppercase tracking-wider font-semibold mb-1">Email</p>
                  <a :href="`mailto:${card.acf?.email}`" class="text-primary hover:text-blue transition-colors text-sm break-all">
                    {{ card.acf?.email }}
                  </a>
                </div>
              </div>

              <!-- Phone -->
              <div v-if="card.acf?.phone_number" class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mt-1 shrink-0">
                  <path fill="#0d1b2a" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                </svg>
                <div>
                  <p class="text-xs text-primary uppercase tracking-wider font-semibold mb-1">Phone</p>
                  <a :href="`tel:${card.acf?.phone_number}`" class="text-primary hover:text-blue transition-colors text-sm">
                    {{ card.acf?.phone_number }}
                  </a>
                </div>
              </div>

              <!-- Website -->
              <div v-if="card.acf?.website" class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 14 14">
	<path d="M0 0h14v14H0z" fill="none" />
	<g fill="none" stroke="#0d1b2a" stroke-linecap="round" stroke-linejoin="round">
		<path d="M7 13.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M.5 7h13" />
		<path d="M9.5 7A11.22 11.22 0 0 1 7 13.5A11.22 11.22 0 0 1 4.5 7A11.22 11.22 0 0 1 7 .5A11.22 11.22 0 0 1 9.5 7" />
	</g>
</svg>

                <div>
                  <p class="text-xs text-primary uppercase tracking-wider font-semibold mb-1">Website</p>
                  <a :href="card.acf?.website" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-blue transition-colors text-sm break-all">
                    {{ card.acf?.website }}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>