<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import axios from 'axios';
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js';

const siteLanguage = inject('siteLanguage');
const lbl = (key) => getLabel(key, siteLanguage.value);
const t = (item, field) => getTranslatedContent(item, field, siteLanguage.value);

const events = ref([]);
const loading = ref(true);
const error = ref(null);

const searchQuery = ref('');
const activeLanguage = ref('');
const activeTopic = ref('');
const activeType = ref('');
const fromDate = ref('');
const toDate = ref('');
const openDropdown = ref('');
const allEventsActive = ref(false);

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDay(d) { return d ? d.slice(6, 8) : ''; }
function formatMonth(d) { return d ? months[parseInt(d.slice(4, 6)) - 1] : ''; }

function decodeHTML(str) {
  return str ? str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
}

function getTerms(event, taxonomy) {
  return (event._embedded?.['wp:term'] ?? [])
    .flat()
    .filter(t => t.taxonomy === taxonomy)
    .map(t => decodeHTML(t.name));
}

onMounted(async () => {
  document.title = lbl('events.metaTitle');
  document.querySelector('meta[name="description"]')?.setAttribute('content', lbl('events.metaDescription'));
  try {
    const res = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/event?acf_format=standard&_embed&per_page=100');
    events.value = res.data;
  } catch (err) {
    error.value = 'Failed to load events: ' + err.message;
  } finally {
    loading.value = false;
  }
});

const languages = ['English', 'Danish', 'German'];
const topics = ['Recruitment', 'IT', 'Business expansion', 'Networking', 'Taxaxion and law', 'Trade & export', 'Innovation & startups'];
const types = ['Job fair', 'Conference', 'Workshop', 'Webinar', 'Networking Event', 'Info session', 'Panel Discussion'];

const eventTypeTranslations = {
  'Job fair':          { Danish: 'Jobmesse',                    German: 'Jobmesse' },
  'Conference':        { Danish: 'Konference',                  German: 'Konferenz' },
  'Workshop':          { Danish: 'Workshop',                    German: 'Workshop' },
  'Webinar':           { Danish: 'Webinar',                     German: 'Webinar' },
  'Networking Event':  { Danish: 'Netværksevent',               German: 'Networking-Veranstaltung' },
  'Info session':      { Danish: 'Infosession',                 German: 'Info-Veranstaltung' },
  'Panel Discussion':  { Danish: 'Paneldiskussion',             German: 'Podiumsdiskussion' },
};

const eventTopicTranslations = {
  'Recruitment':           { Danish: 'Rekruttering',            German: 'Rekrutierung' },
  'IT':                    { Danish: 'IT',                      German: 'IT' },
  'Business expansion':    { Danish: 'Virksomhedsudvidelse',    German: 'Unternehmensexpansion' },
  'Networking':            { Danish: 'Netværk',                 German: 'Networking' },
  'Taxaxion and law':      { Danish: 'Skat & Jura',             German: 'Steuern & Recht' },
  'Trade & export':        { Danish: 'Handel & Eksport',        German: 'Handel & Export' },
  'Innovation & startups': { Danish: 'Innovation & Startups',   German: 'Innovation & Startups' },
};

const translateType  = (val) => val ? (eventTypeTranslations[val]?.[siteLanguage.value]  || val) : '';
const translateTopic = (val) => val ? (eventTopicTranslations[val]?.[siteLanguage.value] || val) : '';

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    const q = searchQuery.value.toLowerCase();
    const title = e.title?.rendered?.toLowerCase() ?? '';
    const desc = e.acf?.event_description?.toLowerCase() ?? '';
    if (q && !title.includes(q) && !desc.includes(q)) return false;
    if (activeLanguage.value && !getTerms(e, 'event_language').includes(activeLanguage.value)) return false;
    if (activeTopic.value && !getTerms(e, 'event_topic').includes(activeTopic.value)) return false;
    if (activeType.value && !getTerms(e, 'event_type').includes(activeType.value)) return false;
    const d = e.acf?.event_date;
    if (d && fromDate.value && d < fromDate.value.replace(/-/g, '')) return false;
    if (d && toDate.value && d > toDate.value.replace(/-/g, '')) return false;
    return true;
  });
});

function clearAll() {
  activeLanguage.value = '';
  activeTopic.value = '';
  activeType.value = '';
  fromDate.value = '';
  toDate.value = '';
  openDropdown.value = '';
  allEventsActive.value = true;
}

function toggleDropdown(name) {
  openDropdown.value = openDropdown.value === name ? '' : name;
}
</script>

