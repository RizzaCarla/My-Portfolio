<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-btn icon @click="goBack" class="mr-3">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-icon left color="purple">mdi-palette</v-icon>
            Artwork Management
            <v-spacer></v-spacer>
            <v-btn color="success" @click="openAddDialog">
              <v-icon left>mdi-plus</v-icon>
              Add New Artwork
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Artwork Grid -->
    <v-row>
      <v-col 
        v-for="(artwork, index) in artworks" 
        :key="artwork.id" 
        cols="12" 
        sm="6" 
        md="4" 
        lg="3"
      >
        <v-card elevation="2" class="artwork-card">
          <v-img 
            :src="artwork.imageUrl || placeholderImage" 
            height="200"
            cover
          >
            <div class="card-overlay">
              <v-btn icon small color="white" @click="editArtwork(artwork)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteArtwork(artwork._id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-img>
          <v-card-title class="text-subtitle-1">
            {{ artwork.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ artwork.category }}
          </v-card-subtitle>
          <v-card-text class="text-caption">
            {{ artwork.description }}
          </v-card-text>
          <v-card-text class="text-caption text--secondary">
            {{ formatDate(artwork.createdAt) }}
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Empty State -->
      <v-col v-if="artworks.length === 0" cols="12">
        <v-card elevation="1" class="text-center pa-8">
          <v-icon size="64" color="grey">mdi-palette-outline</v-icon>
          <h3 class="mt-4 grey--text">No Artwork Yet</h3>
          <p class="grey--text">Start by adding your first artwork piece.</p>
          <v-btn color="primary" @click="openAddDialog">
            <v-icon left>mdi-plus</v-icon>
            Add First Artwork
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="d-flex justify-space-between">
          <span class="text-h5">{{ editingArtwork ? 'Edit' : 'Add New' }} Artwork</span>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-0">
          <ArtworkForm 
            ref="artworkForm"
            @artwork-created="handleArtworkCreated"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete Artwork?</v-card-title>
        <v-card-text>
          Are you sure you want to delete this artwork? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ArtworkForm from '@/components/ArtworkForm.vue'

export default {
  name: 'ArtworkManagement',
  components: {
    ArtworkForm
  },
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      editingArtwork: null,
      itemToDelete: null,
      placeholderImage: 'https://via.placeholder.com/300x200?text=No+Image',
      loading: true,
      
      // Real artwork data from API
      artworks: []
    }
  },
  
  async mounted() {
    await this.fetchArtworks()
  },
  
  methods: {
    goBack() {
      this.$router.push('/admin/dashboard')
    },
    
    async fetchArtworks() {
      try {
        this.loading = true
        const response = await fetch('/api/artwork')
        
        if (!response.ok) {
          throw new Error('Failed to fetch artworks')
        }
        
        this.artworks = await response.json()
      } catch (error) {
        console.error('Error fetching artworks:', error)
        this.$emit('show-error', 'Failed to load artworks')
      } finally {
        this.loading = false
      }
    },
    
    openAddDialog() {
      this.editingArtwork = null
      this.dialog = true
      
      // Reset form after dialog opens
      this.$nextTick(() => {
        if (this.$refs.artworkForm) {
          this.$refs.artworkForm.resetForm()
        }
      })
    },
    
    editArtwork(artwork) {
      this.editingArtwork = artwork
      // TODO: Implement edit functionality with existing artwork data
      this.dialog = true
    },
    
    closeDialog() {
      this.dialog = false
      this.editingArtwork = null
    },
    
    handleArtworkCreated(newArtwork) {
      // Add new artwork to the beginning of the list
      this.artworks.unshift(newArtwork)
      this.closeDialog()
      
      // Show success message
      this.$emit('show-success', 'Artwork created successfully!')
    },
    
    deleteArtwork(id) {
      this.itemToDelete = id
      this.deleteDialog = true
    },
    
    async confirmDelete() {
      if (this.itemToDelete) {
        try {
          const response = await fetch(`/api/artwork/${this.itemToDelete}`, {
            method: 'DELETE'
          })
          
          if (!response.ok) {
            throw new Error('Failed to delete artwork')
          }
          
          // Remove from local array
          this.artworks = this.artworks.filter(a => a._id !== this.itemToDelete)
          this.$emit('show-success', 'Artwork deleted successfully!')
          
        } catch (error) {
          console.error('Error deleting artwork:', error)
          this.$emit('show-error', 'Failed to delete artwork')
        }
        
        this.itemToDelete = null
      }
      this.deleteDialog = false
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.artwork-card {
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.artwork-card:hover {
  transform: translateY(-2px);
}

.card-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.artwork-card:hover .card-overlay {
  opacity: 1;
}

.v-card-title {
  word-break: break-word;
}

.v-img {
  border-radius: 4px 4px 0 0;
}
</style>