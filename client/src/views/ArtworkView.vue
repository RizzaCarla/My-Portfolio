<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" class="text-center mb-6">
        <h1 class="text-h3 mb-4 primary--text">
          <v-icon left size="48">mdi-palette</v-icon>
          My Artwork
        </h1>
        <p class="text-h6 text--secondary">
          A collection of my digital and traditional art pieces
        </p>
      </v-col>
    </v-row>

    <!-- Filter Tabs -->
    <v-row class="mb-6">
      <v-col cols="12">
        <v-tabs 
          v-model="activeTab" 
          centered 
          color="primary"
          background-color="transparent"
          class="mb-4"
        >
          <v-tab>All</v-tab>
          <v-tab>Painting</v-tab>
          <v-tab>Ceramic</v-tab>
          <v-tab>Embroidery</v-tab>
        </v-tabs>
      </v-col>
    </v-row>

    <!-- Artwork Gallery -->
    <v-row>
      <v-col 
        v-for="artwork in filteredArtwork" 
        :key="artwork.id"
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
      >
        <v-card 
          class="artwork-card" 
          elevation="4" 
          @click="openArtwork(artwork)"
          hover
        >
          <v-img 
            :src="artwork.imageUrl" 
            :alt="artwork.title"
            height="250"
            cover
            :loading="loading"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </v-row>
            </template>
            <template v-slot:error>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-icon size="48" color="grey">mdi-image-broken-variant</v-icon>
              </v-row>
            </template>
            <v-overlay absolute opacity="0" class="artwork-overlay">
              <v-btn icon large color="white">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </v-overlay>
          </v-img>
          
          <v-card-title class="text-h6">{{ artwork.title }}</v-card-title>
          <v-card-text>
            <p class="text-body-2">{{ artwork.description }}</p>
            <v-chip small :color="getCategoryColor(artwork.category)" outlined class="mt-2">
              {{ formatCategory(artwork.category) }}
            </v-chip>
          </v-card-text>
          
          <v-card-actions>
            <v-btn text color="primary" @click.stop="viewDetails(artwork)">
              <v-icon left>mdi-information</v-icon>
              Details
            </v-btn>
            <v-spacer></v-spacer>
            <span class="text-caption">{{ formatDate(artwork.createdAt) }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-progress-circular size="64" indeterminate color="primary"></v-progress-circular>
        <p class="text-h6 mt-4">Loading artwork...</p>
      </v-col>
    </v-row>

    <!-- No Results -->
    <v-row v-else-if="filteredArtwork.length === 0 && !loading" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey">mdi-image-off</v-icon>
        <p class="text-h6 grey--text mt-4">
          {{ activeTab === 0 ? 'No artwork available yet' : 'No artwork found in this category' }}
        </p>
      </v-col>
    </v-row>


    <!-- Artwork Detail Dialog -->
    <v-dialog v-model="detailDialog" max-width="800">
      <v-card v-if="selectedArtwork">
        <v-card-title class="text-h5">
          {{ selectedArtwork.title }}
          <v-spacer></v-spacer>
          <v-btn icon @click="detailDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-img 
          :src="selectedArtwork.imageUrl" 
          :alt="selectedArtwork.title"
          max-height="400"
          contain
        ></v-img>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <h4 class="text-h6 mb-2">Description</h4>
              <p>{{ selectedArtwork.fullDescription || selectedArtwork.description }}</p>
            </v-col>
            <v-col cols="12" md="4">
              <h4 class="text-h6 mb-2">Details</h4>
              <p><strong>Category:</strong> {{ formatCategory(selectedArtwork.category) }}</p>
              <p><strong>Created:</strong> {{ formatDate(selectedArtwork.createdAt) }}</p>
              <p><strong>Updated:</strong> {{ formatDate(selectedArtwork.updatedAt) }}</p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'ArtworkView',
  data() {
    return {
      activeTab: 0,
      detailDialog: false,
      selectedArtwork: null,
      loading: false,
      artwork: [
      ],
      categories: ['All', 'painting', 'ceramic', 'embroidery']
    }
  },
  computed: {
    filteredArtwork() {
      if (this.activeTab === 0) {
        return this.artwork
      }
      const category = this.categories[this.activeTab]
      return this.artwork.filter(item => item.category === category)
    }
  },
  
  async mounted() {
    await this.fetchArtworks()
  },
  methods: {
    async fetchArtworks() {
      try {
        this.loading = true
        const response = await fetch('/api/artwork')
        
        if (!response.ok) {
          throw new Error('Failed to fetch artworks')
        }
        
        this.artwork = await response.json()
      } catch (error) {
        console.error('Error fetching artworks:', error)
        // Keep empty array on error
        this.artwork = []
      } finally {
        this.loading = false
      }
    },
    
    formatCategory(category) {
      return category.charAt(0).toUpperCase() + category.slice(1)
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    
    getCategoryColor(category) {
      const colors = {
        'painting': 'purple',
        'ceramic': 'orange',
        'embroidery': 'pink'
      }
      return colors[category] || 'grey'
    },
    openArtwork(artwork) {
      this.selectedArtwork = artwork
      this.detailDialog = true
    },
    viewDetails(artwork) {
      this.openArtwork(artwork)
    },
  }
}
</script>

<style scoped>
.artwork-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.artwork-card:hover {
  transform: translateY(-4px);
}

.artwork-card:hover .artwork-overlay {
  opacity: 1 !important;
}

.artwork-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
}

.v-tabs {
  margin-bottom: 24px;
}
</style>