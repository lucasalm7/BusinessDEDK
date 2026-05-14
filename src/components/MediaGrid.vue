<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { fetchVideosFromAPI, filterVideos } from '../utils/mediaFunctions.js';

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

const filteredVideos = computed(() => {
  return filterVideos(
    videos.value, 
    searchQuery.value, 
    selectedLanguage.value, 
    selectedType.value, 
    selectedTopic.value
  );
});
</script>

<template>
  <div class="basegrid py-12">

    <div class="col-span-12 mb-10">

        <div class="relative max-w-sm mb-8">
            <span class="absolute inset-y-0 left-3 flex items-center">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            </span>
            <input v-model="searchQuery" type="text" placeholder="Search by title, language, or description..." 
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>

        <p class="text-gray-600 mb-4 text-sm font-medium">Filter by</p>

        <div class="flex flex-wrap gap-4 items-center">
            <!-- All Videos Button -->
            <button @click="selectedLanguage = 'All'; selectedType = 'All'; selectedTopic = 'All'"
            :class="(selectedLanguage === 'All' && selectedType === 'All' && selectedTopic === 'All') ? 'bg-slate-900 text-white' : 'bg-white border text-gray-700'"
            class="px-6 py-2 rounded-xl transition-all text-sm">
            All videos
            </button>

            <!-- Language -->
            <div class="relative">
            <button @click="toggleDropdown('lang')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
                Language <span class="text-sm font-light">{{ selectedLanguage !== 'All' ? ': ' + selectedLanguage : '▼' }}</span>
            </button>
            <div v-if="activeDropdown === 'lang'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-40 overflow-hidden">
                <button @click="selectedLanguage = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">All</button>
                <button @click="selectedLanguage = 'English'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">English</button>
                <button @click="selectedLanguage = 'German'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">German</button>
                <button @click="selectedLanguage = 'Danish'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Danish</button>
            </div>
            </div>

            <!-- Type -->
            <div class="relative">
            <button @click="toggleDropdown('type')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
                Type <span class="text-sm font-light">{{ selectedType !== 'All' ? ': ' + selectedType : '▼' }}</span>
            </button>
            <div v-if="activeDropdown === 'type'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-40 overflow-hidden">
                <button @click="selectedType = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">All</button>
                <button @click="selectedType = 'Interview'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Interview</button>
                <button @click="selectedType = 'Story'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Story</button>
            </div>
            </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 col-span-12">
      <TransitionGroup name="fade" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 col-span-12">
        <div v-for="video in filteredVideos" :key="video.id" class="flex flex-col group cursor-pointer">
        
        <router-link :to="`/video/${video.id}`" class="overflow-hidden rounded-xl mb-4">
          <img v-if="video.acf?.thumbnail_image?.url" :src="video.acf.thumbnail_image.url" :alt="video.acf.thumbnail_image.alt || video.title.rendered"
            class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"/>
        </router-link>

        <div class="flex flex-col items-start">
          <span class="text-gray-500 text-sm mb-1 font-light">
            {{ video.acf?.video_type?.name || 'Video' }}
          </span>

          <router-link :to="`/video/${video.id}`">
            <h3 v-html="video.title.rendered" class="text-xl font-bold text-black mb-2 hover:text-blue-600 transition-colors"></h3>
          </router-link>

          <p v-if="video.acf?.video_short_description" class="text-gray-700 text-sm mb-4 line-clamp-2">
            {{ video.acf.video_short_description }}
          </p>

          <router-link :to="`/video/${video.id}`" class="flex items-center gap-2 text-sm font-medium text-black hover:underline">
            Read more 
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
      
      <div v-if="filteredVideos.length === 0" class="col-span-12 text-center py-20 text-gray-500">
        No videos found matching your criteria.
      </div>
      </TransitionGroup>
    </div>
  </div>
</template>