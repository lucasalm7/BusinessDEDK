<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { fetchVideosFromAPI } from '../utils/mediaFunctions.js';
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js';
import { fetchPageData } from '../utils/homeFunctions.js';

// Translation 
const siteLanguage = inject('siteLanguage');
const lbl = (key) => getLabel(key, siteLanguage.value);
const t = (item, field) => getTranslatedContent(item, field, siteLanguage.value);

// 2. State Variables
const videos = ref([]);
const loading = ref(true);
const homeData = ref(null);

// 3. Fetch Data
onMounted(async () => {
  homeData.value = await fetchPageData(227);
  videos.value = await fetchVideosFromAPI();
  loading.value = false;
});

// 4. Homepage Logic: Get the latest 3 videos based on the "date" field in WordPress
const latestVideos = computed(() => {
  return videos.value.slice(0, 3);
});

// 5. Homepage Logic: Get only the video marked as "Featured" in WordPress
const featuredVideo = computed(() => {
  return videos.value.find(v => v.acf?.video_featured === true) || videos.value[0];
});

</script>

<template>
  <main v-if="!loading && homeData">
    
    <section class="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex flex-col justify-start pt-12">
  
      <img 
        :src="homeData.acf.hero_image.url" 
        class="absolute inset-0 w-full h-full object-cover"
        :alt="homeData.acf.hero_image.alt || 'Hero Background'"
      />

      <div class="absolute inset-0 bg-black/30"></div>

      <div class="grid grid-cols-12 gap-4 md:gap-8 px-4 md:px-8 md:pl-[5%] md:pr-[5%] relative z-10 w-full">
        <div class="col-span-12 md:col-span-6">
          <h1 class="text-white">
            {{ lbl('homepage.title') }}
          </h1>
        </div>
      </div>

    </section>

  </main>
</template>

