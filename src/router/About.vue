<script setup>
import { ref, onMounted, inject, computed } from 'vue'
import axios from 'axios'
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js'

const siteLanguage = inject('siteLanguage')
const lbl = (key) => getLabel(key, siteLanguage.value)
const t = (item, field) => getTranslatedContent(item, field, siteLanguage.value)

const offers = ref([])
const pillars = ref([])
const contactData = ref({
  address: '',
  phone: '',
  email: ''
})
const loading = ref(true)
const error = ref(null)

// Forzamos el orden cronológico nativo: Misión -> Visión -> Valores
const orderedPillars = computed(() => {
  if (!pillars.value || pillars.value.length === 0) return [];
  const orderTarget = ['our-mission', 'our-vision', 'our-values'];
  return [...pillars.value].sort((a, b) => orderTarget.indexOf(a.slug) - orderTarget.indexOf(b.slug));
});

onMounted(async () => {
  try {
    const cacheBuster = Date.now();

    const [pillarsRes, contactRes] = await Promise.all([
      axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/pillar?acf_format=standard&v=${cacheBuster}`),
      axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/pages/74?acf_format=standard&v=${cacheBuster}`)
    ])

    const offersRes = await axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/offer?acf_format=standard&per_page=100&v=${cacheBuster}`)
    const offerIds = offersRes.data.map(o => o.id)
    const offerDetails = await Promise.all(
      offerIds.map(id => axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/offer/${id}?acf_format=standard&v=${cacheBuster}`))
    )
    
    offers.value = offerDetails.map(r => r.data)
    pillars.value = pillarsRes.data

    if (contactRes.data.acf) {
      contactData.value = {
        address: contactRes.data.acf.footer_address || '',
        phone: contactRes.data.acf.footer_phone || '',
        email: contactRes.data.acf.footer_email || ''
      }
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading About page:', err)
  } finally {
    loading.value = false
  }
})

const cleanPhone = (phone) => phone.replace(/\s+/g, '')
</script>

