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
            :src="artwork.image || placeholderImage" 
            height="200"
            cover
          >
            <div class="card-overlay">
              <v-btn icon small color="white" @click="editArtwork(artwork)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteArtwork(artwork.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-img>
          <v-card-title class="text-subtitle-1">
            {{ artwork.title }}
          </v-card-title>
          <v-card-subtitle>
            {{ artwork.medium }} • {{ artwork.year }}
          </v-card-subtitle>
          <v-card-text class="text-caption">
            {{ artwork.description }}
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
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingArtwork ? 'Edit' : 'Add New' }} Artwork</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.title"
              :rules="titleRules"
              label="Title *"
              required
              outlined
              class="mb-3"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.medium"
              label="Medium"
              outlined
              class="mb-3"
              placeholder="e.g., Oil on canvas, Digital art, Watercolor"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.year"
              label="Year"
              outlined
              class="mb-3"
              type="number"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.dimensions"
              label="Dimensions"
              outlined
              class="mb-3"
              placeholder="e.g., 24x36 inches"
            ></v-text-field>
            
            <v-textarea
              v-model="formData.description"
              label="Description"
              outlined
              rows="3"
              class="mb-3"
            ></v-textarea>
            
            <v-text-field
              v-model="formData.image"
              label="Image URL"
              outlined
              class="mb-3"
              placeholder="https://example.com/image.jpg"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.price"
              label="Price (optional)"
              outlined
              class="mb-3"
              prefix="$"
              type="number"
            ></v-text-field>
            
            <v-select
              v-model="formData.status"
              :items="statusOptions"
              label="Status"
              outlined
              class="mb-3"
            ></v-select>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveArtwork">
            {{ editingArtwork ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
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
export default {
  name: 'ArtworkManagement',
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      valid: false,
      editingArtwork: null,
      itemToDelete: null,
      placeholderImage: 'https://via.placeholder.com/300x200?text=No+Image',
      
      formData: {
        title: '',
        medium: '',
        year: new Date().getFullYear(),
        dimensions: '',
        description: '',
        image: '',
        price: '',
        status: 'available'
      },
      
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length >= 2) || 'Title must be at least 2 characters'
      ],
      
      statusOptions: [
        { text: 'Available', value: 'available' },
        { text: 'Sold', value: 'sold' },
        { text: 'Not For Sale', value: 'not_for_sale' },
        { text: 'Commission', value: 'commission' }
      ],
      
      // Sample artwork data - in real app, this would come from API/database
      artworks: [
        {
          id: 1,
          title: 'Sunset Dreams',
          medium: 'Oil on canvas',
          year: 2023,
          dimensions: '24x36 inches',
          description: 'A vibrant sunset painting capturing the beauty of nature.',
          image: 'https://via.placeholder.com/300x200?text=Sunset+Dreams',
          price: 500,
          status: 'available'
        },
        {
          id: 2,
          title: 'Abstract Flow',
          medium: 'Acrylic on canvas',
          year: 2023,
          dimensions: '18x24 inches',
          description: 'An abstract piece exploring movement and color.',
          image: 'https://via.placeholder.com/300x200?text=Abstract+Flow',
          price: 350,
          status: 'sold'
        }
      ]
    }
  },
  
  methods: {
    goBack() {
      this.$router.push('/admin/dashboard')
    },
    
    openAddDialog() {
      this.editingArtwork = null
      this.resetForm()
      this.dialog = true
    },
    
    editArtwork(artwork) {
      this.editingArtwork = artwork
      this.formData = { ...artwork }
      this.dialog = true
    },
    
    closeDialog() {
      this.dialog = false
      this.resetForm()
    },
    
    resetForm() {
      this.formData = {
        title: '',
        medium: '',
        year: new Date().getFullYear(),
        dimensions: '',
        description: '',
        image: '',
        price: '',
        status: 'available'
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },
    
    saveArtwork() {
      if (this.editingArtwork) {
        // Update existing artwork
        const index = this.artworks.findIndex(a => a.id === this.editingArtwork.id)
        if (index !== -1) {
          this.artworks[index] = { ...this.formData, id: this.editingArtwork.id }
        }
      } else {
        // Add new artwork
        const newArtwork = {
          ...this.formData,
          id: Date.now() // Simple ID generation - use proper UUID in real app
        }
        this.artworks.unshift(newArtwork)
      }
      
      this.closeDialog()
    },
    
    deleteArtwork(id) {
      this.itemToDelete = id
      this.deleteDialog = true
    },
    
    confirmDelete() {
      if (this.itemToDelete) {
        this.artworks = this.artworks.filter(a => a.id !== this.itemToDelete)
        this.itemToDelete = null
      }
      this.deleteDialog = false
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