<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-btn icon @click="goBack" class="mr-3">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-icon left color="green">mdi-airplane</v-icon>
            Travel Timeline Management
            <v-spacer></v-spacer>
            <v-btn color="success" @click="openAddDialog">
              <v-icon left>mdi-plus</v-icon>
              Add Travel Entry
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Travel Timeline Entries -->
    <v-row>
      <v-col 
        v-for="(entry, index) in travelEntries" 
        :key="entry._id" 
        cols="12" 
        md="6"
      >
        <v-card elevation="2" class="entry-card">
          <v-img 
            :src="entry.photo || placeholderImage" 
            height="200"
            cover
          >
            <div class="card-overlay">
              <v-btn icon small color="white" @click="editEntry(entry)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteEntry(entry._id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-img>
          
          <v-card-title>{{ entry.location }}</v-card-title>
          <v-card-subtitle>
            <v-chip small color="primary" class="mr-2">
              <v-icon left small>mdi-calendar</v-icon>
              {{ formatDate(entry.startDate) }}
              <span v-if="entry.endDate"> - {{ formatDate(entry.endDate) }}</span>
            </v-chip>
            <v-chip v-if="entry.companions && entry.companions.length > 0" small color="secondary">
              <v-icon left small>mdi-account-group</v-icon>
              {{ entry.companions.join(', ') }}
            </v-chip>
          </v-card-subtitle>
          
          <v-card-text>
            <p class="text-body-2">{{ entry.landmark }}</p>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex align-center">
              <v-icon small class="mr-1">mdi-map-marker</v-icon>
              <span class="text-caption">{{ entry.country || 'Unknown Country' }}</span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Empty State -->
      <v-col v-if="travelEntries.length === 0" cols="12">
        <v-card elevation="1" class="text-center pa-8">
          <v-icon size="64" color="grey">mdi-timeline-clock-outline</v-icon>
          <h3 class="mt-4 grey--text">No Travel Timeline Yet</h3>
          <p class="grey--text">Start building your travel memories!</p>
          <v-btn color="primary" @click="openAddDialog">
            <v-icon left>mdi-plus</v-icon>
            Add First Entry
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingEntry ? 'Edit' : 'Add New' }} Travel Timeline Entry</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.location"
              :rules="locationRules"
              label="Location/City *"
              required
              outlined
              class="mb-3"
              placeholder="e.g., Paris, Tokyo, New York"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.country"
              label="Country"
              outlined
              class="mb-3"
              placeholder="e.g., France, Japan, USA"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.landmark"
              label="Landmark/Notable Place"
              outlined
              class="mb-3"
              placeholder="e.g., Eiffel Tower, Times Square"
            ></v-text-field>
            
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.startDate"
                  label="Start Date *"
                  :rules="startDateRules"
                  outlined
                  type="date"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="formData.endDate"
                  label="End Date (Optional)"
                  outlined
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <v-combobox
              v-model="formData.companions"
              label="Travel Companions"
              outlined
              multiple
              chips
              class="mb-3"
              hint="Add names of people you traveled with"
              placeholder="e.g., Sarah, Mom, Dad"
            ></v-combobox>
            
            <!-- Photo Upload Section -->
            <v-card outlined class="mb-3">
              <v-card-title class="text-subtitle-1">
                <v-icon left>mdi-camera</v-icon>
                Travel Photo
              </v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="photoFile"
                  accept="image/*"
                  label="Upload Photo"
                  outlined
                  prepend-icon="mdi-camera"
                  @change="onPhotoSelected"
                  clearable
                  :loading="metadataLoading"
                ></v-file-input>
                
                <!-- Metadata extraction feedback -->
                <v-alert
                  v-if="metadataMessage"
                  :type="metadataMessage.includes('success') ? 'success' : 'info'"
                  dense
                  class="mt-2 mb-2"
                  dismissible
                >
                  <v-icon small class="mr-1">
                    {{ metadataMessage.includes('success') ? 'mdi-check-circle' : 'mdi-information' }}
                  </v-icon>
                  {{ metadataMessage }}
                </v-alert>
                
                <!-- Loading indicator for metadata extraction -->
                <v-progress-linear
                  v-if="metadataLoading"
                  indeterminate
                  color="primary"
                  class="mt-2 mb-3"
                >
                  <template #default>
                    <span class="text-caption">Extracting photo metadata...</span>
                  </template>
                </v-progress-linear>
                
                <v-img
                  v-if="formData.photo"
                  :src="formData.photo"
                  max-height="200"
                  contain
                  class="mt-3"
                ></v-img>
                
                <!-- Photo date taken info -->
                <div v-if="formData.photoDateTaken" class="text-caption grey--text mt-2">
                  <v-icon small class="mr-1">mdi-calendar-clock</v-icon>
                  Photo taken: {{ formatPhotoDate(formData.photoDateTaken) }}
                </div>
              </v-card-text>
            </v-card>
            
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model.number="formData.lat"
                  label="Latitude (Optional)"
                  outlined
                  type="number"
                  step="any"
                  hint="For map positioning"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="formData.lng"
                  label="Longitude (Optional)"
                  outlined
                  type="number"
                  step="any"
                  hint="For map positioning"
                ></v-text-field>
              </v-col>
            </v-row>
            
            <!-- Current Travel Status -->
            <v-card outlined class="mb-3">
              <v-card-title class="text-subtitle-1">
                <v-icon left>mdi-airplane-clock</v-icon>
                Current Travel Status
              </v-card-title>
              <v-card-text>
                <v-switch
                  v-model="formData.isCurrentlyTraveling"
                  label="I am currently traveling to this destination"
                  color="primary"
                  class="mb-3"
                ></v-switch>
                
                <v-select
                  v-if="formData.isCurrentlyTraveling"
                  v-model="formData.currentTravelStatus"
                  :items="travelStatusOptions"
                  label="Travel Status"
                  outlined
                  hint="Let visitors know your current travel status"
                ></v-select>
              </v-card-text>
            </v-card>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveEntry">
            {{ editingEntry ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete Travel Entry?</v-card-title>
        <v-card-text>
          Are you sure you want to delete this travel timeline entry? This action cannot be undone.
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
  name: 'TravelManagement',
  
  async mounted() {
    await this.loadTravelEntries()
  },
  
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      valid: false,
      editingEntry: null,
      itemToDelete: null,
      placeholderImage: 'https://via.placeholder.com/400x200?text=No+Image',
      photoFile: null,
      uploading: false,
      
      formData: {
        location: '',
        country: '',
        landmark: '',
        startDate: '',
        endDate: '',
        companions: [],
        photo: '',
        photoDateTaken: null,
        lat: null,
        lng: null,
        isCurrentlyTraveling: false,
        currentTravelStatus: 'completed'
      },
      
      locationRules: [
        v => !!v || 'Location is required'
      ],
      
      startDateRules: [
        v => !!v || 'Start date is required'
      ],
      
      travelStatusOptions: [
        { text: 'Planning Trip', value: 'planning' },
        { text: 'Currently Traveling (In Transit)', value: 'traveling' },
        { text: 'Arrived at Destination', value: 'arrived' },
        { text: 'Trip Completed', value: 'completed' }
      ],
      
      // Travel timeline entries (loaded from API)
      travelEntries: [],
      loading: false,
      error: null,
      metadataLoading: false,
      metadataMessage: null
    }
  },
  
  methods: {
    goBack() {
      this.$router.push('/admin/dashboard')
    },
    
    openAddDialog() {
      this.editingEntry = null
      this.resetForm()
      this.dialog = true
    },
    
    editEntry(entry) {
      this.editingEntry = entry
      this.formData = { ...entry }
      this.dialog = true
    },
    
    closeDialog() {
      this.dialog = false
      this.resetForm()
    },
    
    resetForm() {
      this.formData = {
        location: '',
        country: '',
        landmark: '',
        startDate: '',
        endDate: '',
        companions: [],
        photo: '',
        photoDateTaken: null,
        lat: null,
        lng: null,
        isCurrentlyTraveling: false,
        currentTravelStatus: 'completed'
      }
      this.photoFile = null
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },
    
    async loadTravelEntries() {
      try {
        this.loading = true
        const response = await fetch('/api/travel')
        if (response.ok) {
          this.travelEntries = await response.json()
        } else {
          this.error = 'Failed to load travel entries'
        }
      } catch (error) {
        console.error('Error loading travel entries:', error)
        this.error = 'Failed to load travel entries'
      } finally {
        this.loading = false
      }
    },
    
    async onPhotoSelected(file) {
      if (file) {
        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formData.photo = e.target.result
        }
        reader.readAsDataURL(file)
        
        // Extract metadata from photo
        await this.extractPhotoMetadata(file)
      } else {
        this.formData.photo = ''
        this.formData.photoDateTaken = null
        this.photoFile = null
      }
    },
    
    async extractPhotoMetadata(file) {
      try {
        this.metadataLoading = true
        
        const formData = new FormData()
        formData.append('photo', file)
        
        const response = await fetch('/api/photo/extract', {
          method: 'POST',
          body: formData
        })
        
        if (response.ok) {
          const result = await response.json()
          const metadata = result.metadata
          
          // Auto-populate date if found in metadata
          if (metadata.dateTaken) {
            this.formData.photoDateTaken = metadata.dateTaken
            
            // If start date is empty, populate it with photo date
            if (!this.formData.startDate) {
              const photoDate = new Date(metadata.dateTaken)
              this.formData.startDate = photoDate.toISOString().split('T')[0]
            }
          }
          
          // Auto-populate GPS coordinates if available
          if (metadata.location && metadata.location.lat && metadata.location.lng) {
            if (!this.formData.lat) this.formData.lat = metadata.location.lat
            if (!this.formData.lng) this.formData.lng = metadata.location.lng
          }
          
          // Show success message if metadata was found
          if (metadata.hasMetadata) {
            this.metadataMessage = 'Photo metadata extracted successfully!'
            setTimeout(() => { this.metadataMessage = null }, 3000)
          } else {
            this.metadataMessage = 'No metadata found in photo. Using current date.'
            setTimeout(() => { this.metadataMessage = null }, 3000)
          }
        }
      } catch (error) {
        console.error('Error extracting photo metadata:', error)
        this.metadataMessage = 'Failed to extract photo metadata'
        setTimeout(() => { this.metadataMessage = null }, 3000)
      } finally {
        this.metadataLoading = false
      }
    },
    
    async saveEntry() {
      try {
        this.uploading = true
        
        // Create FormData for multipart upload
        const formData = new FormData()
        formData.append('location', this.formData.location)
        formData.append('country', this.formData.country || '')
        formData.append('landmark', this.formData.landmark || '')
        formData.append('startDate', this.formData.startDate)
        formData.append('endDate', this.formData.endDate || '')
        formData.append('companions', JSON.stringify(this.formData.companions))
        formData.append('lat', this.formData.lat || '')
        formData.append('lng', this.formData.lng || '')
        formData.append('photoDateTaken', this.formData.photoDateTaken || '')
        formData.append('isCurrentlyTraveling', this.formData.isCurrentlyTraveling)
        formData.append('currentTravelStatus', this.formData.currentTravelStatus)
        
        // Add photo if selected
        if (this.photoFile) {
          formData.append('photo', this.photoFile)
        } else if (!this.editingEntry) {
          // For new entries without photo, don't add photo field
        } else if (this.formData.photo === '') {
          // User removed existing photo
          formData.append('removePhoto', 'true')
        }
        
        let response
        if (this.editingEntry) {
          // Update existing entry
          response = await fetch(`/api/travel/${this.editingEntry._id}`, {
            method: 'PUT',
            body: formData
          })
        } else {
          // Create new entry
          response = await fetch('/api/travel', {
            method: 'POST',
            body: formData
          })
        }
        
        if (response.ok) {
          const savedEntry = await response.json()
          
          if (this.editingEntry) {
            // Update existing entry in local array
            const index = this.travelEntries.findIndex(e => e._id === this.editingEntry._id)
            if (index !== -1) {
              this.travelEntries[index] = savedEntry
            }
          } else {
            // Add new entry to local array
            this.travelEntries.unshift(savedEntry)
          }
          
          this.closeDialog()
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error('Error saving travel entry:', error)
        this.error = 'Failed to save travel entry'
      } finally {
        this.uploading = false
      }
    },
    
    deleteEntry(id) {
      this.itemToDelete = id
      this.deleteDialog = true
    },
    
    async confirmDelete() {
      if (this.itemToDelete) {
        try {
          const response = await fetch(`/api/travel/${this.itemToDelete}`, {
            method: 'DELETE'
          })
          
          if (response.ok) {
            this.travelEntries = this.travelEntries.filter(e => e._id !== this.itemToDelete)
          } else {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
        } catch (error) {
          console.error('Error deleting travel entry:', error)
          this.error = 'Failed to delete travel entry'
        }
        
        this.itemToDelete = null
      }
      this.deleteDialog = false
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    },
    
    formatPhotoDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleString()
    }
  }
}
</script>

<style scoped>
.entry-card {
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.entry-card:hover {
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

.entry-card:hover .card-overlay {
  opacity: 1;
}

.v-card-title {
  word-break: break-word;
  font-size: 1.1rem !important;
  line-height: 1.3;
}

.v-img {
  border-radius: 4px 4px 0 0;
}
</style>