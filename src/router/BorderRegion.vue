<script setup>
import { ref, computed, inject, watchEffect } from 'vue';
import { getLabel } from '../utils/translationFunction.js';

const siteLanguage = inject('siteLanguage');
const lbl = (key) => getLabel(key, siteLanguage.value);

watchEffect(() => {
  document.title = lbl('borderregion.metaTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', lbl('borderregion.metaDescription'));
});

const openCompany = ref(null);
const openIndividual = ref(null);

function toggleCompany(index) {
  openCompany.value = openCompany.value === index ? null : index;
}

function toggleIndividual(index) {
  openIndividual.value = openIndividual.value === index ? null : index;
}

const companyTopics = computed(() => [
  { title: lbl('borderregion.company1Title'), content: lbl('borderregion.company1Content') },
  { title: lbl('borderregion.company2Title'), content: lbl('borderregion.company2Content') },
  { title: lbl('borderregion.company3Title'), content: lbl('borderregion.company3Content') },
  { title: lbl('borderregion.company4Title'), content: lbl('borderregion.company4Content') },
]);

const individualTopics = computed(() => [
  { title: lbl('borderregion.individual1Title'), content: lbl('borderregion.individual1Content') },
  { title: lbl('borderregion.individual2Title'), content: lbl('borderregion.individual2Content') },
  { title: lbl('borderregion.individual3Title'), content: lbl('borderregion.individual3Content') },
  { title: lbl('borderregion.individual4Title'), content: lbl('borderregion.individual4Content') },
]);
</script>

<template>

  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">
        {{ lbl('borderregion.heroTitle') }}
      </h1>
    </div>
    <div class="col-span-12 md:col-span-9">
      <p class="text-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        {{ lbl('borderregion.heroSubtitle') }}
      </p>
    </div>
  </section>

  <div class="basegrid py-12">

    <div class="col-span-12 lg:col-span-8">

      <h2 class="text-dark-blue font-bold mb-3">{{ lbl('borderregion.introHeading') }}</h2>
      <p class="text-gray-700 mb-4">{{ lbl('borderregion.introP1') }}</p>
      <p class="text-gray-700 mb-12">{{ lbl('borderregion.introP2') }}</p>

      <h2 class="text-dark-blue font-bold mb-3">{{ lbl('borderregion.companiesHeading') }}</h2>
      <p class="text-gray-700 mb-6">{{ lbl('borderregion.companiesIntro') }}</p>

      <div class="flex flex-col gap-3 mb-12">
        <div v-for="(item, index) in companyTopics" :key="item.title">
          <button
            @click="toggleCompany(index)"
            class="w-full flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-dark-blue font-medium px-5 py-4 rounded-lg transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openCompany === index ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ item.title }}
          </button>
          <div v-if="openCompany === index" class="bg-gray-50 px-5 py-4 rounded-b-lg border border-t-0 border-gray-200">
            <p class="text-gray-700">{{ item.content }}</p>
          </div>
        </div>
      </div>

      <h2 class="text-dark-blue font-bold mb-3">{{ lbl('borderregion.individualsHeading') }}</h2>
      <p class="text-gray-700 mb-6">{{ lbl('borderregion.individualsIntro') }}</p>

      <div class="flex flex-col gap-3">
        <div v-for="(item, index) in individualTopics" :key="item.title">
          <button
            @click="toggleIndividual(index)"
            class="w-full flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-dark-blue font-medium px-5 py-4 rounded-lg transition-colors text-left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openIndividual === index ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ item.title }}
          </button>
          <div v-if="openIndividual === index" class="bg-gray-50 px-5 py-4 rounded-b-lg border border-t-0 border-gray-200">
            <p class="text-gray-700">{{ item.content }}</p>
          </div>
        </div>
      </div>

    </div>

  </div>

</template>
