<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const events = ref([]);
const loading = ref(true);
const selectedEvent = ref(null);

const GRAPHQL_URL = 'http://businessdedk.lucasalmeida.dk/graphql';

const QUERY = `
{
  galleryEvents {
    nodes {
      title
      slug
      galleryEventFields {
        date
        description
        coverimg {
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
    events.value = response.data.data.galleryEvents.nodes;
  } catch (err) {
    console.error('Failed to load gallery:', err);
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
};

const openPopup = (event) => {
  selectedEvent.value = event;
};

const closePopup = () => {
  selectedEvent.value = null;
};

const nextEvent = () => {
  const index = events.value.indexOf(selectedEvent.value);
  selectedEvent.value = events.value[(index + 1) % events.value.length];
};

const prevEvent = () => {
  const index = events.value.indexOf(selectedEvent.value);
  selectedEvent.value = events.value[(index - 1 + events.value.length) % events.value.length];
};
</script>

<template>
  <!-- Hero Banner -->
  <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
    <div class="col-span-12">
      <h1 class="text-white mb-4 md:mb-6">Gallery</h1>
    </div>
    <div class="col-span-12 md:col-span-8">
      <p class="text-off-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        Browse photos and videos from our events, meetups, and network gatherings.
      </p>
    </div>
  </section>

  <!-- Gallery Grid -->
  <div class="basegrid py-12">
    <div v-if="loading" class="col-span-12 text-center py-20 text-gray-500">
      Loading gallery...
    </div>

    <div v-else class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="event in events" :key="event.slug"
        class="flex flex-col group cursor-pointer"
        @click="openPopup(event)">

        <div class="overflow-hidden rounded-xl mb-4 relative">
          <img v-if="event.galleryEventFields?.coverimg?.node?.sourceUrl"
            :src="event.galleryEventFields.coverimg.node.sourceUrl"
            :alt="event.title"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"/>
          <span class="absolute top-3 right-3 bg-dark-blue text-white text-xs px-3 py-1 rounded-full">
            {{ formatDate(event.galleryEventFields?.date) }}
          </span>
        </div>

        <h3 class="font-bold text-dark-blue mb-2">{{ event.title }}</h3>
        <p class="text-gray-600 text-sm">{{ event.galleryEventFields?.description }}</p>
      </div>
    </div>
  </div>

  <!-- Popup / Lightbox -->
  <div v-if="selectedEvent" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
    @click.self="closePopup">

    <div class="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full">

      <!-- Close button -->
      <button @click="closePopup"
        class="absolute top-4 right-4 bg-dark-blue text-white w-8 h-8 rounded-full flex items-center justify-center z-10 hover:bg-blue transition-colors">
        ✕
      </button>

      <!-- Image -->
      <div class="relative">
        <img v-if="selectedEvent.galleryEventFields?.coverimg?.node?.sourceUrl"
          :src="selectedEvent.galleryEventFields.coverimg.node.sourceUrl"
          :alt="selectedEvent.title"
          class="w-full h-80 object-cover"/>

        <!-- Prev / Next -->
        <button @click="prevEvent"
          class="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center shadow transition-all">
          ‹
        </button>
        <button @click="nextEvent"
          class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-full flex items-center justify-center shadow transition-all">
          ›
        </button>

        <!-- Caption -->
        <div class="absolute bottom-0 left-0 right-0 bg-dark-blue bg-opacity-80 text-white text-sm px-6 py-3">
          {{ selectedEvent.title }} — {{ formatDate(selectedEvent.galleryEventFields?.date) }}
        </div>
      </div>

      <!-- Thumbnails -->
      <div class="flex gap-2 p-4 overflow-x-auto">
        <img v-for="ev in events" :key="ev.slug"
          :src="ev.galleryEventFields?.coverimg?.node?.sourceUrl"
          :alt="ev.title"
          @click="selectedEvent = ev"
          :class="selectedEvent.slug === ev.slug ? 'ring-2 ring-dark-blue' : 'opacity-60'"
          class="w-16 h-12 object-cover rounded-lg cursor-pointer hover:opacity-100 transition-opacity shrink-0"/>
      </div>
    </div>
  </div>

  </template>