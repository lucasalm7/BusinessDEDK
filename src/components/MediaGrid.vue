<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue';
import { fetchVideosFromAPI, filterVideos } from '../utils/mediaFunctions.js';
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js';

// 1. Inject the reactive site language reference
const siteLanguage = inject('siteLanguage');

// 2. Helper function to map locale abbreviations to dictionary keys
const getMappedLang = () => {
  let mappedLang = siteLanguage?.value || 'English';
  if (mappedLang === 'en' || mappedLang === 'en-GB') mappedLang = 'English';
  if (mappedLang === 'da' || mappedLang === 'dk') mappedLang = 'Danish';
  if (mappedLang === 'de') mappedLang = 'German';
  return mappedLang;
};

// 3. FIX: Compute labels reactively so Vue watches language changes automatically
const lbl = (key) => {
  return getLabel(key, getMappedLang());
};

const videos = ref([]);
const searchQuery = ref('');
const selectedLanguage = ref('All');
const selectedType = ref('All');
const selectedTopic = ref('All');
const activeDropdown = ref(null);
let intervalId = null;

const updateVideos = async () => {
  const newVideos = await fetchVideosFromAPI();
  if (JSON.stringify(videos.value) !== JSON.stringify(newVideos)) {
    videos.value = newVideos;
  }
};

