<script setup>
import { ref } from 'vue'

const isDropdownOpen = ref(false)
</script>

<template>
  <nav class="grid grid-cols-12 gap-8 items-center py-6 px-8 bg-white pl-[5%] pr-[5%]">
    
    <div class="col-span-2 flex items-center">
      <img src="./assets/img/logo.png" alt="Business Region logo" class="w-auto object-contain block" style="max-width: 200px; max-height: 80px;" />
    </div>

    <div class="col-span-6 col-start-4 flex justify-between">
      <router-link to="/media" class="navtext">Media</router-link>
      <router-link to="/network" class="navtext">Network</router-link>
      <router-link to="/events" class="navtext">Events</router-link>
      <router-link to="/about" class="navtext">About</router-link>
      
      <div class="relative">
        <button 
          @click="isDropdownOpen = !isDropdownOpen" 
          class="flex items-center navtext"
        >
          More <span class="ml-1 text-xs">▼</span>
        </button>
        
        <div v-if="isDropdownOpen" 
             class="absolute left-0 mt-4 w-48 bg-white border border-gray-100 shadow-xl rounded-md z-50">
          <router-link to="/become-member" class="navdropdown">Become a member</router-link>
          <router-link to="/border-region" class="navdropdown">Border Region</router-link>
          <router-link to="/blog" class="navdropdown">Blog</router-link>
          <router-link to="/photogallery" class="navdropdown">Photogallery</router-link>
          <router-link to="/resources" class="navdropdown">Resources</router-link>
        </div>
      </div>
    </div>

    <div class="col-start-11 flex justify-center items-center text-gray-600">
      <button class="hover:text-blue-900">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>

    <div class="col-start-12 flex items-center justify-center text-gray-600">
      <button class="font-medium hover:text-blue-900">
       EN <span class="ml-1 text-xs">▼</span>
      </button>
    </div>

  </nav>

  <router-view />
</template>