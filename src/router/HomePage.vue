<script setup>
import { ref, onMounted, inject, computed } from 'vue';
import { fetchVideosFromAPI } from '../utils/mediaFunctions.js';
import { getTranslatedContent, getLabel } from '../utils/translationFunction.js';
import { fetchPageData, fetchNetworkLogos, fetchRecentBlogPosts } from '../utils/homeFunctions.js';
import axios from 'axios';
import NewsletterSubscription from '../components/NewsletterSubscription.vue';

const siteLanguage = inject('siteLanguage');
const lbl = (key) => getLabel(key, siteLanguage.value);
const t = (item, field) => getTranslatedContent(item, field, siteLanguage.value);

const recentPosts = ref([]);
const blogLoading = ref(true);
const videos = ref([]);
const loading = ref(true);
const homeData = ref(null);
const networkLogos = ref([]);
const events = ref([]);
const eventsLoading = ref(true);

const months = computed(() => {
  return [
    lbl('months.jan'),
    lbl('months.feb'),
    lbl('months.mar'),
    lbl('months.apr'),
    lbl('months.may'),
    lbl('months.jun'),
    lbl('months.jul'),
    lbl('months.aug'),
    lbl('months.sep'),
    lbl('months.oct'),
    lbl('months.nov'),
    lbl('months.dec')
  ];
});
function formatDay(dateStr) { return dateStr ? dateStr.slice(6, 8) : ''; }
function formatMonth(dateStr) { return dateStr ? months.value[parseInt(dateStr.slice(4, 6)) - 1] : ''; }

onMounted(async () => {
  homeData.value = await fetchPageData(227);
  videos.value = await fetchVideosFromAPI();
  networkLogos.value = await fetchNetworkLogos();
  recentPosts.value = await fetchRecentBlogPosts();
  blogLoading.value = false;
  loading.value = false;
  try {
    const res = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/event?acf_format=standard&_embed&per_page=100');
    events.value = res.data;
  } catch (err) {
    console.error('Failed to load upcoming events banner data:', err);
  } finally {
    eventsLoading.value = false;
  }
});

const featuredVideo = computed(() => {
  if (!videos.value || videos.value.length === 0) return null;
  return videos.value.find(video => video.acf?.video_featured === true) || null;
});

const upcomingEvents = computed(() => {
  if (!events.value || events.value.length === 0) return [];
  
  const todayStr = new Date().toISOString().split('T')[0].replace(/-/g, ''); // Format: YYYYMMDD
  
  return events.value
    .filter(event => {
      // Filter out events that do not have a valid date or are in the past
      const eventDate = event.acf?.event_date;
      return eventDate && eventDate >= todayStr;
    })
    .sort((a, b) => {
      // Sort chronologically ascending (closest event first)
      return parseInt(a.acf.event_date) - parseInt(b.acf.event_date);
    })
    .slice(0, 3); // Limit to the top 3 cards exactly like your screen layout design
});

</script>

