<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const offers = ref([])
const pillars = ref([])
const contactData = ref({
  address: '',
  phone: '',
  email: ''
})
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    const [offersRes, pillarsRes, contactRes] = await Promise.all([
      axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/offer?acf_format=standard&_embed'),
      axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/pillar?acf_format=standard'),
      axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/pages/74?acf_format=standard')
    ])
    offers.value = offersRes.data
    pillars.value = pillarsRes.data
    
    if (contactRes.data.acf) {
      contactData.value = {
        address: contactRes.data.acf.footer_address || '',
        phone: contactRes.data.acf.footer_phone || '',
        email: contactRes.data.acf.footer_email || ''
      }
    }
  } catch (err) {
    error.value = err.message
    console.error('Error loading About page:', err)
  } finally {
    loading.value = false
  }
})

const cleanPhone = (phone) => phone.replace(/\s+/g, '')
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-semi-dark-blue grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 pb-6 md:pb-10 pt-6 md:pt-30 px-4 md:px-[5%]">
      <div class="col-span-12">
        <h1 class="text-white mb-4 md:mb-6 text-3xl md:text-5xl">About us</h1>
      </div>
      <div class="col-span-12 md:col-span-8">
        <p class=" text-off-white white text-lg md:text-2xl lg:text-3xl font-bold leading-9">
          Connect with businesses, institutions, and experts across the DE-DK region.
        </p>
      </div>
    </section>

           <!-- Main Content -->
    <div v-if="!loading" class="basegrid py-12 md:py-16 mt-8 items-start">
      <!-- Left Column - Text with heading -->
      <div class="col-span-12 md:col-span-6 text-dark-blue">
        <h2 class="text-dark-blue font-semibold mb-6">Who We Are</h2>
        
        <p class="mb-6 mt-8 max-w-l">
          Business DE-DK is a cross-border economic initiative dedicated to strengthening business relationships and fostering collaboration between Northern Germany and Southern Denmark. Established as a bridge connecting the two dynamic economies, we serve as a catalyst for economic growth and sustainable development.
        </p>
        <p class="mb-6">
          Our platform connects over 500 businesses, institutions, and decision-makers across the border region, facilitating partnerships that drive economic prosperity and create opportunities for all stakeholders.
        </p>
        <p class="mb-6">
          With deep roots in both German and Danish business cultures, we understand the unique opportunities and challenges of cross-border collaboration. Our team of experts provides tailored support from market entry strategies to regulatory guidance, ensuring your success in this vibrant economic corridor.
        </p>
      </div>

      <!-- Right Column - Mission/Vision/Values -->
      <div class="col-span-12 md:col-span-6 space-y-6">
        <!-- Mission -->
        <div class="flex gap-4 p-6 border border-stroke rounded-lg">
          <svg class="w-5 h-5 text-stroke flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <div>
            <h3 class="font-medium text-dark-blue mb-2">Our Mission</h3>
            <p class="text-gray-700 leading-relaxed">To create a thriving cross-border business ecosystem that leverages the strengths of both Germany and Denmark, enabling companies to grow, innovate, and compete on a global stage.</p>
          </div>
        </div>

        <!-- Vision -->
        <div class="flex gap-4 p-6 border border-stroke rounded-lg">
          <svg class="w-5 h-5 text-stroke flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          <div>
            <h3 class="font-medium text-dark-blue mb-2">Our Vision</h3>
            <p class="text-gray-700 leading-relaxed">A unified border region recognized as a leading hub for innovation, sustainability, and international commerce, where businesses seamlessly collaborate across cultural and national boundaries.</p>
          </div>
        </div>

        <!-- Values -->
        <div class="flex gap-4 p-6 border border-stroke rounded-lg">
          <svg class="w-5 h-5 text-stroke shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
          </svg>
          <div>
            <h3 class="font-medium text-dark-blue mb-2">Our Values</h3>
            <ul class="text-gray-700 space-y-1 leading-relaxed">
              <li>• Collaboration & Partnership</li>
              <li>• Innovation & Excellence</li>
              <li>• Sustainability & Responsibility</li>
              <li>• Transparency & Integrity</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- What We Offer Section -->
    <div v-if="!loading" class="basegrid py-12 md:py-16 border-t border-stroke">
      <div class="col-span-12 mb-8">
        <h2 class="text-black font-semibold">What We Offer</h2>
      </div>

      <div v-for="offer in offers" :key="offer.id" class="col-span-12 md:col-span-4 mb-8">
        <div class="p-6 border border-stroke rounded-lg  h-full min-h-[320px] flex flex-col">
          <div class="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4">
            <svg class="w-6 h-6 text-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="font-medium text-black mb-3" v-html="offer.title.rendered"></h3>
          <p class="text-gray-700 leading-relaxed" v-html="offer.content.rendered"></p>
        </div>
      </div>
    </div>

    <!-- Get in Touch Section -->
    <div v-if="!loading" class="basegrid py-12 md:py-16 border-t border-stroke">
      <div class="col-span-12">
        <div class="bg-semi-dark-blue rounded-lg p-8 md:p-12">
          <h2 class="font-bold text-white mb-8 text-start">Get in Touch</h2>
          <p class="text-white text-start leading-relaxed">
            Have questions or want to learn more about how we can support your business? </p> 
            <p class="text-white text-start mb-8">Fill out the form below and our team will get back to you within 24 hours.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block font-medium text-white mb-2">Full Name *</label>
              <input type="text" placeholder="Your name" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white" />
            </div>
            <div>
              <label class="block font-medium text-white mb-2">Email Address *</label>
              <input type="email" placeholder="your@email.com" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white" />
            </div>
          </div>

          <div class="mb-6">
            <label class="block font-medium text-white mb-2">Organization</label>
            <input type="text" placeholder="Company or institution name" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white" />
          </div>

          <div class="mb-6">
            <label class="block font-medium text-white mb-2">Message *</label>
            <textarea placeholder="Tell us how we can help..." rows="6" class="w-full px-4 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-blue bg-semi-dark-blue text-white placeholder-off-white resize-none"></textarea>
          </div>

          <div class="flex justify-center">
            <button class="px-8 py-3 bg-white text-dark-blue font-semibold rounded-lg hover:bg-off-white transition-all">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Information -->
    <div v-if="!loading" class="basegrid py-12 md:py-16 border-t border-stroke">
      <div class="col-span-12 mb-8 ">
        <h2 class="text-black font-semibold mb-2">Contact Information</h2>
        <p class="text-blue ">Reach out to us through any of the channels below. We're here to help your business thrive in the DE-DK border region.</p>
      </div>
      
      <!-- Left Column - Email and Phone -->
      <div class="col-span-12 md:col-span-6 space-y-8">
        <!-- Email -->
        <div v-if="contactData.email" class="p-6 border border-stroke rounded-lg h-full flex items-center gap-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mt-1 shrink-0">
                  <path fill="#0d1b2a" d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2zm-2 0l-8 5-8-5zm0 12H4V8l8 5l8-5z"/>
                </svg>
          <div>
            <p class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">Email</p>
            <a :href="`mailto:${contactData.email}`" class="text-primary hover:text-blue transition-colors text-sm break-all">
              {{ contactData.email }}
            </a>
          </div>
        </div>

        <!-- Phone -->
        <div v-if="contactData.phone" class="p-6 border border-stroke rounded-lg h-full flex items-center gap-4">
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="mt-1 shrink-0">
                  <path fill="#0d1b2a" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"/>
                </svg>
          <div>
            <p class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">Phone</p>
            <a :href="`tel:${cleanPhone(contactData.phone)}`" class="text-primary hover:text-blue transition-colors text-sm break-all">
              {{ contactData.phone }}
            </a>
          </div>
        </div>
      </div>

      <!-- Right Column - Office Hours and Offices -->
      <div class="p-6 border border-stroke rounded-lg h-full flex items-start gap-4 col-span-12 md:col-span-6 grid grid-cols-2 gap-8">
        <!-- Office Hours -->
        <div>
          <h3 class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">Office Hours</h3>
          <div class="space-y-1 mt-4 text-dark-blue leading-relaxed">
            <p><strong>Monday - Friday</strong></p>
            <p>09:00 - 17:00</p>
            <p class="mt-2"><strong>Saturday - Sunday</strong></p>
            <p>Closed</p>
          </div>
        </div>

        <!-- Offices -->
        <div v-if="contactData.address">
          <h3 class="text-xs text-dark-blue uppercase tracking-wider font-semibold mb-1">Offices</h3>
          <p class="text-dark-blue mt-4  leading-relaxed">{{ contactData.address }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="basegrid py-20">
      <div class="col-span-12 text-center text-gray-700">Loading...</div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="basegrid py-20">
      <div class="col-span-12 text-center text-red-600">{{ error }}</div>
    </div>
  </div>
</template>