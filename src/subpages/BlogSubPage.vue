<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const article = ref(null);
const allArticles = ref([]);
const loading = ref(true);
const error = ref(null);

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
        content
        stat1Value
        stat1Label
        stat2Value
        stat2Label
        stat3Value
        stat3Label
        importantNotice
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
    const nodes = response.data.data.blogposts.nodes;
    article.value = nodes.find(n => n.slug === route.params.slug);
    allArticles.value = nodes.filter(n => n.slug !== route.params.slug).slice(0, 3);
  } catch (err) {
    error.value = 'Failed to load article: ' + err.message;
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', day: '2-digit', year: 'numeric' });
};

const fields = computed(() => article.value?.blogPostFields);
</script>

<template>
  <div v-if="loading" class="text-center py-40 text-gray-500">Loading...</div>
  <div v-else-if="error" class="text-center py-40 text-red-500">{{ error }}</div>

  <div v-else-if="article">

    <!-- Back to Blog -->
    <div class="bg-semi-dark-blue px-4 md:px-[5%] py-4">
      <router-link to="/blog" class="text-off-white flex items-center gap-2 hover:text-white transition-colors text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to Blog
      </router-link>
    </div>

    <!-- Article Content -->
    <div class="basegrid py-12">
      <div class="col-span-12 md:col-span-10 md:col-start-2">
        <!-- Title -->
        <h1 class="text-dark-blue mb-4">{{ article.title }}</h1>

        <!-- Meta -->
        <div class="flex items-center gap-6 text-gray-500 text-sm mb-8 border-b border-gray-200 pb-6">
          <span class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ formatDate(fields?.date) }}
          </span>
          <span class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ fields?.readtime }} min read
          </span>
        </div>

        <!-- Stats -->
        <div v-if="fields?.stat1Value" class="grid grid-cols-3 gap-4 mb-8">
          <div class="bg-dark-blue text-white text-center py-6 px-4 rounded-lg">
            <p class="text-2xl font-bold mb-1">{{ fields.stat1Value }}</p>
            <p class="text-off-white text-xs">{{ fields.stat1Label }}</p>
          </div>
          <div class="bg-dark-blue text-white text-center py-6 px-4 rounded-lg">
            <p class="text-2xl font-bold mb-1">{{ fields.stat2Value }}</p>
            <p class="text-off-white text-xs">{{ fields.stat2Label }}</p>
          </div>
          <div class="bg-dark-blue text-white text-center py-6 px-4 rounded-lg">
            <p class="text-2xl font-bold mb-1">{{ fields.stat3Value }}</p>
            <p class="text-off-white text-xs">{{ fields.stat3Label }}</p>
          </div>
        </div>

        <!-- Important Notice -->
        <div v-if="fields?.importantNotice" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
          <p class="text-yellow-800 text-sm font-medium mb-1">Important notice</p>
          <p class="text-yellow-700 text-sm">{{ fields.importantNotice }}</p>
        </div>

        <!-- Content -->
<div v-html="fields?.content" class="[&>h2]:text-dark-blue [&>h2]:font-bold [&>h2]:text-2xl [&>h2]:mt-8 [&>h2]:mb-3 [&>h3]:text-dark-blue [&>h3]:font-bold [&>h3]:text-xl [&>h3]:mt-8 [&>h3]:mb-3 [&>h4]:text-dark-blue [&>h4]:font-semibold [&>h4]:mt-6 [&>h4]:mb-2 [&>h5]:text-dark-blue [&>h5]:font-semibold [&>h5]:mt-6 [&>h5]:mb-2 [&>p]:text-gray-700 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:text-gray-700 [&>li]:mb-2"></div>
      </div>
    </div>

    <!-- Related Articles -->
    <div class="basegrid py-12 border-t border-gray-200">
      <div class="col-span-12 mb-8">
        <h2 class="text-dark-blue font-bold">Related articles</h2>
      </div>
      <div class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="related in allArticles" :key="related.slug" class="flex flex-col group cursor-pointer">
          <router-link :to="`/blog/${related.slug}`" class="overflow-hidden rounded-xl mb-4 relative">
            <img v-if="related.blogPostFields?.image?.node?.sourceUrl"
              :src="related.blogPostFields.image.node.sourceUrl"
              :alt="related.title"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"/>
            <span class="absolute top-3 right-3 bg-dark-blue text-white text-xs px-3 py-1 rounded-full">
              {{ related.blogPostFields?.category }}
            </span>
          </router-link>
          <h3 class="font-bold text-dark-blue mb-2">{{ related.title }}</h3>
          <p class="text-gray-500 text-sm mb-2">{{ formatDate(related.blogPostFields?.date) }}</p>
          <p class="text-gray-700 text-sm mb-4 line-clamp-2">{{ related.blogPostFields?.subtittle }}</p>
          <router-link :to="`/blog/${related.slug}`" class="flex items-center gap-2 text-sm font-medium text-black hover:underline">
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>