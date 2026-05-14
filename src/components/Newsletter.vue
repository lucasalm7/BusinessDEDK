<script setup>
import { ref } from 'vue';

const email = ref('');
const subscribed = ref(false);

function subscribe() {
  if (!email.value) return;
  subscribed.value = true;
}
</script>

<template>
  <div class="px-4 md:px-[5%] py-8">
    <div class="bg-semi-dark-blue rounded-xl px-8 py-12 text-center text-white">
      <h2 class="text-white mb-3">Stay up to date with business, from your inbox</h2>
      <p class="text-gray-300 max-w-md mx-auto mb-8">
        Stay updated on local business news, events and media across the border — relevant insights and inspiration.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
        <input
          v-model="email"
          type="email"
          name="newsletter-email"
          autocomplete="off"
          placeholder="Insert email"
          :disabled="subscribed"
          class="flex-1 bg-transparent border border-white rounded-xl px-4 py-2.5 text-white placeholder:text-gray-400 placeholder:font-light focus:outline-none text-sm disabled:opacity-50"
        />
        <button
          @click="subscribe"
          :disabled="subscribed"
          class="rounded-xl px-5 py-2.5 text-sm font-medium transition flex items-center gap-2 justify-center whitespace-nowrap disabled:cursor-default"
          :class="subscribed ? 'bg-green-500 text-white' : 'bg-white text-semi-dark-blue hover:bg-gray-100'"
        >
          <svg v-if="subscribed" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          {{ subscribed ? 'Subscribed' : 'Subscribe to newsletter' }}
        </button>
      </div>
    </div>
  </div>
</template>
