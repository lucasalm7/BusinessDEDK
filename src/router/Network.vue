<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const cards = ref([])
const loading = ref(true)
const error = ref(null)
const searchQuery = ref('')
const activeType = ref('all')
const activeSector = ref('all')

const slugify = (value = '') => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

const formatLabel = (value = '') => {
  return String(value)
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

const normalize = (item) => {
  const acf = item.acf || {}
  const logoField = acf.logo_ || acf.logo || null
  const logoUrl = logoField && (logoField.url || logoField.sourceUrl || (logoField.sizes && (logoField.sizes.medium || logoField.sizes.medium_large || logoField.sizes.large))) || ''
  const title = (item.title && item.title.rendered) ? item.title.rendered : (item.title || '')
  const phoneNumber = acf.phone_number || acf.phoneNumber || acf.phone || ''
  const companyType = item.company_type || acf.company_type || []
  const location = acf.location || ''
  const classList = Array.isArray(item.class_list) ? item.class_list : []
  const isInstitution = classList.includes('company_type-institution') || (Array.isArray(companyType) && companyType.includes(33))
  const typeLabel = isInstitution ? 'Institution' : 'Company'
  const sectorLabel = acf.sector || 'General'
  const sectorSlug = slugify(sectorLabel)
  return {
    id: item.id || item.databaseId || null,
    title,
    acf,
    logoUrl,
    phoneNumber,
    companyType,
    location,
    typeLabel,
    sectorLabel,
    sectorSlug
  }
}

const sectors = computed(() => {
  const unique = new Set(cards.value.map((card) => card.sectorSlug).filter(Boolean))
  return ['all', ...Array.from(unique)]
})

const filteredCards = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return cards.value.filter((card) => {
    const title = (card.title || '').toLowerCase()
    const location = (card.location || '').toLowerCase()
    const bySearch = !query || title.includes(query) || location.includes(query)
    const byType = activeType.value === 'all' || (activeType.value === 'companies' && card.typeLabel === 'Company') || (activeType.value === 'institutions' && card.typeLabel === 'Institution')
    const bySector = activeSector.value === 'all' || card.sectorSlug === activeSector.value
    return bySearch && byType && bySector
  })
})

