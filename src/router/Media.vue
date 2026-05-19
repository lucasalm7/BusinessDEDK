<script setup>
import { ref, onMounted, inject } from 'vue';
import axios from 'axios';
import MediaGrid from '../components/MediaGrid.vue';
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js';

const siteLanguage = inject('siteLanguage');
const lbl = (key) => getLabel(key, siteLanguage.value);
const videos = ref([]);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    // Fetching the Custom Post Type "video"
    const response = await axios.get('const response = await axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/advisor?per_page=${perPage}&page=${page}&acf_format=standard&v=${cacheBuster}`);');
    videos.value = response.data;
  } catch (err) {
    error.value = "Failed to load data: " + err.message;
  } finally {
    loading.value = false;
  }
});

// Function to turn any title string into a clean url-slug (e.g. "Hello World!" -> "hello-world")
const slugifyTitle = (video) => {
  // Use the translated title if available, otherwise fallback to the default WP title object
  const rawTitle = t(video, 'title') || video.title?.rendered || '';
  
  const cleanSlug = rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Strip out punctuation characters like ?, !, /
    .trim()
    .replace(/\s+/g, '-');        // Turn all spaces into single hyphens
    
  return `${video.id}-${cleanSlug}`;
};
</script>

<template>

  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">
        {{lbl('mediapage.mediaTitle')}}
      </h1>
    </div>

    <div class="col-span-12 md:col-span-8">
      <p class="text-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        {{lbl('mediapage.mediaDescription')}}
      </p>
    </div>
  </section>

  <media-grid :videos="videos" />
  
</template>