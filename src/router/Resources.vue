<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const resources = ref([]);
const articles = ref([]);
const loading = ref(true);
const openIndex = ref(null);

const GRAPHQL_URL = 'http://businessdedk.lucasalmeida.dk/graphql';

const QUERY = `
{
  resources {
    nodes {
      title
      slug
      resourceFields {
        description
        file {
          node {
            sourceUrl
          }
        }
      }
    }
  }
  blogposts(first: 3) {
    nodes {
      title
      slug
      blogPostFields {
        category
        date
        subtittle
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
    resources.value = response.data.data.resources.nodes;
    articles.value = response.data.data.blogposts.nodes;
  } catch (err) {
    console.error('Failed to load data:', err);
  } finally {
    loading.value = false;
  }
});

const toggleAccordion = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'long', day: '2-digit', year: 'numeric' });
};
</script>

<template>
  <!-- Hero Banner -->
  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6">Resources you could need</h1>
    </div>
  </section>

  <div class="basegrid py-12">

    <!-- Strategic Insights & Guides -->
<div class="col-span-10 col-start-2">
      <h2 class="text-dark-blue font-bold mb-2">Strategic Insights & Guides</h2>
      <p class="text-gray-500 text-sm mb-6">Essential documentation and frameworks to help you navigate the cross-border business landscape effectively.</p>

      <!-- Accordion -->
      <div class="flex flex-col gap-4 max-w-lg">
        <div v-for="(resource, index) in resources" :key="resource.slug">
          <button
            @click="toggleAccordion(index)"
            class="w-full flex items-center gap-3 bg-blue-50 hover:bg-blue-100 text-dark-blue font-medium px-5 py-4 rounded-lg transition-colors text-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="openIndex === index ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {{ resource.title }}
          </button>

          <!-- Accordion Content -->
          <div v-if="openIndex === index" class="bg-gray-50 px-5 py-4 rounded-b-lg border border-t-0 border-gray-200">
            <p class="text-gray-600 text-sm mb-4">{{ resource.resourceFields?.description }}</p>
            <a v-if="resource.resourceFields?.file?.node?.sourceUrl"
              :href="resource.resourceFields.file.node.sourceUrl"
              target="_blank"
              class="inline-flex items-center gap-2 bg-dark-blue text-white text-sm px-4 py-2 rounded-lg hover:bg-blue transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Latest Articles -->
<div class="col-span-10 col-start-2">
      <h2 class="text-dark-blue font-bold mb-8">Latest articles</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="article in articles" :key="article.slug" class="flex flex-col group cursor-pointer">
          <router-link :to="`/blog/${article.slug}`" class="overflow-hidden rounded-xl mb-4 relative">
            <img v-if="article.blogPostFields?.image?.node?.sourceUrl"
              :src="article.blogPostFields.image.node.sourceUrl"
              :alt="article.title"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"/>
            <span class="absolute top-3 right-3 bg-dark-blue text-white text-xs px-3 py-1 rounded-full">
              {{ article.blogPostFields?.category }}
            </span>
          </router-link>
          <h3 class="font-bold text-dark-blue mb-2">{{ article.title }}</h3>
          <p class="text-gray-500 text-sm mb-2">{{ formatDate(article.blogPostFields?.date) }}</p>
          <p class="text-gray-700 text-sm mb-4 line-clamp-2">{{ article.blogPostFields?.subtittle }}</p>
          <router-link :to="`/blog/${article.slug}`" class="flex items-center gap-2 text-sm font-medium text-black hover:underline">
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