<script setup>
import { ref, onMounted, inject, watchEffect } from 'vue';
import axios from 'axios';
import Newsletter from '../components/Newsletter.vue';
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js';

const siteLanguage = inject('siteLanguage');
const lbl = (key) => getLabel(key, siteLanguage.value);
const t = (item, field) => getTranslatedContent(item, field, siteLanguage.value);

watchEffect(() => {
  document.title = lbl('becomeamember.metaTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', lbl('becomeamember.metaDescription'));
});

const advisors = ref([]);
const selectedAdvisor = ref(null);
const showFormModal = ref(false);
const form = ref({ name: '', email: '', company: '', message: '' });

onMounted(async () => {
  try {
    const res = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/guidance_card?acf_format=standard&_embed');
    advisors.value = res.data;
  } catch (err) {
    console.error('Failed to load advisors:', err.message);
  }
});

function submitForm() {
  showFormModal.value = false;
  form.value = { name: '', email: '', company: '', message: '' };
}
</script>

<template>

  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">
        {{ lbl('becomeamember.heroTitle') }}
      </h1>
    </div>
  </section>

  <div class="basegrid py-12">

    <div class="col-span-12 lg:col-span-8">
      <h2 class="text-dark-blue font-bold mb-4">{{ lbl('becomeamember.benefitsHeading') }}</h2>

      <p class="text-gray-700 mb-4">{{ lbl('becomeamember.benefitsP1') }}</p>
      <p class="text-gray-700 mb-8">{{ lbl('becomeamember.benefitsP2') }}</p>

      <h3 class="text-dark-blue font-bold mb-3">{{ lbl('becomeamember.weWill') }}</h3>
      <ul class="flex flex-col gap-2 mb-8">
        <li class="flex items-start gap-2 text-gray-700">
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark-blue shrink-0"></span>
          {{ lbl('becomeamember.bullet1') }}
        </li>
        <li class="flex items-start gap-2 text-gray-700">
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark-blue shrink-0"></span>
          {{ lbl('becomeamember.bullet2') }}
        </li>
        <li class="flex items-start gap-2 text-gray-700">
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark-blue shrink-0"></span>
          {{ lbl('becomeamember.bullet3') }}
        </li>
        <li class="flex items-start gap-2 text-gray-700">
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark-blue shrink-0"></span>
          {{ lbl('becomeamember.bullet4') }}
        </li>
        <li class="flex items-start gap-2 text-gray-700">
          <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark-blue shrink-0"></span>
          {{ lbl('becomeamember.bullet5') }}
        </li>
      </ul>

      <p class="text-gray-700">{{ lbl('becomeamember.benefitsP3') }}</p>
    </div>

    <div class="col-span-12 lg:col-span-4 lg:col-start-9 border-t lg:border-t-0 pt-8 lg:pt-0 self-start sticky top-4">
      <div class="bg-semi-dark-blue text-white rounded-xl p-6 flex flex-col gap-6">

        <h3 class="font-bold text-white text-center">{{ lbl('becomeamember.getGuidance') }}</h3>

        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="advisor in advisors"
            :key="advisor.id"
            @click="selectedAdvisor = advisor"
            class="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <img
              v-if="advisor.acf?.guidance_image?.url"
              :src="advisor.acf.guidance_image.url"
              :alt="advisor.acf.guidance_image.alt || advisor.title?.rendered"
              loading="lazy"
              class="w-16 h-16 rounded-full object-cover"
            />
            <div v-else class="w-16 h-16 rounded-full bg-light-blue flex items-center justify-center text-white font-bold text-lg">
              {{ advisor.title?.rendered?.[0] }}
            </div>
            <span class="text-sm text-gray-300">{{ advisor.title?.rendered }}</span>
          </div>
        </div>

        <button
          @click="showFormModal = true"
          class="w-full bg-white text-semi-dark-blue py-2.5 rounded-lg text-sm font-light hover:bg-transparent hover:text-white hover:border hover:border-white transition"
        >
          {{ lbl('becomeamember.applyButton') }}
        </button>

      </div>
    </div>

  </div>

  <Newsletter />

  <Teleport to="body">
    <div v-if="showFormModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" @click.self="showFormModal = false">
      <div class="bg-white rounded-xl w-full max-w-md p-8 flex flex-col gap-5">

        <div class="flex items-center justify-between">
          <h3 class="font-bold text-dark-blue">{{ lbl('becomeamember.modalTitle') }}</h3>
          <button @click="showFormModal = false" class="text-gray-400 hover:text-gray-600 transition text-xl leading-none">✕</button>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-500">{{ lbl('becomeamember.formFullName') }}</label>
          <input v-model="form.name" type="text" :placeholder="lbl('becomeamember.formNamePlaceholder')" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-500">{{ lbl('becomeamember.formEmail') }}</label>
          <input v-model="form.email" type="email" :placeholder="lbl('becomeamember.formEmailPlaceholder')" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-500">{{ lbl('becomeamember.formCompany') }} <span class="text-gray-300">{{ lbl('becomeamember.formCompanyOptional') }}</span></label>
          <input v-model="form.company" type="text" :placeholder="lbl('becomeamember.formCompanyPlaceholder')" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-500">{{ lbl('becomeamember.formMessage') }}</label>
          <textarea v-model="form.message" :placeholder="lbl('becomeamember.formMessagePlaceholder')" rows="4" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
        </div>

        <button @click="submitForm" class="w-full bg-dark-blue text-white py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
          {{ lbl('becomeamember.formSubmit') }}
        </button>

      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="selectedAdvisor" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" @click.self="selectedAdvisor = null">
      <div class="bg-white rounded-xl w-full max-w-md p-8 flex flex-col gap-5">

        <div class="flex items-center justify-between">
          <h3 class="font-bold text-dark-blue">{{ selectedAdvisor.title?.rendered }}</h3>
          <button @click="selectedAdvisor = null" class="text-gray-400 hover:text-gray-600 transition text-xl leading-none">✕</button>
        </div>

        <div class="flex items-center gap-4">
          <img
            v-if="selectedAdvisor.acf?.guidance_image?.url"
            :src="selectedAdvisor.acf.guidance_image.url"
            :alt="selectedAdvisor.acf.guidance_image.alt || selectedAdvisor.title?.rendered"
            loading="lazy"
            class="w-16 h-16 rounded-full object-cover shrink-0"
          />
          <div v-else class="w-16 h-16 rounded-full bg-light-blue flex items-center justify-center text-white font-bold text-lg shrink-0">
            {{ selectedAdvisor.title?.rendered?.[0] }}
          </div>
          <div>
            <p class="font-medium text-dark-blue">{{ selectedAdvisor.title?.rendered }}</p>
            <p class="text-sm text-gray-500">{{ t(selectedAdvisor, 'guidance_title') }}</p>
          </div>
        </div>

        <p class="text-gray-700 leading-relaxed">{{ t(selectedAdvisor, 'guidance_description') }}</p>

        <div class="flex flex-col gap-2 text-sm text-gray-600">
          <a :href="`mailto:${selectedAdvisor.acf?.guidance_email}`" class="flex items-center gap-2 hover:text-dark-blue transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            {{ selectedAdvisor.acf?.guidance_email }}
          </a>
          <a :href="`tel:${selectedAdvisor.acf?.guidance_phone}`" class="flex items-center gap-2 hover:text-dark-blue transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
            </svg>
            {{ selectedAdvisor.acf?.guidance_phone }}
          </a>
        </div>

      </div>
    </div>
  </Teleport>

</template>
