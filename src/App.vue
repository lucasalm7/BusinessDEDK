<script setup>
import { ref, onMounted, provide, watch } from 'vue';
import axios from 'axios';
import { getTranslatedContent, getLabel } from './utils/translationFunction.js';

const searchResults = ref([]);
const isSearching = ref(false);
let debounceTimeout = null;
const lastScrollTop = ref(0);
const navHidden = ref(false);
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isLanguageDropdownOpen = ref(false);
const isSearchOpen = ref(false);
const searchQuery = ref('');
const footerData = ref(null);
const currentLanguage = ref('English');
provide('siteLanguage', currentLanguage);

onMounted(async () => {
  try {
    const response = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/pages/74?acf_format=standard');
    
    if (response.data) {
      footerData.value = response.data; 
    }
  } catch (error) {
    console.error("Error fetching footer data:", error);
  }
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop.value) {
      // Scrolling down
      navHidden.value = true;
    } else {
      // Scrolling up
      navHidden.value = false;
    }
    
    lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop;
  });
});

const lbl = (key) => getLabel(key, currentLanguage.value);

const t = (item, field) => {
  if (!item) return '';

  let suffixMap = {
    'English': '',
    'Danish': '_dk',
    'German': '_de'
  };
  const suffix = suffixMap[currentLanguage.value] || '';
  const fieldName = field + suffix;
  
  return item[fieldName] || item[field] || '';
};

const languageMap = {
  'EN': 'English',
  'DA': 'Danish',
  'DE': 'German'
};

const setLanguage = (langCode) => {
  currentLanguage.value = languageMap[langCode];
  isLanguageDropdownOpen.value = false;
};

const staticPages = [
  { id: 'become', title: 'Become a Member', description: 'Join the Cross-Border Business Network Denmark & Germany', url: '/become-a-member', subtype: 'page' },
  { id: 'border', title: 'Border Region', description: 'Practical information for companies hiring across the border and individuals considering a move.', url: '/border-region', subtype: 'page' },
  { id: 'advisors', title: 'Advisors', description: 'Connect with experienced advisors who can help you navigate cross-border challenges and opportunities.', url: '/advisors', subtype: 'page' },
  { id: 'photogallery', title: 'Photo Gallery', description: 'Browse photos and videos from our events, meetups, and network gatherings.', url: '/photogallery', subtype: 'page' },
  { id: 'resources', title: 'Resources', description: 'Access a variety of resources to support your cross-border business activities.', url: '/resources', subtype: 'page' },
  { id: 'network', title: 'Network', description: 'Connect with businesses, institutions, and experts across the DE-DK region.', url: '/network', subtype: 'page' },
  { id: 'media', title: 'Media', description: 'Watch expert interviews, cross-border business insights, recruitment stories, and Denmark-Germany success cases.', url: '/media', subtype: 'page' },
  { id: 'about', title: 'About', description: 'Connect with businesses, institutions, and experts across the DE-DK region.', url: '/about', subtype: 'page' },
  { id: 'events', title: 'Events', description: 'Discover job fairs, workshops, conferences, and networking opportunities between Denmark and Germany.', url: '/events', subtype: 'page' },
  { id: 'blog', title: 'Blog', description: 'News, analysis and insights for doing business across the Danish–German border.', url: '/blog', subtype: 'page' },
  { id: 'home', title: 'Home', description: 'Cross-Border Business and Recruitment Between Denmark and Germany.', url: '/', subtype: 'page' }
];

const handleGlobalSearch = () => {
  clearTimeout(debounceTimeout);
  
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  debounceTimeout = setTimeout(async () => {
    isSearching.value = true;
    try {
      // Search WordPress
      const wpResponse = await axios.get(
        `http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/search?search=${encodeURIComponent(searchQuery.value)}&subtype=any&per_page=6`
      );
      
      // Filter static pages by query
      const staticResults = staticPages.filter(page => {
        const searchTerm = searchQuery.value.toLowerCase();
        const title = page.title.toLowerCase();
        const desc = page.description?.toLowerCase() || '';
        return title.includes(searchTerm) || desc.includes(searchTerm);
      });
      
      // Combine both, limiting to 6 total results
      searchResults.value = [...staticResults, ...wpResponse.data].slice(0, 6);
    } catch (error) {
      console.error("Global search request error:", error);
    } finally {
      isSearching.value = false;
    }
  }, 300); 
};

watch(searchQuery, () => {
  handleGlobalSearch();
});

