<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const cards = ref([])
const loading = ref(true)
const error = ref(null)

const normalize = (item) => {
  const acf = item.acf || {}
  const logoField = acf.logo_ || acf.logo || null
  const logoUrl = logoField && (logoField.url || logoField.sourceUrl || (logoField.sizes && (logoField.sizes.medium || logoField.sizes.medium_large || logoField.sizes.large))) || ''
  const title = (item.title && item.title.rendered) ? item.title.rendered : (item.title || '')
  const phoneNumber = acf.phone_number || acf.phoneNumber || acf.phone || ''
  return {
    id: item.id || item.databaseId || null,
    title,
    acf,
    logoUrl,
    phoneNumber
  }
}

onMounted(async () => {
  try {
    // Try GraphQL first (if WPGraphQL is available)
    try {
      const graphqlQuery = {
        query: `query GetDatabaseCards { databaseCards { nodes { id title acf { location website phoneNumber about logo { sourceUrl url } } } } }`
      }
      const g = await axios.post('http://businessdedk.lucasalmeida.dk/graphql', graphqlQuery)
      if (g.data && g.data.data && g.data.data.databaseCards && Array.isArray(g.data.data.databaseCards.nodes)) {
        cards.value = g.data.data.databaseCards.nodes.map(normalize)
        console.log('Fetched (GraphQL) cards:', cards.value)
        return
      }
    } catch (e) {
      // ignore GraphQL errors and fallback to REST below
    }

    // Try REST endpoint for databasecard using expanded ACF fields
    try {
      const res = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/databasecard?per_page=100&acf_format=standard')
      cards.value = Array.isArray(res.data) ? res.data.map(normalize) : []
      console.log('Fetched (REST databasecard + acf_format=standard) cards:', cards.value)
    } catch (err) {
      // fallback to posts
      const res2 = await axios.get('http://businessdedk.lucasalmeida.dk/wp-json/wp/v2/posts?per_page=100')
      cards.value = Array.isArray(res2.data) ? res2.data.map(normalize) : []
      console.log('Fetched (REST posts) cards:', cards.value)
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="network-page">
    <h1>Business Network</h1>

    <div v-if="loading" class="loader">Loading members...</div>

    <div v-else-if="error" class="error">Failed to load members: {{ error }}</div>

    <div v-else class="grid">
      <div v-for="card in cards" :key="card.id" class="business-card">
        <div class="card-header">
          <img
            :src="card.logoUrl || 'https://via.placeholder.com/150'"
            :alt="card.title"
            class="logo"
          />
          <h3 v-html="card.title"></h3>
          <span class="location">{{ card.acf.location }}</span>
        </div>

        <div class="card-body">
          <p v-if="card.acf.about" v-html="card.acf.about"></p>

          <div class="contact-info">
            <a v-if="card.acf.website" :href="card.acf.website" target="_blank" class="btn">Visit Website</a>
            <a v-if="card.phoneNumber" :href="'tel:' + card.phoneNumber" class="contact-link">📞 {{ card.phoneNumber }}</a>
          </div>
        </div>
      </div>

      <p v-if="cards.length === 0" class="muted">No members found.</p>
    </div>
  </div>
</template>

<style scoped>
.network-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: sans-serif;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.business-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
}

.business-card:hover {
  transform: translateY(-5px);
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 15px;
}

.location {
  color: #666;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 10px;
}

.btn {
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 15px;
  font-size: 0.9rem;
}

.contact-link {
  display: block;
  margin-top: 10px;
  color: #333;
  text-decoration: none;
  font-size: 0.85rem;
}
</style>