<template>
  <div>
    <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
      <div class="col-span-12">
        <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">{{ lbl('about.title') }}</h1>
      </div>
      <div class="col-span-12 md:col-span-8">
        <p class="text-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
          {{ lbl('about.hero_subtitle') }}
        </p>
      </div>
    </section>

    <div v-if="!loading" class="basegrid py-12 md:py-16 mt-8 items-start">
      <div class="col-span-12 md:col-span-6 text-dark-blue">
        <h2 class="text-dark-blue font-semibold mb-6">{{ lbl('about.who_we_are') }}</h2>
        <p class="mb-6 mt-8 max-w-l">{{ lbl('about.who_p1') }}</p>
        <p class="mb-6">{{ lbl('about.who_p2') }}</p>
        <p class="mb-6">{{ lbl('about.who_p3') }}</p>
      </div>

      <div class="col-span-12 md:col-span-6 space-y-6">
        <div v-for="pillar in orderedPillars" :key="pillar.id" class="flex gap-4 p-6 border border-stroke rounded-lg">
          
          <div class="w-5 h-5 text-stroke shrink-0 mt-0.5">
            <svg v-if="pillar.slug === 'our-mission'" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg v-else fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>

          <div>
            <h3 class="font-medium text-dark-blue mb-2">{{ t(pillar, 'title') }}</h3>
            <div class="text-gray-700 leading-relaxed dynamic-prose" v-html="siteLanguage === 'English' ? pillar.content?.rendered : t(pillar, 'content')"></div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="!loading" class="basegrid py-12 md:py-16 border-t border-stroke">
      <div class="col-span-12 mb-8">
        <h2 class="text-dark-blue font-semibold">{{ lbl('about.what_we_offer') }}</h2>
      </div>

      <div v-for="offer in offers" :key="offer.id" class="col-span-12 md:col-span-4 mb-8">
        <div class="p-6 border border-stroke rounded-lg h-full min-h-[320px] flex flex-col">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4">
            <svg class="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="font-medium text-dark-blue mb-3" v-html="t(offer, 'title')"></h3>
          
          <div class="text-gray-700 leading-relaxed dynamic-prose flex-1" v-html="siteLanguage === 'English' ? offer.content?.rendered : t(offer, 'content')"></div>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="basegrid py-12 md:py-16 border-t border-stroke">
      <div class="col-span-12">
        <div class="bg-semi-dark-blue rounded-lg p-8 md:p-12">
          <h2 class="font-bold text-white mb-8 text-start">{{ lbl('about.get_in_touch') }}</h2>
          <p class="text-white text-start leading-relaxed">{{ lbl('about.contact_intro1') }}</p>
          <p class="text-white text-start mb-8">{{ lbl('about.contact_intro2') }}</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block font-medium text-white mb-2">{{ lbl('about.form_name') }}</label>
              <input type="text" :placeholder="lbl('about.form_name_placeholder')" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white" />
            </div>
            <div>
              <label class="block font-medium text-white mb-2">{{ lbl('about.form_email') }}</label>
              <input type="email" :placeholder="lbl('about.form_email_placeholder')" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white" />
            </div>
          </div>

          <div class="mb-6">
            <label class="block font-medium text-white mb-2">{{ lbl('about.form_org') }}</label>
            <input type="text" :placeholder="lbl('about.form_org_placeholder')" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white" />
          </div>

          <div class="mb-6">
            <label class="block font-medium text-white mb-2">{{ lbl('about.form_message') }}</label>
            <textarea :placeholder="lbl('about.form_message_placeholder')" rows="6" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white resize-none"></textarea>
          </div>

          <div class="flex justify-center">
            <button class="px-8 py-3 bg-white text-dark-blue font-semibold rounded-lg hover:bg-off-white transition-all">
              {{ lbl('about.form_submit') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="basegrid py-12 md:py-16 border-t border-stroke">
      <div class="col-span-12 mb-8">
        <h2 class="text-dark-blue font-semibold mb-2">{{ lbl('about.contact_info_title') }}</h2>
        <p class="text-blue">{{ lbl('about.contact_info_subtitle') }}</p>
      </div>

      <div class="col-span-12 md:col-span-6 space-y-8">
        <div v-if="contactData.email" class="p-6 border border-stroke rounded-lg h-full flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mt-1 shrink-0">
            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5-8-5zm0 12H4V8l8 5l8-5z"/>
          </svg>
          <div>
            <p class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">{{ lbl('about.contact_email_label') }}</p>
            <a :href="`mailto:${contactData.email}`" class="text-primary hover:text-blue transition-colors text-sm break-all">
              {{ contactData.email }}
            </a>
          </div>
        </div>

        <div v-if="contactData.phone" class="p-6 border border-stroke rounded-lg h-full flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/xl" width="24" height="24" viewBox="0 0 24 24" class="mt-1 shrink-0">
            <path fill="#0d1b2a" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
          </svg>
          <div>
            <p class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">{{ lbl('about.contact_phone_label') }}</p>
            <a :href="`tel:${cleanPhone(contactData.phone)}`" class="text-primary hover:text-blue transition-colors text-sm break-all">
              {{ contactData.phone }}
            </a>
          </div>
        </div>
      </div>

      <div class="p-6 border border-stroke rounded-lg h-full flex items-start gap-4 col-span-12 md:col-span-6 grid grid-cols-2 gap-8">
        <div>
          <h3 class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">{{ lbl('about.office_hours_title') }}</h3>
          <div class="space-y-1 mt-4 text-dark-blue leading-relaxed">
            <p><strong>{{ lbl('about.weekdays') }}</strong></p>
            <p>09:00 - 17:00</p>
            <p class="mt-2"><strong>{{ lbl('about.weekend') }}</strong></p>
            <p>{{ lbl('about.closed') }}</p>
          </div>
        </div>

        <div v-if="contactData.address">
          <h3 class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">{{ lbl('about.offices_title') }}</h3>
          <p class="text-dark-blue mt-4 leading-relaxed">{{ contactData.address }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="basegrid py-20">
      <div class="col-span-12 text-center text-gray-700">{{ lbl('general.loading') }}</div>
    </div>
    <div v-if="error" class="basegrid py-20">
      <div class="col-span-12 text-center text-red-600">{{ error }}</div>
    </div>
  </div>
</template>