onMounted(async () => {
  try {
    const uniqueCards = []
    const seenKeys = new Set()
    const perPage = 50
    let page = 1

    while (true) {
      const res = await axios.get(`http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/databasecard?per_page=${perPage}&page=${page}&acf_format=standard`)
      const pageItems = Array.isArray(res.data) ? res.data : []

      if (pageItems.length === 0) {
        break
      }

      for (const item of pageItems) {
        const normalized = normalize(item)
        const key = normalized.id || normalized.title
        if (!seenKeys.has(key)) {
          seenKeys.add(key)
          uniqueCards.push(normalized)
        }
      }

      if (pageItems.length < perPage) {
        break
      }

      page += 1
    }

    cards.value = uniqueCards
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="network-page">
    <section class="hero">
      <div class="container">
        <h1>Network</h1>
        <p>Connect with businesses, institutions, and experts across the DE-DK region.</p>
      </div>
    </section>

    <section class="controls container" v-if="!loading && !error">
      <div class="search-wrap">
        <span class="search-icon">⌕</span>
        <input v-model="searchQuery" type="text" class="search-input" placeholder="Search by name, sector, location..." />
      </div>

      <div class="type-filters">
        <button class="type-pill" :class="{ active: activeType === 'all' }" @click="activeType = 'all'">All Types</button>
        <button class="type-pill" :class="{ active: activeType === 'companies' }" @click="activeType = 'companies'">Companies</button>
        <button class="type-pill" :class="{ active: activeType === 'institutions' }" @click="activeType = 'institutions'">Institutions</button>
      </div>

      <div class="sector-filters">
        <button
          v-for="sector in sectors"
          :key="sector"
          class="sector-pill"
          :class="{ active: activeSector === sector }"
          @click="activeSector = sector"
        >
          {{ sector === 'all' ? 'All Sectors' : formatLabel(sector) }}
        </button>
      </div>
    </section>

    <section class="container">
      <div v-if="loading" class="state">Loading members...</div>
      <div v-else-if="error" class="state error">Failed to load members: {{ error }}</div>

      <div v-else class="grid">
        <article v-for="card in filteredCards" :key="card.id" class="business-card">
          <div class="card-logo-wrap">
            <img :src="card.logoUrl || 'https://via.placeholder.com/80'" :alt="card.title" class="logo" />
          </div>

          <div class="card-content">
            <h3 v-html="card.title"></h3>
            <p class="location">📍 {{ card.location || 'DE-DK Region' }}</p>
            <div class="meta-badges">
              <span class="badge">{{ card.sectorLabel }}</span>
              <span class="badge">{{ card.typeLabel }}</span>
            </div>
          </div>
        </article>

        <p v-if="filteredCards.length === 0" class="state">No members found.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.network-page {
  font-family: var(--font-family-raleway);
  background: var(--color-soft-white);
  min-height: 100vh;
  color: var(--color-dark-blue);
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 42px;
}

.hero {
  background: var(--color-semi-dark-blue);
  color: var(--color-soft-white);
  padding: 82px 0 72px;
}

.hero h1 {
  font-size: 52px;
  line-height: 1.05;
  margin: 0 0 18px;
  font-weight: 700;
}

.hero p {
  max-width: 640px;
  font-size: 22px;
  line-height: 1.35;
  margin: 0;
  font-weight: 600;
}

.controls {
  padding-top: 28px;
  padding-bottom: 16px;
}

.search-wrap {
  position: relative;
  width: 320px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 12px;
  transform: translateY(-50%);
  font-size: 16px;
  color: var(--color-light-blue);
}

.search-input {
  width: 100%;
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--color-stroke);
  background: var(--color-soft-white);
  padding: 0 14px 0 34px;
  font-size: 14px;
  color: var(--color-dark-blue);
}

.type-filters {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  gap: 12px;
}

.type-pill,
.sector-pill {
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--color-stroke);
  background: var(--color-soft-white);
  color: var(--color-semi-dark-blue);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.type-pill.active,
.sector-pill.active {
  background: var(--color-semi-dark-blue);
  color: var(--color-soft-white);
  border-color: var(--color-semi-dark-blue);
}

.sector-filters {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sector-pill {
  padding: 0 16px;
  height: 34px;
  border-radius: 9px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(220px, 1fr));
  gap: 18px 22px;
  padding: 28px 42px 56px;
}

.business-card {
  min-height: 138px;
  background: var(--color-soft-white);
  border: 1px solid var(--color-stroke);
  border-radius: 10px;
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 14px;
  align-items: center;
  padding: 20px;
}

.card-logo-wrap {
  width: 78px;
  height: 78px;
  border: 1px solid var(--color-stroke);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px; /* keep image inset so its background doesn't overlap the ring */
  box-sizing: border-box;
  background: var(--color-soft-white);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border-radius: 50%;
}

.card-content h3 {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  color: var(--color-dark-blue);
  font-weight: 700;
}

.location {
  margin: 8px 0 10px;
  font-size: 13px;
  color: var(--color-blue);
}

.meta-badges {
  display: flex;
  gap: 8px;
}

.badge {
  height: 22px;
  border: 1px solid var(--color-stroke);
  border-radius: 7px;
  background: var(--color-soft-white);
  color: var(--color-semi-dark-blue);
  font-size: 11px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
}

.state {
  padding: 34px 42px;
  color: var(--color-blue);
}

.state.error {
  color: #b03232;
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
}

@media (max-width: 760px) {
  .container {
    padding: 0 18px;
  }

  .hero {
    padding: 52px 0 42px;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero p {
    font-size: 18px;
  }

  .search-wrap {
    width: 100%;
  }

  .type-filters {
    grid-template-columns: 1fr;
  }

  .grid {
    grid-template-columns: 1fr;
    padding: 24px 18px 40px;
  }
}
</style>