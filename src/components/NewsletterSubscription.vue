<script setup>
import { ref, inject } from 'vue';
import { getLabel } from '../utils/translationFunction.js';

// Access the global site language setup securely
const siteLanguage = inject('siteLanguage', ref('en'));
const lbl = (key) => getLabel(key, siteLanguage.value);

const emailInput = ref('');
const status = ref('idle'); // Options: idle, loading, success, error
const feedbackMessage = ref('');

const handleSubscription = async () => {
  if (!emailInput.value) return;

  status.value = 'loading';
  feedbackMessage.value = '';

  try {
    // API endpoint subscription method mock block (Replace with actual backend url/axios handle logic as required)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    status.value = 'success';
    feedbackMessage.value = lbl('newsletter.successMsg') || 'Thank you! You have successfully subscribed.';
    emailInput.value = '';
  } catch (error) {
    status.value = 'error';
    feedbackMessage.value = lbl('newsletter.errorMsg') || 'An unexpected error occurred. Please try again.';
  }
};
</script>

<template>
  <section class="basegrid py-8 bg-white">
    
    <div class="col-span-12 bg-[#1A2332] rounded-xl text-white px-6 py-12 md:py-16 text-center flex flex-col items-center justify-center">
      
      <h2 class="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
        {{ lbl('newsletter.title') || 'Stay up to date with business, from your inbox' }}
      </h2>
      
      <p class="text-gray-300 text-sm md:text-base font-light max-w-2xl mx-auto leading-relaxed mb-8">
        {{ lbl('newsletter.description') || 'Stay up to date on new media, local business news and upcoming events. Our newsletter gives you relevant knowledge and inspiration – without the noise.' }}
      </p>
      
      <form @submit.prevent="handleSubscription" class="w-full max-w-xl flex flex-col sm:flex-row items-stretch justify-center gap-4 px-4">
        
        <div class="relative flex-grow">
          <input 
            v-model="emailInput"
            type="email" 
            required
            :disabled="status === 'loading' || status === 'success'"
            :placeholder="lbl('newsletter.emailplaceholder')"
            class="w-full bg-[#242E42] border border-gray-500/30 rounded-xl px-5 py-3 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
          />
        </div>

        <button 
          type="submit"
          :disabled="status === 'loading' || status === 'success'"
          class="bg-white text-[#1A2332] hover:bg-gray-100 font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shrink-0 disabled:opacity-50"
        >
          <svg class="w-4 h-4 text-[#1A2332]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 19V5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 7l9 6 9-6" />
          </svg>
          <span>
            {{ status === 'success' ? (lbl('newsletter.success')) : (lbl('newsletter.subscribe')) }}
          </span>
        </button>

      </form>

      <p v-if="feedbackMessage" class="mt-4 text-xs font-medium" :class="status === 'success' ? 'text-green-400' : 'text-red-400'">
        {{ lbl('newsletter.positivefdbk') }}
      </p>

    </div>
    
  </section>
</template>

