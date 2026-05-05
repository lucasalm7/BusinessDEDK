<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const posts = ref([]);

onMounted(async () => {
  const response = await axios.get('http://businessdedk.local/wp-json/wp/v2/posts');
  posts.value = response.data;
});
</script>

<template>
  <div v-for="post in posts" :key="post.id">
    <h2 v-html="post.title.rendered"></h2>
    <div v-html="post.excerpt.rendered"></div>
  </div>
</template>