onMounted(() => {
  updateVideos();
  intervalId = setInterval(updateVideos, 30000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

// 4. FIX: Depend directly on the reactive computed translation value for types filtering
const filteredVideos = computed(() => {
  return filterVideos(
    videos.value, 
    searchQuery.value, 
    selectedLanguage.value, 
    selectedType.value, 
    selectedTopic.value
  );
});

const t = (item, field) => {
  return getTranslatedContent(item, field, getMappedLang());
};

// Function to turn any title string into a clean url-slug (e.g. "Hello World!" -> "hello-world")
const slugifyTitle = (video) => {
  const rawTitle = t(video, 'title') || video.title?.rendered || '';
  
  return rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
};

// Automatically reads custom types dynamically from the WP API response array
const dynamicTypes = computed(() => {
  if (!videos.value) return [];
  
  const typesMap = new Map();
  
  videos.value.forEach(video => {
    const typeObj = video.acf?.video_type;
    if (typeObj && typeObj.term_id && !typesMap.has(typeObj.term_id)) {
      typesMap.set(typeObj.term_id, {
        id: typeObj.term_id,
        name: typeObj.name,
        slug: typeObj.slug
      });
    }
  });
  
  return Array.from(typesMap.values());
});

// Translates dynamic taxonomy tokens seamlessly using dictionary values
const translateTaxonomy = (taxObj) => {
  const localized = lbl(`taxonomy.${taxObj.slug}`);
  return localized && !localized.includes('missing') && localized !== `taxonomy.${taxObj.slug}` 
    ? localized 
    : taxObj.name;
};

const videoTypeTranslations = {
  'Interview': { English: 'Interview', Danish: 'Interview', German: 'Interview' },
  'Event': { English: 'Event', Danish: 'Event', German: 'Veranstaltung' },
  'Story': { English: 'Story', Danish: 'Historie', German: 'Geschichte' },
};

const translateVideoType = (typeName) => {
  if (!typeName) return '';
  return videoTypeTranslations[typeName]?.[siteLanguage.value] || typeName;
};
</script>

<template>
  <div class="basegrid my-8">

    <div class="col-span-12 mb-10">

        <div class="relative max-w-sm mb-8">
            <span class="absolute inset-y-0 left-3 flex items-center">
            <svg class="w-5 h-5 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            </span>
            <input v-model="searchQuery" type="text" :placeholder="lbl('general.searchPlaceholder')" 
            class="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <p class="text-blue mb-4 text-sm font-medium">{{ lbl('general.filterBy') }}</p>

        <div class="flex flex-wrap gap-4 items-center">
            <!-- All Videos Button -->
            <button @click="selectedLanguage = 'All'; selectedType = 'All'; selectedTopic = 'All'"
            :class="(selectedLanguage === 'All' && selectedType === 'All' && selectedTopic === 'All') ? 'bg-slate-900 text-white' : 'bg-white border text-blue'"
            class="px-6 py-2 rounded-xl transition-all text-sm">
            {{ lbl('mediapage.allVideos') }}
            </button>

            <!-- Language -->
            <div class="relative">
              <button @click="toggleDropdown('lang')" class="bg-white border px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
                {{ lbl('general.language') }}
                <span v-if="selectedLanguage !== 'All'" @click.stop="selectedLanguage = 'All'" class="text-[8px] self-start mt-0.5 -ml-1 hover:text-red-400 transition-colors cursor-pointer">✕</span>
                <svg v-if="selectedLanguage === 'All'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  :class="activeDropdown === 'lang' ? 'rotate-180' : ''"
                  class="transition-transform duration-200 shrink-0">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
            <div v-if="activeDropdown === 'lang'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-40 overflow-hidden">
                <button @click="selectedLanguage = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-semi-dark-blue hover:text-white text-sm">{{ lbl('general.all') }}</button>
                <button @click="selectedLanguage = 'English'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-semi-dark-blue hover:text-white text-sm">{{ lbl('general.english') }}</button>
                <button @click="selectedLanguage = 'German'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-semi-dark-blue hover:text-white text-sm">{{ lbl('general.german') }}</button>
                <button @click="selectedLanguage = 'Danish'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-semi-dark-blue hover:text-white text-sm">{{ lbl('general.danish') }}</button>
            </div>
            </div>

            <!-- Type -->
            <div class="relative">
              <button @click="toggleDropdown('type')" class="bg-white px-6 py-2 rounded-xl flex items-center gap-2 text-sm border text-dark-blue">
                {{ lbl('general.type') }} <span v-if="selectedType !== 'All'" class="font-light">: {{ translateVideoType(selectedType) }}</span>
                
                <span v-if="selectedType !== 'All'" @click.stop="selectedType = 'All'" class="text-[8px] self-start mt-0.5 -ml-1 hover:text-red-400 transition-colors cursor-pointer">✕</span>
                
                <svg v-if="selectedType === 'All'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  :class="activeDropdown === 'type' ? 'rotate-180' : ''"
                  class="transition-transform duration-200 shrink-0">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              
              <div v-if="activeDropdown === 'type'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-44 overflow-hidden">
                <button @click="selectedType = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-semi-dark-blue hover:text-white text-sm">
                  {{ lbl('general.all') || 'All' }}
                </button>
                
                <button 
                  v-for="type in dynamicTypes" 
                  :key="type.id" 
                  @click="selectedType = type.name; activeDropdown = null" 
                  class="w-full text-left px-4 py-2 hover:bg-semi-dark-blue hover:text-white text-sm"
                >
                  {{ translateVideoType(type.name) }}
                </button>
              </div>
            </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 col-span-12">
      <TransitionGroup name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 col-span-12">
        <div v-for="video in filteredVideos" :key="video.id" class="flex flex-col group cursor-pointer">
        
        <router-link :to="`/video/${slugifyTitle(video)}`" class="overflow-hidden rounded-xl mb-4">
          <img v-if="video.acf?.thumbnail_image?.url" :src="video.acf.thumbnail_image.url" :alt="video.acf.thumbnail_image.alt || video.title.rendered"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"/>
        </router-link>

        <div class="flex flex-col items-start">
          <span class="text-blue text-sm mb-1 font-light">
            {{ translateVideoType(video.acf?.video_type?.name) || 'Video' }}
          </span>

          <router-link :to="`/video/${slugifyTitle(video)}`">
            <h3 v-html="t(video, 'title')" class="text-xl font-bold text-dark-blue mb-2 hover:text-blue-600 transition-colors"></h3>
          </router-link>

          <p v-if="video.acf?.video_short_description" class="text-dark-blue text-sm mb-4 line-clamp-2">
            {{ video.acf.video_short_description }}
          </p>

          <router-link :to="`/video/${slugifyTitle(video)}`" class="flex items-center gap-2 text-sm font-medium text-dark-blue hover:underline">
            {{ lbl('general.readMore') }} 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
      
      <div v-if="filteredVideos.length === 0" class="col-span-12 text-center py-20 text-gray-500">
        {{ lbl('mediapage.noVideos') }}
      </div>
      </TransitionGroup>
    </div>
  </div>
</template>