<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import MediaGrid from '../components/MediaGrid.vue';

const videos = ref([]);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    // Fetching the Custom Post Type "video"
    const response = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/video?acf_format=standard');
    videos.value = response.data;
  } catch (err) {
    error.value = "Failed to load data: " + err.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>

  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">
        Cross-Border Business Media
      </h1>
    </div>

    <div class="col-span-12 md:col-span-8">
      <p class="text-off-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        Watch expert interviews, cross-border business insights, recruitment stories, and Denmark-Germany success cases.
      </p>
    </div>
  </section>

  <media-grid :videos="videos" />
  
</template>