<template>
  <main v-if="!loading && homeData">
    
    <!-- Hero Image -->
    <section class="relative h-[60vh] md:h-[80vh] w-full overflow-hidden flex flex-col justify-start pt-12">
  
      <img :src="homeData.acf.hero_image.url" class="absolute inset-0 w-full h-full object-cover" :alt="homeData.acf.hero_image.alt || 'Hero Background'"/>

      <div class="grid grid-cols-12 gap-4 md:gap-8 px-4 md:px-8 md:pl-[5%] md:pr-[5%] relative z-10 w-full">
        <div class="col-span-12 md:col-span-6">
          <h1 class="text-white">{{ lbl('homepage.title') }}</h1>
        </div>
      </div>

    </section>


    <!-- Network logos rolling -->
    <section class=" bg-white overflow-hidden my-8">

      <div class="relative flex w-full overflow-x-hidden group">
        
        <div class="flex animate-marquee whitespace-nowrap gap-12 items-center min-w-full shrink-0">
          <div v-for="company in networkLogos" :key="'a-' + company.id" class="w-32 h-16 flex items-center justify-center shrink-0 mx-4">
            <img :src="company.logoUrl" :alt="company.title" class="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          </div>
        </div>

        <div class="flex animate-marquee whitespace-nowrap gap-12 items-center min-w-full shrink-0" aria-hidden="true">
          <div v-for="company in networkLogos" :key="'b-' + company.id" class="w-32 h-16 flex items-center justify-center shrink-0 mx-4">
            <img :src="company.logoUrl" :alt="company.title" class="max-w-full max-h-full object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
          </div>
        </div>

      </div>
    </section>

      <!-- Shortcuts -->
      <section class="basegrid my-8">
        
        <div class="col-span-12 bg-semi-dark-blue rounded-xl text-white px-6 py-10 md:px-12 md:py-12">
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-12 items-center">
            
            <router-link to="/become-a-member" class="flex items-center gap-4 group cursor-pointer">
              <div class="shrink-0">
                <svg class="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M13.5 13.25L10 15.5l-3.5-2.25v-3.5L10 7.5l3.5 2.25zm-9-6.5L2.5 8l-2-1.25v-2l2-1.25l2 1.25zm15-2L17.5 6l-2-1.25v-2l2-1.25l2 1.25zm-15 16.5l-2 1.25l-2-1.25v-2l2-1.25l2 1.25zm16.5 1l-2 1.25l-2-1.25v-2L19 19l2 1.25zm1.5-9.75l-2 1.25l-2-1.25v-2l2-1.25l2 1.25zm-16-2.75L3.813 7.18m13.883 12.635l-5.968-5.426M18.5 11.5h-5m-5.548 2.684l-4.27 4.555M16.318 5.261l-3.686 3.931" />
                </svg>
              </div>
              <div class="flex items-center justify-between w-full gap-2">
                <p class="text-base md:text-lg font-medium leading-snug">
                  {{lbl('homepage.shortcutnetwork')}}
                </p>
                <span class="text-xl transform group-hover:translate-x-1 transition-transform duration-200 shrink-0">➔</span>
              </div>
            </router-link>

            <router-link to="/resources" class="flex items-center gap-4 group cursor-pointer">
              <div class="shrink-0">
                <svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 16l12 6 12-6-12-6-12 6zM12 24l12 6 12-6M12 32l12 6 12-6" />
                </svg>
              </div>
              <div class="flex items-center justify-between w-full gap-2">
                <p class="text-base md:text-lg font-medium leading-snug">
                  {{lbl('homepage.shortcutresources')}}
                </p>
                <span class="text-xl transform group-hover:translate-x-1 transition-transform duration-200 shrink-0">➔</span>
              </div>
            </router-link>

            <router-link to="/border-region" class="flex items-center gap-4 group cursor-pointer">
              <div class="shrink-0">
                <svg class="w-12 h-12 text-white" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.5">
                  <circle cx="24" cy="24" r="16" />
                  <path d="M24 20v11M24 16h.01" stroke-linecap="round" />
                </svg>
              </div>
              <div class="flex items-center justify-between w-full gap-2">
                <p class="text-base md:text-lg font-medium leading-snug">
                  {{lbl('homepage.shortcutborder')}}
                </p>
                <span class="text-xl transform group-hover:translate-x-1 transition-transform duration-200 shrink-0">➔</span>
              </div>
            </router-link>

          </div>
        </div>
      </section>

      <!-- Recent blog posts -->
      <section class="basegrid bg-white my-8">
  
        <div class="col-span-12 flex justify-between items-center mb-6">
          <h2 class="text-2xl md:text-3xl font-extrabold text-black tracking-tight">
            {{lbl('homepage.latestblog')}}
          </h2>
          <router-link 
            to="/blog" 
            class="border border-dark-blue text-blue hover:bg-slate-900 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-all"
          >
            {{lbl('general.seeall')}}
          </router-link>
        </div>

        <div v-if="blogLoading" class="col-span-12 text-center py-10 text-dark-blue text-sm">
          {{lbl('blog.loading')}}
        </div>

        <div v-else class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div 
            v-for="post in recentPosts" 
            :key="post.slug" 
            class="flex flex-col group cursor-pointer"
          >
            <router-link :to="`/blog/${post.slug}`" class="overflow-hidden rounded-xl mb-4 h-56">
              <img 
                v-if="post.blogPostFields?.image?.node?.sourceUrl"
                :src="post.blogPostFields.image.node.sourceUrl"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-blue">
                {{lbl('blog.noimage')}}
              </div>
            </router-link>

            <div class="flex flex-col">
              <span class="text-sm text-blue font-normal mb-1">
                {{ post.blogPostFields?.category || 'General Type' }}
              </span>
              
              <router-link :to="`/blog/${post.slug}`">
                <h3 class="text-lg font-bold text-dark-blue leading-snug hover:text-blue-900 transition-colors mb-2">
                  {{ post.title }}
                </h3>
              </router-link>

              <p class="text-blue text-sm font-light leading-relaxed line-clamp-3">
                {{ post.blogPostFields?.subtittle }}
              </p>
            </div>
          </div>
        </div>

      </section>

      <!--Highlited video -->
      <section class="basegrid bg-white my-8">
        <div 
          v-if="featuredVideo" 
          class="col-span-12 bg-semi-dark-blue rounded-xl overflow-hidden text-white grid grid-cols-1 md:grid-cols-12"
        >
          
          <div class="col-span-12 md:col-span-6 p-8 md:p-12 lg:p-16 flex flex-col justify-center items-start">
            
            <h2 v-html="t(featuredVideo, 'title')" class="text-2xl md:text-3xl font-bold tracking-tight text-white mb-4"></h2>
            
            <p class="text-white text-sm md:text-base font-light leading-relaxed mb-8 max-w-sm">
              {{ featuredVideo.acf?.video_short_description }}
            </p>
            
            <router-link 
              :to="`/video/${featuredVideo.id}`"
              class="bg-white text-dark-blue hover:bg-blue hover:text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all inline-flex items-center"
            >
              {{ lbl('homepage.viewvideo') }}
            </router-link>
          </div>

          <div class="col-span-12 md:col-span-6 relative min-h-62 md:min-h-full border-rounded-xl overflow-hidden">
            <img 
              v-if="featuredVideo.acf?.thumbnail_image?.url"
              :src="featuredVideo.acf.thumbnail_image.url" 
              :alt="featuredVideo.acf.thumbnail_image.alt || featuredVideo.title?.rendered" 
              class="absolute inset-0 w-full h-full object-cover"
            />
            
          </div>

        </div>
      </section>

        <!-- Upcoming events -->
      <section class="basegrid my-8 bg-white">
        
        <div class="col-span-12 flex justify-between items-center mb-6">
          <h2 class="text-2xl md:text-3xl font-extrabold text-dark-blue tracking-tight">
            {{lbl('events.upcoming')}}
          </h2>
          <router-link 
            to="/events" 
            class="text-blue hover:bg-slate-900 hover:text-white px-5 py-2 rounded-xl text-sm font-medium transition-all"
          >
            {{lbl('general.seeall')}}
          </router-link>
        </div>

        <div v-if="eventsLoading" class="col-span-12 text-center py-12 text-blue text-sm">
          {{ lbl('events.loading') }}
        </div>

        <div v-else class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <router-link 
            v-for="event in upcomingEvents" 
            :key="event.id" 
            :to="`/events/${event.slug}`" 
            class="flex flex-col group cursor-pointer"
          >

            <div class="relative overflow-hidden rounded-xl mb-4">
              <img
                v-if="event._embedded?.['wp:featuredmedia']?.[0]?.source_url"
                :src="event._embedded['wp:featuredmedia'][0].source_url"
                :alt="event._embedded['wp:featuredmedia'][0].alt_text || event.title?.rendered"
                loading="lazy"
                class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div v-else class="w-full h-64 bg-light-blue"></div>
              <div v-if="event.acf?.event_date" class="absolute top-3 left-3 bg-semi-dark-blue text-white py-2 text-center rounded-xl w-20">
                <p class="text-2xl font-bold leading-none">{{ formatDay(event.acf.event_date) }}</p>
                <p class="text-xs font-bold leading-tight mt-0.5">{{ formatMonth(event.acf.event_date) }}</p>
              </div>
            </div>

            <div class="flex flex-col items-start">
              <span class="text-blue text-sm mb-1 font-light">{{ event.acf?.event_type?.name || 'Event' }}</span>
              <h3 v-html="event.title?.rendered" class="mb-2"></h3>
              <p v-if="event.acf?.event_description" class="text-blue text-sm mb-4 line-clamp-2">{{ event.acf.event_description }}</p>
              <span class="flex items-center gap-2 text-sm font-medium text-dark-blue group-hover:underline">
                View event details and register
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>

          </router-link>

          <div v-if="upcomingEvents.length === 0" class="col-span-12 text-center py-12 text-blue text-sm">
            {{lbl('events.noevents')}}
          </div>
        </div>

      </section>

      <!-- Newsletter Subscription -->
      <NewsletterSubscription />

  </main>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

/* Pause running when a user hovers mouse over a specific logo */
.group:hover .animate-marquee {
  animation-play-state: paused;
}
</style>