// Helper to determine the target route based on WordPress post type
const getSearchRoute = (item) => {
  if (item.subtype === 'video') return `/video/${item.id}`;
  if (item.subtype === 'event') return `/events/${item.id}`; // Adjust if using slugs
  if (item.subtype === 'post') return `/blog/${item.id}`;
  
  // Default fallback for pages or other types
  return item.url.replace('http://businessdedk.lucasalmeida.dk', '') || '/';
};
</script>

<template>
  
  <nav :class="['basegrid', 'sticky', 'top-0', 'z-40', 'transition-transform', 'duration-300', navHidden ? '-translate-y-full' : 'translate-y-0']">
    
    <router-link to="/" class="col-span-2 md:col-span-2 flex items-center min-w-20">
      <img src="./assets/img/logo.png" alt="Business Region logo" class="w-auto object-contain block" />
    </router-link>

    <div class="col-span-9 md:hidden flex justify-end">
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-xl">
        ☰
      </button>
    </div>

    <div class="hidden md:flex col-span-6 col-start-4 justify-between">
      <router-link to="/media" class="navtext">{{lbl('nav.media')}}</router-link>
      <router-link to="/network" class="navtext">{{lbl('nav.network')}}</router-link>
      <router-link to="/events" class="navtext">{{lbl('nav.events')}}</router-link>
      <router-link to="/about" class="navtext">{{lbl('nav.about')}}</router-link>

      <div class="relative">
        <button @click="isDropdownOpen = !isDropdownOpen" class="flex items-center navtext">
          {{lbl('nav.more')}} <span class="ml-1 text-xs">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              :class="isDropdownOpen ? 'rotate-180' : ''"
              class="transition-transform duration-200 shrink-0">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </span>
        </button>
        <div v-if="isDropdownOpen" class="absolute left-0 mt-4 w-48 bg-white border border-gray-100 shadow-xl rounded-md z-50">
          <router-link to="/become-a-member" class="navdropdown" @click="isDropdownOpen = false">{{lbl('nav.becomeamember')}}</router-link>
          <router-link to="/border-region" class="navdropdown" @click="isDropdownOpen = false">{{lbl('nav.borderregion')}}</router-link>
          <router-link to="/blog" class="navdropdown" @click="isDropdownOpen = false">{{lbl('nav.blog')}}</router-link>
          <router-link to="/photogallery" class="navdropdown" @click="isDropdownOpen = false">{{lbl('nav.photogallery')}}</router-link>
          <router-link to="/resources" class="navdropdown" @click="isDropdownOpen = false">{{lbl('nav.resources')}}</router-link>
        </div>
      </div>
    </div>

    <!-- Mobile search bar (always visible) -->
    <div v-if="isMobileMenuOpen" class="flex flex-col col-span-12 md:hidden px-4 relative">
      <div class="relative flex items-center w-full">
        <input v-model="searchQuery" type="text" placeholder="Search..."
          class="w-full bg-transparent border-b border-black outline-none py-2 text-base"/>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 absolute right-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div v-if="searchResults.length > 0 || isSearching" 
          class="w-full bg-white border border-gray-200 shadow-xl rounded-xl mt-1 max-h-60 overflow-y-auto text-black z-50">
        <div v-if="isSearching" class="p-3 text-xs text-gray-500">Searching...</div>
        <div v-else class="divide-y divide-gray-100">
          <router-link 
            v-for="item in searchResults" 
            :key="item.id" 
            :to="getSearchRoute(item)"
            @click="isMobileMenuOpen = false; searchQuery = '';"
            class="block p-3 hover:bg-slate-50"
          >
            <p class="text-xs font-medium text-dark-blue line-clamp-1" v-html="item.title"></p>
            <span class="text-[9px] uppercase font-bold text-gray-400 block mt-0.5">{{ item.subtype }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Desktop search bar (toggleable) -->
    <div :class="[isSearchOpen 
          ? 'absolute inset-x-0 top-0 h-full bg-white px-4 flex items-center z-50 md:relative md:inset-auto md:bg-transparent md:p-0 md:col-span-2 md:col-start-10' 
          : 'hidden md:flex md:col-start-11 md:col-span-1']" class="transition-all duration-300 ease-in-out relative">
      <div class="relative flex items-center w-full">
        <input v-model="searchQuery" type="text" placeholder="Search..."
          class="w-full bg-transparent border-b border-black outline-none py-2 text-base md:text-sm transition-all"
          :class="isSearchOpen ? 'opacity-100' : 'opacity-0'"/>

        <button 
          @click="isSearchOpen = !isSearchOpen; searchQuery = '';" class="absolute right-0 p-2 hover:text-blue-900 transition-colors cursor-pointer">
          <svg v-if="isSearchOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      <div v-if="isSearchOpen && (searchResults.length > 0 || isSearching)" 
          class="absolute top-full right-0 mt-2 w-80 bg-white border border-gray-200 shadow-2xl rounded-xl z-50 max-h-96 overflow-y-auto text-black">
        
        <div v-if="isSearching" class="p-4 text-sm text-gray-500 flex items-center gap-2">
          <span class="animate-pulse">Searching the platform...</span>
        </div>

        <div v-else class="divide-y divide-gray-100">
          <router-link 
            v-for="item in searchResults" 
            :key="item.id" 
            :to="getSearchRoute(item)"
            @click="isSearchOpen = false; searchQuery = '';"
            class="block p-4 hover:bg-slate-50 transition-colors"
          >
            <p class="text-sm font-semibold text-dark-blue line-clamp-1" v-html="item.title"></p>
            <span class="inline-block mt-1 text-[10px] uppercase tracking-wider font-bold bg-slate-100 px-2 py-0.5 rounded text-gray-500">
              {{ item.subtype }}
            </span>
          </router-link>
        </div>
      </div>
    </div>

    <div class="hidden md:flex col-start-12 justify-center items-center text-black relative">
      <button @click="isLanguageDropdownOpen = !isLanguageDropdownOpen" class="font-medium hover:text-blue-900 flex items-center cursor-pointer">
        {{ Object.keys(languageMap).find(key => languageMap[key] === currentLanguage) }} <span class="ml-1 text-xs">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            :class="isLanguageDropdownOpen ? 'rotate-180' : ''"
            class="transition-transform duration-200 shrink-0">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </span>
      </button>
      <div v-if="isLanguageDropdownOpen" class="absolute top-full mt-2 w-24 bg-white border border-gray-100 shadow-xl rounded-md z-50">
        <button @click="setLanguage('EN')" class="navdropdown w-full text-left">English</button>
        <button @click="setLanguage('DA')" class="navdropdown w-full text-left">Dansk</button>
        <button @click="setLanguage('DE')" class="navdropdown w-full text-left">Deutsch</button>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="col-span-12 md:hidden bg-white border-t border-gray-100 py-4">
      <div class="flex flex-col gap-3">
        <router-link to="/media" class="navtext px-4">{{lbl('nav.media')}}</router-link>
        <router-link to="/network" class="navtext px-4">{{lbl('nav.network')}}</router-link>
        <router-link to="/events" class="navtext px-4">{{lbl('nav.events')}}</router-link>
        <router-link to="/about" class="navtext px-4">{{lbl('nav.about')}}</router-link>
        <button @click="isDropdownOpen = !isDropdownOpen" class="navtext px-4 text-left">{{lbl('nav.more')}} ▼</button>
        <div v-if="isDropdownOpen" class="flex flex-col gap-2 px-8">
          <router-link to="/become-a-member" class="navtext text-sm">{{lbl('nav.becomeamember')}}</router-link>
          <router-link to="/border-region" class="navtext text-sm">{{lbl('nav.borderregion')}}</router-link>
          <router-link to="/blog" class="navtext text-sm">{{lbl('nav.blog')}}</router-link>
          <router-link to="/photogallery" class="navtext text-sm">{{lbl('nav.photogallery')}}</router-link>
          <router-link to="/resources" class="navtext text-sm">{{lbl('nav.resources')}}</router-link>
        </div>
      </div>
    </div>

    <div v-if="isMobileMenuOpen" class="col-span-12 md:hidden bg-white border-t border-gray-100 py-4">
      <div class="flex flex-col gap-3">
        <div class="px-4 py-2">
          <p class="text-sm font-medium mb-2">
            {{lbl('general.language')}}: {{ Object.keys(languageMap).find(key => languageMap[key] === currentLanguage) }}
          </p>
          <button @click="setLanguage('EN')" class="block w-full text-left px-4 py-1 hover:text-blue-900">English</button>
          <button @click="setLanguage('DA')" class="block w-full text-left px-4 py-1 hover:text-blue-900">Dansk</button>
          <button @click="setLanguage('DE')" class="block w-full text-left px-4 py-1 hover:text-blue-900">Deutsch</button>
        </div>
      </div>
    </div>
  </nav>





  <router-view />





