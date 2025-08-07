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
          <v-tab>Digital Art</v-tab>
          <v-tab>Photography</v-tab>
          <v-tab>Sketches</v-tab>
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
            :src="artwork.image" 
            :alt="artwork.title"
            height="250"
            cover
          >
            <v-overlay absolute opacity="0" class="artwork-overlay">
              <v-btn icon large color="white">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </v-overlay>
          </v-img>
          
          <v-card-title class="text-h6">{{ artwork.title }}</v-card-title>
          <v-card-subtitle>{{ artwork.category }}</v-card-subtitle>
          <v-card-text>
            <p class="text-body-2">{{ artwork.description }}</p>
            <v-chip small :color="getCategoryColor(artwork.category)" outlined class="mt-2">
              {{ artwork.category }}
            </v-chip>
          </v-card-text>
          
          <v-card-actions>
            <v-btn text color="primary" @click.stop="viewDetails(artwork)">
              <v-icon left>mdi-information</v-icon>
              Details
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click.stop="likeArtwork(artwork.id)">
              <v-icon :color="artwork.liked ? 'red' : 'grey'">
                {{ artwork.liked ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
            <span class="text-caption">{{ artwork.likes }}</span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Results -->
    <v-row v-if="filteredArtwork.length === 0" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey">mdi-image-off</v-icon>
        <p class="text-h6 grey--text mt-4">No artwork found in this category</p>
      </v-col>
    </v-row>

    <!-- Add Artwork Button (for future admin functionality) -->
    <v-btn
      fab
      large
      color="primary"
      fixed
      bottom
      right
      @click="addArtwork"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

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
          :src="selectedArtwork.image" 
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
              <p><strong>Category:</strong> {{ selectedArtwork.category }}</p>
              <p><strong>Created:</strong> {{ selectedArtwork.created }}</p>
              <p><strong>Medium:</strong> {{ selectedArtwork.medium }}</p>
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
      artwork: [
        {
          id: 1,
          title: 'Sunset Mountains',
          category: 'Digital Art',
          description: 'A peaceful mountain landscape at sunset',
          fullDescription: 'This digital painting captures the serene beauty of mountain peaks during golden hour. Created using digital painting techniques with warm color palettes.',
          image: 'https://picsum.photos/400/300?random=1',
          created: 'March 2024',
          medium: 'Digital Painting',
          likes: 24,
          liked: false
        },
        {
          id: 2,
          title: 'Urban Portrait',
          category: 'Photography',
          description: 'Street photography in downtown',
          fullDescription: 'A candid street photograph capturing the essence of urban life. Shot during blue hour with natural lighting.',
          image: 'https://picsum.photos/400/300?random=2',
          created: 'February 2024',
          medium: 'Photography',
          likes: 18,
          liked: true
        },
        {
          id: 3,
          title: 'Character Study',
          category: 'Sketches',
          description: 'Pencil sketch of a character design',
          fullDescription: 'A detailed character study exploring facial expressions and proportions. Done with graphite pencils on paper.',
          image: 'https://picsum.photos/400/300?random=3',
          created: 'January 2024',
          medium: 'Pencil on Paper',
          likes: 31,
          liked: false
        },
        {
          id: 4,
          title: 'Abstract Flow',
          category: 'Digital Art',
          description: 'Colorful abstract digital composition',
          fullDescription: 'An experimental digital artwork exploring color theory and abstract forms. Created using various digital brushes and techniques.',
          image: 'https://picsum.photos/400/300?random=4',
          created: 'March 2024',
          medium: 'Digital Art',
          likes: 12,
          liked: false
        },
        {
          id: 5,
          title: 'Nature Close-up',
          category: 'Photography',
          description: 'Macro photography of forest details',
          fullDescription: 'A macro photograph showcasing the intricate details found in nature. Shot with natural lighting in a local forest.',
          image: 'https://picsum.photos/400/300?random=5',
          created: 'April 2024',
          medium: 'Macro Photography',
          likes: 27,
          liked: true
        },
        {
          id: 6,
          title: 'Architecture Study',
          category: 'Sketches',
          description: 'Ink drawing of historic building',
          fullDescription: 'An architectural study of a historic building, focusing on perspective and detail. Created with ink pens and fine liners.',
          image: 'https://picsum.photos/400/300?random=6',
          created: 'February 2024',
          medium: 'Ink Drawing',
          likes: 15,
          liked: false
        }
      ],
      categories: ['All', 'Digital Art', 'Photography', 'Sketches']
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
  methods: {
    getCategoryColor(category) {
      const colors = {
        'Digital Art': 'purple',
        'Photography': 'blue',
        'Sketches': 'orange'
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
    likeArtwork(id) {
      const artwork = this.artwork.find(item => item.id === id)
      if (artwork) {
        artwork.liked = !artwork.liked
        artwork.likes += artwork.liked ? 1 : -1
      }
    },
    addArtwork() {
      alert('Add artwork functionality would be implemented here for admin users.')
    }
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