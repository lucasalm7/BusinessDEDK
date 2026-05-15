<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const events = ref([]);
const loading = ref(true);
const selectedEvent = ref(null);

const selectedType = ref('All');
const selectedCountry = ref('All');
const dateFrom = ref('');
const dateTo = ref('');
const activeDropdown = ref(null);

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

const filteredEvents = computed(() => {
  return events.value.filter(e => {
    const matchesType = selectedType.value === 'All' || e.galleryEventFields?.type === selectedType.value;
    const matchesCountry = selectedCountry.value === 'All';
    const eventDate = new Date(e.galleryEventFields?.date);
    const matchesFrom = !dateFrom.value || eventDate >= new Date(dateFrom.value);
    const matchesTo = !dateTo.value || eventDate <= new Date(dateTo.value);
    return matchesType && matchesCountry && matchesFrom && matchesTo;
  });
});

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
          node { sourceUrl }
        }
        image2 {
          node { sourceUrl }
        }
        image3 {
          node { sourceUrl }
        }
        image4 {
          node { sourceUrl }
        }
        image5 {
          node { sourceUrl }
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

const getEventImages = (event) => {
  const fields = event.galleryEventFields;
  return [
    fields?.coverimg?.node?.sourceUrl,
    fields?.image2?.node?.sourceUrl,
    fields?.image3?.node?.sourceUrl,
    fields?.image4?.node?.sourceUrl,
    fields?.image5?.node?.sourceUrl,
  ].filter(Boolean);
};

const selectedImages = computed(() => {
  if (!selectedEvent.value) return [];
  return getEventImages(selectedEvent.value);
});

const currentImageIndex = ref(0);

const openPopup = (event) => {
  selectedEvent.value = event;
  currentImageIndex.value = 0;
};

const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % selectedImages.value.length;
};

const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + selectedImages.value.length) % selectedImages.value.length;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
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
      <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">Gallery</h1>
    </div>
    <div class="col-span-12 md:col-span-8">
      <p class="text-off-white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
        Browse photos and videos from our events, meetups, and network gatherings.
      </p>
    </div>
  </section>

  <!-- Filters -->
<div class="basegrid py-6">
  <div class="col-span-12">
    <p class="text-gray-600 mb-4 text-sm font-medium">Filter by</p>
    <div class="flex flex-wrap gap-4 items-center">

      <button @click="selectedType = 'All'; selectedCountry = 'All'; dateFrom = ''; dateTo = ''"
        :class="selectedType === 'All' ? 'bg-slate-900 text-white' : 'bg-white border text-gray-700'"
        class="px-6 py-2 rounded-xl transition-all text-sm">
        All events
      </button>

      <!-- Country -->
      <div class="relative">
        <button @click="toggleDropdown('country')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
          Country <span class="font-light">{{ selectedCountry !== 'All' ? ': ' + selectedCountry : '▼' }}</span>
        </button>
        <div v-if="activeDropdown === 'country'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-48 overflow-hidden">
          <button @click="selectedCountry = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">All</button>
          <button @click="selectedCountry = 'Denmark'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Denmark</button>
          <button @click="selectedCountry = 'Germany'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Germany</button>
        </div>
      </div>

      <!-- Type -->
      <div class="relative">
        <button @click="toggleDropdown('type')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
          Type <span class="font-light">{{ selectedType !== 'All' ? ': ' + selectedType : '▼' }}</span>
        </button>
        <div v-if="activeDropdown === 'type'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 w-48 overflow-hidden">
          <button @click="selectedType = 'All'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">All</button>
          <button @click="selectedType = 'Gathering'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Gathering</button>
          <button @click="selectedType = 'Forum'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Forum</button>
          <button @click="selectedType = 'Breakfast'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Breakfast</button>
          <button @click="selectedType = 'Job Fair'; activeDropdown = null" class="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">Job Fair</button>
        </div>
      </div>

      <!-- Date range -->
      <div class="relative">
        <button @click="toggleDropdown('date')" class="bg-white border border-gray-200 px-6 py-2 rounded-xl flex items-center gap-2 text-sm">
          Date range <span class="font-light">▼</span>
        </button>
        <div v-if="activeDropdown === 'date'" class="absolute top-12 left-0 bg-white border rounded-xl shadow-lg z-50 p-4 w-64">
          <p class="text-gray-500 text-xs mb-1">From</p>
          <input type="date" v-model="dateFrom" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          <p class="text-gray-500 text-xs mb-1">To</p>
          <input type="date" v-model="dateTo" class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
      </div>

    </div>
  </div>
</div>

  <!-- Gallery Grid -->
  <div class="basegrid py-12">
    <div v-if="loading" class="col-span-12 text-center py-20 text-gray-500">
      Loading gallery...
    </div>

    <div v-else class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div v-for="event in filteredEvents" :key="event.slug"
        class="flex flex-col group cursor-pointer"
        @click="openPopup(event)">

        <div class="overflow-hidden rounded-xl mb-4 relative">
          <img v-if="event.galleryEventFields?.coverimg?.node?.sourceUrl"
            :src="event.galleryEventFields.coverimg.node.sourceUrl"
            :alt="event.title"
            class="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"/>
          <span class="absolute top-3 right-3 bg-dark-blue text-white text-sm px-4 py-1.5 rounded-md">
            {{ formatDate(event.galleryEventFields?.date) }}
          </span>
        </div>

        <h3 class="font-bold text-dark-blue mb-2">{{ event.title }}</h3>
        <p class="text-gray-600 text-sm">{{ event.galleryEventFields?.description }}</p>
      </div>
    </div>
  </div>

<!-- Popup / Lightbox -->
<div v-if="selectedEvent" 
  class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
  @click.self="closePopup">

  <div class="relative bg-white rounded-2xl overflow-hidden max-w-3xl w-full">

    <!-- Close button -->
    <button @click="closePopup"
      class="absolute top-4 right-4 bg-dark-blue text-white w-8 h-8 rounded-md flex items-center justify-center z-10 hover:bg-blue transition-colors">
      ✕
    </button>

    <!-- Main Image -->
    <div class="relative">
      <img :src="selectedImages[currentImageIndex]"
        :alt="selectedEvent.title"
        class="w-full h-80 object-cover"/>

      <!-- Prev / Next -->
      <button @click="prevImage"
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-md flex items-center justify-center shadow transition-all text-xl">
        ‹
      </button>
      <button @click="nextImage"
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 w-10 h-10 rounded-md flex items-center justify-center shadow transition-all text-xl">
        ›
      </button>

      <!-- Caption -->
      <div class="absolute bottom-0 left-0 right-0 bg-dark-blue bg-opacity-80 text-white text-sm px-6 py-3">
        {{ selectedEvent.title }} — {{ formatDate(selectedEvent.galleryEventFields?.date) }}
      </div>
    </div>

    <!-- Thumbnails -->
    <div class="flex gap-2 p-4 overflow-x-auto">
      <img v-for="(img, index) in selectedImages" :key="index"
        :src="img"
        @click="currentImageIndex = index"
        :class="currentImageIndex === index ? 'ring-2 ring-dark-blue opacity-100' : 'opacity-60'"
        class="w-16 h-12 object-cover rounded-lg cursor-pointer hover:opacity-100 transition-opacity shrink-0"/>
    </div>
  </div>
</div>

  </template>