<template>
  <!-- Hero -->
  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">
        {{ lbl('events.heroTitle') }}
      </h1>
    </div>
    <div class="col-span-12 md:col-span-9">
      <p class="text-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        {{ lbl('events.heroSubtitle') }}
      </p>
    </div>
  </section>

  <!-- Events Grid -->
  <div class="basegrid py-12">
    <div class="col-span-12 mb-10">

      <!-- Search -->
      <div class="relative max-w-sm mb-8">
        <span class="absolute inset-y-0 left-3 flex items-center">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="lbl('events.searchPlaceholder')"
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <!-- Filters -->
      <p class="text-gray-600 mb-4 text-sm font-medium">{{ lbl('general.filterBy') }}</p>

      <div class="flex flex-wrap gap-4 items-center">

        <button
          @click="clearAll"
          :class="allEventsActive ? 'bg-dark-blue text-white' : 'bg-white border text-gray-700'"
          class="px-6 py-2 rounded-xl transition-all text-sm"
        >
          {{ lbl('events.allEvents') }}
        </button>

        <div class="relative">
          <button @click="toggleDropdown('language')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
            {{ lbl('general.language') }}
            <span v-if="activeLanguage" class="font-light">: {{ activeLanguage }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openDropdown === 'language' ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <span v-if="activeLanguage" @click.stop="activeLanguage = ''; allEventsActive = false" class="text-[8px] self-start mt-0.5 -ml-1 hover:text-red-400 transition-colors">✕</span>
          </button>
          <div v-if="openDropdown === 'language'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-44 overflow-hidden">
            <button v-for="lang in languages" :key="lang" @click="activeLanguage = lang; openDropdown = ''; allEventsActive = false" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">{{ lang }}</button>
          </div>
        </div>

        <div class="relative">
          <button @click="toggleDropdown('topic')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
            {{ lbl('general.topic') }}
            <span v-if="activeTopic" class="font-light">: {{ translateTopic(activeTopic) }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openDropdown === 'topic' ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <span v-if="activeTopic" @click.stop="activeTopic = ''; allEventsActive = false" class="text-[8px] self-start mt-0.5 -ml-1 hover:text-red-400 transition-colors">✕</span>
          </button>
          <div v-if="openDropdown === 'topic'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-56 overflow-hidden">
            <button v-for="topic in topics" :key="topic" @click="activeTopic = topic; openDropdown = ''; allEventsActive = false" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">{{ translateTopic(topic) }}</button>
          </div>
        </div>

        <div class="relative">
          <button @click="toggleDropdown('type')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
            {{ lbl('general.type') }}
            <span v-if="activeType" class="font-light">: {{ translateType(activeType) }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openDropdown === 'type' ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <span v-if="activeType" @click.stop="activeType = ''; allEventsActive = false" class="text-[8px] self-start mt-0.5 -ml-1 hover:text-red-400 transition-colors">✕</span>
          </button>
          <div v-if="openDropdown === 'type'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-48 overflow-hidden">
            <button v-for="type in types" :key="type" @click="activeType = type; openDropdown = ''; allEventsActive = false" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">{{ translateType(type) }}</button>
          </div>
        </div>

        <div class="relative">
          <button @click="toggleDropdown('daterange')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
            {{ lbl('events.dateRange') }}
            <span v-if="fromDate || toDate" class="font-light">: set</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openDropdown === 'daterange' ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div v-if="openDropdown === 'daterange'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-64 p-4 flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <label class="text-gray-500 text-sm">{{ lbl('events.from') }}</label>
              <input v-model="fromDate" type="date" @change="allEventsActive = false" class="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-gray-500 text-sm">{{ lbl('events.to') }}</label>
              <input v-model="toDate" type="date" @change="allEventsActive = false" class="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
            </div>
            <button v-if="fromDate || toDate" @click="fromDate = ''; toDate = ''" class="text-gray-400 text-sm text-left">{{ lbl('events.clear') }}</button>
          </div>
        </div>

      </div>
    </div>

    <div v-if="loading" class="col-span-12 text-center py-20 text-gray-500">{{ lbl('events.loading') }}</div>
    <div v-else-if="error" class="col-span-12 text-center py-20 text-red-500">{{ error }}</div>

    <div v-else class="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
      <router-link v-for="event in filteredEvents" :key="event.id" :to="`/events/${event.slug}`" class="flex flex-col group cursor-pointer">

        <div class="relative overflow-hidden rounded-xl mb-4">
          <img
            v-if="event._embedded?.['wp:featuredmedia']?.[0]?.source_url"
            :src="event._embedded['wp:featuredmedia'][0].source_url"
            :alt="event._embedded['wp:featuredmedia'][0].alt_text || event.title.rendered"
            loading="lazy"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-64 bg-light-blue"></div>
          <div v-if="event.acf?.event_date" class="absolute top-3 left-3 bg-semi-dark-blue text-white py-2 text-center rounded-xl w-20">
            <p class="text-2xl font-bold leading-none">{{ formatDay(event.acf.event_date) }}</p>
            <p class="text-xs font-bold leading-tight mt-0.5">{{ formatMonth(event.acf.event_date) }}</p>
          </div>
        </div>

        <div class="flex flex-col items-start">
          <span v-if="getTerms(event, 'event_type')[0]" class="text-gray-500 text-sm mb-1 font-light">{{ translateType(getTerms(event, 'event_type')[0]) }}</span>
          <h3 class="mb-2">{{ t(event, 'title') }}</h3>
          <p v-if="event.acf?.event_description" class="text-gray-700 text-sm mb-4 line-clamp-2">{{ t(event, 'event_description') }}</p>
          <span class="flex items-center gap-2 text-sm font-medium text-dark-blue group-hover:underline">
            {{ lbl('events.viewDetails') }}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>

      </router-link>

      <div v-if="filteredEvents.length === 0" class="col-span-12 text-center py-20 text-gray-500">
        {{ lbl('events.noEvents') }}
      </div>
    </div>

  </div>
</template>