<footer v-if="footerData" class="basegrid-footer">
    
    <div class="col-span-1 md:col-span-1 lg:col-span-3 flex flex-col">
      <h3 class="mb-3">{{ lbl('footer.community') }}</h3>
      <router-link to="/blog" class="font-light w-fit">{{ lbl('nav.blog') }}</router-link>
      <router-link to="/network" class="font-light w-fit">{{ lbl('nav.network') }}</router-link>
      <router-link to="/events" class="font-light w-fit">{{ lbl('nav.events') }}</router-link>
      <h3 class="mt-4 mb-3">{{ lbl('footer.aboutus') }}</h3>
      <router-link to="/media" class="font-light w-fit">{{ lbl('nav.media') }}</router-link>
      <router-link to="/advisors" class="font-light w-fit">{{ lbl('nav.advisors') }}</router-link>
      <router-link to="/about" class="font-light w-fit">{{ lbl('nav.about') }}</router-link>
    </div>

    <div class="hidden md:flex col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-4 flex-col gap-3">
      <h3>{{ lbl('general.subscribe') }}</h3>
      <input type="email" placeholder="Insert email" class="w-full bg-transparent border-2 border-white rounded-2xl px-4 py-2 text-white placeholder:text-gray-400 placeholder:font-light focus:outline-none focus:ring-2 focus:ring-blue-400 text-[14px]"/>
      <button class="w-full bg-white rounded-xl px-4 py-2 flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <span class="text-semi-dark-blue font-medium text-[12px]">
            {{ lbl('general.subscribe') }}
          </span>
        </button>
    </div>

    <div class="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-7 flex flex-col">
      <h3 class="mb-3">{{ lbl('footer.openinghours') }}</h3>
      <p class="mb-2 bold">{{ lbl('footer.callinghours') }}:</p>
      <p>{{ t(footerData.acf, 'calling_hours_week_days') }}</p>
      <p>{{ t(footerData.acf, 'calling_hours') }}</p>
      <p>{{ t(footerData.acf, 'calling_hours_week_days_two') }}</p>
      <p>{{ t(footerData.acf, 'calling_hours_two') }}</p>
      <p class="mt-2">{{ lbl('footer.visitinghours') }}: </p>
      <p>{{ t(footerData.acf, 'visiting_hours') }}</p>
    </div>

    <div class="col-span-1 md:col-span-1 lg:col-span-3 lg:col-start-10 flex flex-col gap-4">
      <h3 class="mb-3">{{ lbl('footer.contact') }}</h3>
      
      <a v-if="footerData.acf?.footer_address" 
        :href="'https://maps.google.com/?q=' + encodeURIComponent(footerData.acf.footer_address)" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="flex items-center gap-2 hover:opacity-80 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <g fill="none" fill-rule="evenodd">
            <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/>
            <path fill="#fff" d="M12 2a9 9 0 0 1 9 9c0 3.074-1.676 5.59-3.442 7.395a20.4 20.4 0 0 1-2.876 2.416l-.426.29l-.2.133l-.377.24l-.336.205l-.416.242a1.87 1.87 0 0 1-1.854 0l-.416-.242l-.52-.32l-.192-.125l-.41-.273a20.6 20.6 0 0 1-3.093-2.566C4.676 16.589 3 14.074 3 11a9 9 0 0 1 9-9m0 2a7 7 0 0 0-7 7c0 2.322 1.272 4.36 2.871 5.996a18 18 0 0 0 2.222 1.91l.458.326q.222.155.427.288l.39.25l.343.209l.289.169l.455-.269l.367-.23q.293-.186.627-.417l.458-.326a18 18 0 0 0 2.222-1.91C17.728 15.361 19 13.322 19 11a7 7 0 0 0-7-7m0 3a4 4 0 1 1 0 8a4 4 0 0 1 0-8m0 2a2 2 0 1 0 0 4a2 2 0 0 0 0-4"/>
          </g>
        </svg>
        <p>{{ footerData.acf.footer_address }}</p>
      </a>

      <a v-if="footerData.acf?.footer_phone" 
        :href="'tel:' + footerData.acf.footer_phone.replace(/\s+/g, '')" 
        class="flex items-center gap-2 hover:opacity-80 transition">
        <svg xmlns="http://www.w3.org/2000/xl" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#fff" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
        </svg>
        <p>{{ footerData.acf.footer_phone }}</p>
      </a>

      <a v-if="footerData.acf?.footer_email" 
        :href="'mailto:' + footerData.acf.footer_email" 
        class="flex items-center gap-2 hover:opacity-80 transition">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="#fff" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5-8-5zm0 12H4V8l8 5l8-5z"/>
        </svg>
        <p>{{ footerData.acf.footer_email }}</p>
      </a>

      <div class="flex gap-2">
        <a href="https://www.linkedin.com/company/your-company" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z"/></svg>
        </a>
        <a href="https://www.facebook.com/your-company" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95"/></svg>
        </a>
        <a href="https://www.instagram.com/your-company" target="_blank" rel="noopener noreferrer" class="hover:opacity-80 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#fff" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3"/></svg>
        </a>
      </div>
    </div>

</footer>

</template>