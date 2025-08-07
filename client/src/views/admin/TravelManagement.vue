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
            Travel Stories Management
            <v-spacer></v-spacer>
            <v-btn color="success" @click="openAddDialog">
              <v-icon left>mdi-plus</v-icon>
              Add New Story
            </v-btn>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <!-- Travel Stories List -->
    <v-row>
      <v-col 
        v-for="(story, index) in travelStories" 
        :key="story.id" 
        cols="12" 
        md="6"
      >
        <v-card elevation="2" class="story-card">
          <v-img 
            :src="story.coverImage || placeholderImage" 
            height="200"
            cover
          >
            <div class="card-overlay">
              <v-btn icon small color="white" @click="editStory(story)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteStory(story.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-img>
          
          <v-card-title>{{ story.title }}</v-card-title>
          <v-card-subtitle>
            <v-chip small color="primary" class="mr-2">
              <v-icon left small>mdi-map-marker</v-icon>
              {{ story.location }}
            </v-chip>
            <v-chip small color="success">
              <v-icon left small>mdi-calendar</v-icon>
              {{ formatDate(story.date) }}
            </v-chip>
          </v-card-subtitle>
          
          <v-card-text>
            <p class="text-body-2">{{ story.excerpt }}</p>
            <v-divider class="my-2"></v-divider>
            <div class="d-flex align-center">
              <v-icon small class="mr-1">mdi-eye</v-icon>
              <span class="text-caption mr-3">{{ story.views || 0 }} views</span>
              <v-chip 
                :color="story.status === 'published' ? 'success' : 'warning'"
                x-small
                outlined
              >
                {{ story.status }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Empty State -->
      <v-col v-if="travelStories.length === 0" cols="12">
        <v-card elevation="1" class="text-center pa-8">
          <v-icon size="64" color="grey">mdi-airplane-off</v-icon>
          <h3 class="mt-4 grey--text">No Travel Stories Yet</h3>
          <p class="grey--text">Start documenting your adventures!</p>
          <v-btn color="primary" @click="openAddDialog">
            <v-icon left>mdi-plus</v-icon>
            Add First Story
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="800px" persistent scrollable>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingStory ? 'Edit' : 'Add New' }} Travel Story</span>
        </v-card-title>
        
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="formData.title"
              :rules="titleRules"
              label="Story Title *"
              required
              outlined
              class="mb-3"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.location"
              :rules="locationRules"
              label="Location *"
              required
              outlined
              class="mb-3"
              placeholder="e.g., Paris, France"
            ></v-text-field>
            
            <v-text-field
              v-model="formData.date"
              label="Travel Date"
              outlined
              class="mb-3"
              type="date"
            ></v-text-field>
            
            <v-textarea
              v-model="formData.excerpt"
              label="Short Description/Excerpt *"
              :rules="excerptRules"
              outlined
              rows="2"
              class="mb-3"
              counter="200"
              hint="Brief description that appears in previews"
            ></v-textarea>
            
            <v-textarea
              v-model="formData.content"
              label="Full Story Content *"
              :rules="contentRules"
              outlined
              rows="8"
              class="mb-3"
              hint="Full travel story (Markdown supported)"
            ></v-textarea>
            
            <v-text-field
              v-model="formData.coverImage"
              label="Cover Image URL"
              outlined
              class="mb-3"
              placeholder="https://example.com/image.jpg"
            ></v-text-field>
            
            <v-combobox
              v-model="formData.tags"
              label="Tags"
              outlined
              multiple
              chips
              class="mb-3"
              hint="Add tags to categorize your story"
              :items="commonTags"
            ></v-combobox>
            
            <v-select
              v-model="formData.status"
              :items="statusOptions"
              label="Status *"
              outlined
              class="mb-3"
            ></v-select>
          </v-form>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn color="primary" :disabled="!valid" @click="saveStory">
            {{ editingStory ? 'Update' : 'Save' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Delete Travel Story?</v-card-title>
        <v-card-text>
          Are you sure you want to delete this travel story? This action cannot be undone.
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
  data() {
    return {
      dialog: false,
      deleteDialog: false,
      valid: false,
      editingStory: null,
      itemToDelete: null,
      placeholderImage: 'https://via.placeholder.com/400x200?text=No+Image',
      
      formData: {
        title: '',
        location: '',
        date: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: [],
        status: 'draft'
      },
      
      titleRules: [
        v => !!v || 'Title is required',
        v => (v && v.length >= 5) || 'Title must be at least 5 characters'
      ],
      
      locationRules: [
        v => !!v || 'Location is required'
      ],
      
      excerptRules: [
        v => !!v || 'Excerpt is required',
        v => (v && v.length <= 200) || 'Excerpt must be 200 characters or less'
      ],
      
      contentRules: [
        v => !!v || 'Story content is required',
        v => (v && v.length >= 100) || 'Story must be at least 100 characters'
      ],
      
      statusOptions: [
        { text: 'Draft', value: 'draft' },
        { text: 'Published', value: 'published' },
        { text: 'Archived', value: 'archived' }
      ],
      
      commonTags: [
        'Adventure', 'Food', 'Culture', 'Nature', 'City', 'Beach', 
        'Mountains', 'Photography', 'Solo Travel', 'Backpacking'
      ],
      
      // Sample travel stories data
      travelStories: [
        {
          id: 1,
          title: 'Adventures in Tokyo: A First Timer\'s Guide',
          location: 'Tokyo, Japan',
          date: '2023-09-15',
          excerpt: 'My first trip to Tokyo was an incredible journey through neon-lit streets, delicious street food, and ancient temples.',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          coverImage: 'https://via.placeholder.com/400x200?text=Tokyo+Adventure',
          tags: ['City', 'Culture', 'Food'],
          status: 'published',
          views: 156
        },
        {
          id: 2,
          title: 'Hiking the Inca Trail to Machu Picchu',
          location: 'Cusco, Peru',
          date: '2023-07-20',
          excerpt: 'A challenging but rewarding 4-day hike through stunning Andean landscapes to reach the legendary Machu Picchu.',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
          coverImage: 'https://via.placeholder.com/400x200?text=Machu+Picchu',
          tags: ['Adventure', 'Mountains', 'Hiking'],
          status: 'published',
          views: 89
        }
      ]
    }
  },
  
  methods: {
    goBack() {
      this.$router.push('/admin/dashboard')
    },
    
    openAddDialog() {
      this.editingStory = null
      this.resetForm()
      this.dialog = true
    },
    
    editStory(story) {
      this.editingStory = story
      this.formData = { ...story }
      this.dialog = true
    },
    
    closeDialog() {
      this.dialog = false
      this.resetForm()
    },
    
    resetForm() {
      this.formData = {
        title: '',
        location: '',
        date: '',
        excerpt: '',
        content: '',
        coverImage: '',
        tags: [],
        status: 'draft'
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },
    
    saveStory() {
      if (this.editingStory) {
        // Update existing story
        const index = this.travelStories.findIndex(s => s.id === this.editingStory.id)
        if (index !== -1) {
          this.travelStories[index] = { 
            ...this.formData, 
            id: this.editingStory.id,
            views: this.editingStory.views || 0
          }
        }
      } else {
        // Add new story
        const newStory = {
          ...this.formData,
          id: Date.now(),
          views: 0
        }
        this.travelStories.unshift(newStory)
      }
      
      this.closeDialog()
    },
    
    deleteStory(id) {
      this.itemToDelete = id
      this.deleteDialog = true
    },
    
    confirmDelete() {
      if (this.itemToDelete) {
        this.travelStories = this.travelStories.filter(s => s.id !== this.itemToDelete)
        this.itemToDelete = null
      }
      this.deleteDialog = false
    },
    
    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.story-card {
  position: relative;
  transition: transform 0.2s ease-in-out;
}

.story-card:hover {
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

.story-card:hover .card-overlay {
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