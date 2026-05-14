<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { fetchVideoBySlug, formatDate, shareOnLinkedIn, shareOnFacebook, shareOnInstagram, shareViaEmail } from '../utils/mediaFunctions.js';

const route = useRoute();
const video = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const slug = route.params.slug;
    video.value = await fetchVideoBySlug(slug);
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

const shareUrl = computed(() => window.location.href);
const videoTitle = computed(() => video.value?.title?.rendered || 'Check out this video');

const handleShareLinkedIn = () => shareOnLinkedIn(shareUrl.value);
const handleShareFacebook = () => shareOnFacebook(shareUrl.value);
const handleShareInstagram = () => shareOnInstagram();
const handleShareEmail = () => shareViaEmail(videoTitle.value, shareUrl.value);
</script>

<template>
  <div v-if="loading" class="text-center py-20">Loading...</div>
  <div v-else-if="error" class="text-red-500 text-center py-20">{{ error }}</div>
  
  <div v-else class="min-h-screen bg-white">
    <div class="bg-semi-dark-blue py-4 px-[5%]">
      <router-link to="/media" class="text-white flex items-center gap-2 hover:opacity-80 transition-opacity">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        Back to Media
      </router-link>
    </div>

    <!-- 2. Video Player Section -->
    <div class="px-[5%] py-10">
      <div v-if="video.acf?.video_link" class="w-full rounded-2xl overflow-hidden bg-black shadow-2xl aspect-video mx-auto max-w-6xl">
        <div v-html="video.acf.video_link" class="w-full h-full video-container"></div>
      </div>
    </div>

    <!-- 3. Content Grid (Two Columns) -->
    <div class="px-[5%] pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
      
      <!-- Left Column: Info & Description -->
      <div class="lg:col-span-8">
        <div class="flex items-center gap-4 mb-4">
          <span class="bg-[#1a2333] text-white px-4 py-1 rounded text-sm font-medium">
            {{ video.acf?.video_type?.name || 'Video' }}
          </span>
          <span class="text-gray-500 text-sm">
            {{ formatDate(video.date) }}
          </span>
        </div>

        <h1 v-html="video.title.rendered" class="text-3xl font-bold text-black mb-6"></h1>

        <div v-if="video.content?.rendered" class="prose max-w-none text-gray-700 leading-relaxed">
          <div v-html="video.content.rendered"></div>
        </div>
      </div>

      <!-- Right Column: Share Sidebar -->
      <div class="lg:col-span-4 border-t lg:border-t-0 pt-8 lg:pt-0">
        <h3 class="font-bold text-black mb-4">Share this video</h3>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          Found this article helpful or interesting? Spread the word by sharing it on your social media or email.
        </p>
        
        <div class="flex gap-4">
            <button @click="shareOnLinkedIn" class="text-black hover:text-blue transition" title="Share on LinkedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </button>
            <button @click="shareOnFacebook" class="text-black hover:text-blue transition" title="Share on Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </button>
            <button @click="shareOnInstagram" class="text-black hover:text-blue transition" title="Share on Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </button>
            <button @click="shareViaEmail" class="text-black hover:text-blue transition" title="Share via email">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Ensure the iframe/video fills the rounded container */

</style>