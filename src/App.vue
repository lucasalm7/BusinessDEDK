<script>
import { ref } from 'vue'

export default {
  setup() {
    const isDropdownOpen = ref(false)
    return {
      isDropdownOpen
    }
  }
}
</script>

<template>
  <nav class="p-4">
    <router-link to="/">Home</router-link> | 
    <router-link to="/media">Media</router-link> | 
    <router-link to="/network">Network</router-link> | 
    <router-link to="/about">About</router-link> | 
    <router-link to="/events">Events</router-link> | 
    <router-link to="/advisors">Advisors</router-link> |
    
    <div class="inline-block relative">
      <button @click="isDropdownOpen = !isDropdownOpen" class="px-4 py-2 bg-gray-200 rounded cursor-pointer">
        More ▼
      </button>
      <div v-if="isDropdownOpen" class="dropdown-menu">
        <router-link to="/become-member" @click="isDropdownOpen = false">Become a member</router-link>
        <router-link to="/border-region" @click="isDropdownOpen = false">Border Region</router-link>
        <router-link to="/blog" @click="isDropdownOpen = false">Blog</router-link>
        <router-link to="/photogallery" @click="isDropdownOpen = false">Photogallery</router-link>
        <router-link to="/resources" @click="isDropdownOpen = false">Resources</router-link>
      </div>
    </div>
  </nav>
  <router-view />
</template>


<style scoped>
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  min-width: 150px;
  z-index: 1000;
}

.dropdown-menu a {
  display: block;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-menu a:last-child {
  border-bottom: none;
}

.dropdown-menu a:hover {
  background-color: #f9f9f9;
}
</style>