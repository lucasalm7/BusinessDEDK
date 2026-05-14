<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

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

    <section class="bg-dark-blue py-20 px-8 md:pl-[5%] md:pr-[5%]">
      <div class="max-w-4xl">
        <h1 class="text-white text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Media
        </h1>
        
        <p class="text-white text-lg md:text-2xl font-medium leading-relaxed max-w-2xl opacity-90">
          Watch inspiring stories, expert interviews, and 
          success cases from our cross-border community.
        </p>
      </div>
    </section>

  <div class="basegrid">

    <div class="video-grid">
      <div v-for="video in videos" :key="video.id" class="card">
        <img 
        v-if="video.acf?.thumbnail_image?.url"
        :src="video.acf.thumbnail_image.url" 
        :alt="video.acf.thumbnail_image.alt || video.title.rendered"
        class="thumbnail"
        />

        <div class="card-body">
          <h3 v-html="video.title.rendered"></h3>

          <p v-if="video.acf?.video_short_description">
            {{ video.acf.video_short_description }}
          </p>

          <router-link :to="`/video/${video.id}`" class="button">
            Watch Video
          </router-link>
        </div>
      </div>
    </div>

  </div>
  
</template>