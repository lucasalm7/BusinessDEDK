<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const articles = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedTopic = ref('All');
const activeDropdown = ref(null);
const selectedCountry = ref('All');
const selectedAudience = ref('All');
const selectedDate = ref('All');

const GRAPHQL_URL = 'http://businessdedk.lucasalmeida.dk/graphql';

const QUERY = `
{
  blogposts {
    nodes {
      title
      slug
      blogPostFields {
        category
        date
        subtittle
        readtime
        image {
          node {
            sourceUrl
          }
        }
      }
    }
  }
}
`;

onMounted(async () => {
  try {
    const response = await axios.post(GRAPHQL_URL, { query: QUERY });
    articles.value = response.data.data.blogposts.nodes;
  } catch (err) {
    error.value = 'Failed to load articles: ' + err.message;
  } finally {
    loading.value = false;
  }
});

const topics = computed(() => {
  const cats = articles.value.map(a => a.blogPostFields?.category).filter(Boolean);
  return ['All', ...new Set(cats)];
});

const filteredArticles = computed(() => {
  return articles.value.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      a.blogPostFields?.subtittle?.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesTopic = selectedTopic.value === 'All' || a.blogPostFields?.category === selectedTopic.value;
    return matchesSearch && matchesTopic;
  });
});

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', { month: 'long', day: '2-digit', year: 'numeric' });
};
</script>

<template>
  <!-- Hero Banner -->
  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">Cross-Border Business Blog</h1>
    </div>
    <div class="col-span-12 md:col-span-8">
      <p class="text-off-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        News, analysis and insights for doing business across the Danish–German border
      </p>
    </div>
  </section>

  <!-- Filters & Grid -->
  <div class="basegrid py-12">
    <div class="col-span-12 mb-6">

      <!-- Search -->
      <div class="relative max-w-sm mb-8">
        <span class="absolute inset-y-0 left-3 flex items-center">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="Search by name, topic, country..."
          class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>

      <!-- Filter buttons -->
      <p class="text-gray-600 mb-4 text-sm font-medium">Filter by</p>
<div class="flex flex-wrap gap-4 items-center">
  <button @click="selectedTopic = 'All'; selectedAudience = 'All'; selectedCountry = 'All'"
    :class="selectedTopic === 'All' ? 'bg-slate-900 text-white' : 'bg-white border text-gray-700'"
    class="px-6 py-2 rounded-xl transition-all text-sm">
    All articles
  </button>

  <!-- Topic dropdown -->
  <div class="relative">
    <button @click="toggleDropdown('topic')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
      Topic <span class="text-sm font-light">{{ selectedTopic !== 'All' ? ': ' + selectedTopic : '▼' }}</span>
    </button>
    <div v-if="activeDropdown === 'topic'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-48 overflow-hidden">
      <button v-for="topic in topics" :key="topic"
        @click="selectedTopic = topic; activeDropdown = null"
        class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
        {{ topic }}
      </button>
    </div>
  </div>

  <!-- Country dropdown -->
  <div class="relative">
    <button @click="toggleDropdown('country')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
      Country <span class="text-sm font-light">{{ selectedCountry !== 'All' ? ': ' + selectedCountry : '▼' }}</span>
    </button>
    <div v-if="activeDropdown === 'country'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-48 overflow-hidden">
      <button @click="selectedCountry = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">All</button>
      <button @click="selectedCountry = 'Denmark'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Denmark</button>
      <button @click="selectedCountry = 'Germany'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Germany</button>
    </div>
  </div>

  <!-- Audience dropdown -->
  <div class="relative">
    <button @click="toggleDropdown('audience')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
      Audience <span class="text-sm font-light">{{ selectedAudience !== 'All' ? ': ' + selectedAudience : '▼' }}</span>
    </button>
    <div v-if="activeDropdown === 'audience'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-48 overflow-hidden">
      <button @click="selectedAudience = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">All</button>
      <button @click="selectedAudience = 'Businesses'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Businesses</button>
      <button @click="selectedAudience = 'Freelancers'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Freelancers</button>
      <button @click="selectedAudience = 'Startups'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Startups</button>
    </div>
  </div>

  <!-- Date range dropdown -->
  <div class="relative">
    <button @click="toggleDropdown('date')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
      Date range <span class="text-sm font-light">{{ selectedDate !== 'All' ? ': ' + selectedDate : '▼' }}</span>
    </button>
    <div v-if="activeDropdown === 'date'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-48 overflow-hidden">
      <button @click="selectedDate = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">All</button>
      <button @click="selectedDate = '2026'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">2026</button>
      <button @click="selectedDate = '2025'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">2025</button>
    </div>
  </div>
</div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="col-span-12 text-center py-20 text-gray-500">
      Loading articles...
    </div>

    <!-- Error -->
    <div v-else-if="error" class="col-span-12 text-center py-20 text-red-500">
      {{ error }}
    </div>

    <!-- Articles Grid -->
    <div v-else class="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
      <div v-for="article in filteredArticles" :key="article.slug" class="flex flex-col group cursor-pointer">

        <router-link :to="`/blog/${article.slug}`" class="overflow-hidden rounded-xl mb-4 relative">
          <img v-if="article.blogPostFields?.image?.node?.sourceUrl"
            :src="article.blogPostFields.image.node.sourceUrl"
            :alt="article.title"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"/>
          <span class="absolute top-3 right-3 bg-dark-blue text-white text-sm px-4 py-1.5 rounded-md">
            {{ article.blogPostFields?.category }}
          </span>
        </router-link>

        <div class="flex flex-col items-start">
          <router-link :to="`/blog/${article.slug}`">
            <h3 class="font-bold text-dark-blue mb-2 hover:text-blue transition-colors">
              {{ article.title }}
            </h3>
          </router-link>

          <p class="text-gray-500 text-sm mb-2">{{ formatDate(article.blogPostFields?.date) }}</p>

          <p class="text-gray-700 text-sm mb-4 line-clamp-2">
            {{ article.blogPostFields?.subtittle }}
          </p>

          <router-link :to="`/blog/${article.slug}`" class="flex items-center gap-2 text-sm font-medium text-black hover:underline">
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>

      <!-- No results -->
      <div v-if="filteredArticles.length === 0" class="col-span-12 text-center py-20 text-gray-500">
        No articles found matching your criteria.
      </div>
    </div>  
  </div>
</template>