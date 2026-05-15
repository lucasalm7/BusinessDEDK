<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Newsletter from '../components/Newsletter.vue';

const route = useRoute();
const event = ref(null);
const relatedEvents = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const copied = ref(false);

const form = ref({ firstName: '', lastName: '', email: '', phone: '', company: '' });

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function formatDay(d) { return d ? d.slice(6, 8) : ''; }
function formatMonth(d) { return d ? months[parseInt(d.slice(4, 6)) - 1] : ''; }
function formatYear(d) { return d ? d.slice(0, 4) : ''; }

const whatToExpectItems = computed(() =>
  event.value?.acf?.what_to_expect
    ? event.value.acf.what_to_expect.split('\n').filter(l => l.trim())
    : []
);

const scheduleItems = computed(() =>
  event.value?.acf?.event_schedule
    ? event.value.acf.event_schedule.split('\n').filter(l => l.trim()).map(l => {
        const i = l.indexOf(' ');
        return { time: l.slice(0, i), desc: l.slice(i + 1) };
      })
    : []
);

async function loadEvent(slug) {
  loading.value = true;
  error.value = null;
  try {
    const [eventRes, allRes] = await Promise.all([
      axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/event?slug=${slug}&acf_format=standard&_embed`),
      axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/event?acf_format=standard&_embed&per_page=100')
    ]);
    event.value = eventRes.data[0];
    relatedEvents.value = allRes.data.filter(e => e.slug !== slug).slice(0, 4);
  } catch (err) {
    error.value = 'Failed to load event: ' + err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(() => loadEvent(route.params.slug));
watch(() => route.params.slug, slug => { if (slug) loadEvent(slug); });

async function submitForm() {
  try {
    const res = await axios.post(
      `http://businessdedk.lucasalmeida.dk/wp-json/businessdedk/v1/register/${event.value.id}`,
      form.value
    );
    if (event.value.acf) event.value.acf.event_attending = res.data.attending;
  } catch (err) {
    console.error('Registration failed:', err);
  }
  showModal.value = false;
  form.value = { firstName: '', lastName: '', email: '', phone: '', company: '' };
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}
</script>

<template>
  <div v-if="loading" class="text-center py-20 text-gray-500">Loading event...</div>
  <div v-else-if="error" class="text-red-500 text-center py-20">{{ error }}</div>

  <div v-else>

    <!-- Back to Events -->
    <div class="bg-semi-dark-blue px-4 md:px-[5%] py-4">
      <router-link to="/events" class="text-off-white flex items-center gap-2 hover:text-white transition-colors text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to events
      </router-link>
    </div>

    <!-- Event Content -->
    <div class="basegrid py-12">

      <div class="col-span-12 lg:col-span-8">
        <h1 v-html="event.title.rendered" class="text-dark-blue mb-6"></h1>

        <div class="flex flex-wrap items-center gap-6 mb-10 text-sm text-gray-500">
          <span v-if="event.acf?.event_date" class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            {{ formatDay(event.acf.event_date) }} {{ formatMonth(event.acf.event_date) }}, {{ formatYear(event.acf.event_date) }}
          </span>
          <span v-if="event.acf?.event_time" class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {{ event.acf.event_time }}
          </span>
          <span v-if="event.acf?.event_location" class="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            {{ event.acf.event_location }}
          </span>
        </div>

        <div v-if="event.acf?.event_description" class="mb-10">
          <h2 class="text-dark-blue font-bold mb-3">About the event</h2>
          <p class="text-gray-700 leading-relaxed">{{ event.acf.event_description }}</p>
        </div>

        <div v-if="whatToExpectItems.length" class="mb-10">
          <h2 class="text-dark-blue font-bold mb-4">What to expect</h2>
          <ul class="flex flex-col gap-2">
            <li v-for="item in whatToExpectItems" :key="item" class="flex items-start gap-3 text-gray-700">
              <span class="text-dark-blue font-bold mt-0.5">✓</span>
              {{ item }}
            </li>
          </ul>
        </div>

        <div v-if="event.acf?.schedule_intro || scheduleItems.length" class="mb-10">
          <h2 class="text-dark-blue font-bold mb-4">Schedule</h2>
          <p v-if="event.acf?.schedule_intro" class="text-gray-700 mb-6">{{ event.acf.schedule_intro }}</p>
          <div class="flex flex-col gap-3">
            <div v-for="item in scheduleItems" :key="item.time" class="flex gap-6">
              <span class="font-bold text-dark-blue w-14 shrink-0">{{ item.time }}</span>
              <span class="text-gray-700">{{ item.desc }}</span>
            </div>
          </div>
        </div>

        <p v-if="event.acf?.closing_text" class="text-gray-700 leading-relaxed">{{ event.acf.closing_text }}</p>
      </div>

      <!-- Sidebar -->
      <div class="col-span-12 lg:col-span-4 lg:col-start-9 border-t lg:border-t-0 pt-8 lg:pt-0 self-start sticky top-4">
        <div class="bg-semi-dark-blue text-white rounded-xl p-6 flex flex-col gap-5">

          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <span class="bg-white text-dark-blue text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                {{ event.acf?.event_attending || '—' }}
              </span>
              <span class="text-sm font-bold">Attending</span>
            </div>
            <span class="text-sm font-bold">{{ event.acf?.event_tickets_left || '—' }} Tickets left</span>
          </div>

          <button @click="showModal = true" class="w-full bg-white text-dark-blue py-2.5 rounded-lg text-sm font-light hover:bg-transparent hover:text-white hover:border hover:border-white transition">
            Register
          </button>

          <button @click="copyLink" class="w-full py-2.5 rounded-lg text-sm font-light transition border"
            :class="copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-dark-blue border-white hover:bg-transparent hover:text-white hover:border-white'">
            {{ copied ? 'Copied!' : 'Copy the link' }}
          </button>

          <p v-if="event.acf?.event_registration_closes" class="text-center text-sm text-gray-400">
            {{ event.acf.event_registration_closes }}
          </p>

        </div>
      </div>

    </div>

    <!-- Related Events -->
    <div v-if="relatedEvents.length" class="basegrid pb-12 border-t border-gray-200">
      <div class="col-span-12 mb-6">
        <h2 class="text-dark-blue font-bold">Related events</h2>
      </div>
      <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <router-link
          v-for="related in relatedEvents"
          :key="related.id"
          :to="`/events/${related.slug}`"
          class="flex flex-col group cursor-pointer"
        >
          <div class="relative overflow-hidden rounded-xl mb-3">
            <img
              v-if="related._embedded?.['wp:featuredmedia']?.[0]?.source_url"
              :src="related._embedded['wp:featuredmedia'][0].source_url"
              :alt="related._embedded['wp:featuredmedia'][0].alt_text || related.title.rendered"
              loading="lazy"
              class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div v-else class="w-full h-44 bg-light-blue"></div>
            <div v-if="related.acf?.event_date" class="absolute top-3 left-3 bg-white text-dark-blue py-2 text-center rounded-xl w-20">
              <p class="text-xl font-bold leading-none">{{ formatDay(related.acf.event_date) }}</p>
              <p class="text-xs font-bold leading-tight mt-0.5">{{ formatMonth(related.acf.event_date) }}</p>
            </div>
          </div>
          <h3 v-html="related.title.rendered" class="font-bold text-dark-blue text-sm mb-2"></h3>
          <span class="flex items-center gap-2 text-sm font-medium text-dark-blue group-hover:underline mt-auto">
            View event details and register
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </router-link>
      </div>
    </div>

    <Newsletter />

    <!-- Registration Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4" @click.self="showModal = false">
        <div class="bg-white rounded-xl w-full max-w-md p-8 flex flex-col gap-5">

          <div class="flex items-center justify-between">
            <h3 class="font-bold text-dark-blue">Register for this event</h3>
            <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 transition text-xl leading-none">✕</button>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-sm text-gray-500">First name</label>
              <input v-model="form.firstName" type="text" placeholder="First name" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex flex-col gap-1 flex-1">
              <label class="text-sm text-gray-500">Last name</label>
              <input v-model="form.lastName" type="text" placeholder="Last name" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Email</label>
            <input v-model="form.email" type="email" placeholder="your@email.com" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Phone</label>
            <input v-model="form.phone" type="tel" placeholder="+45 00 00 00 00" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-500">Company <span class="text-gray-300">(optional)</span></label>
            <input v-model="form.company" type="text" placeholder="Your company" class="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <button @click="submitForm" class="w-full bg-dark-blue text-white py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
            Confirm registration
          </button>

        </div>
      </div>
    </Teleport>

  </div>
</template>
