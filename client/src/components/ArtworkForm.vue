<template>
  <div class="artwork-form">
    <h2>Add New Artwork</h2>
    
    <form @submit.prevent="submitArtwork" class="form">
      <div class="form-group">
        <label for="title">Title *</label>
        <input 
          id="title"
          v-model="formData.title" 
          type="text" 
          required
          placeholder="Enter artwork title"
          class="form-input"
          @focus="clearError"
          @input="clearError"
        />
      </div>
      
      <div class="form-group">
        <label for="category">Category *</label>
        <select 
          id="category"
          v-model="formData.category" 
          required
          class="form-select"
          @focus="clearError"
          @change="clearError"
        >
          <option value="">Select category</option>
          <option value="painting">Painting</option>
          <option value="ceramic">Ceramic</option>
          <option value="embroidery">Embroidery</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="description">Description *</label>
        <textarea 
          id="description"
          v-model="formData.description" 
          required
          placeholder="Describe your artwork"
          class="form-textarea"
          rows="4"
          @focus="clearError"
          @input="clearError"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>Media Upload *</label>
        <MediaUpload 
          ref="mediaUpload"
          @file-selected="handleFileSelected"
          @file-error="handleFileError"
          @click="clearError"
        />
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          @click="resetForm"
          class="btn btn-secondary"
          :disabled="submitting"
          @focus="clearError"
        >
          Reset
        </button>
        
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="!isFormValid || submitting"
        >
          <span v-if="submitting">Creating...</span>
          <span v-else>Create Artwork</span>
        </button>
      </div>
      
    </form>
  </div>
</template>

<script>
import MediaUpload from './MediaUpload.vue'

export default {
  name: 'ArtworkForm',
  components: {
    MediaUpload
  },
  emits: ['artwork-created', 'artwork-error'],
  data() {
    return {
      formData: {
        title: '',
        category: '',
        description: ''
      },
      selectedFile: null,
      submitting: false,
      error: null,
    }
  },
  
  computed: {
    isFormValid() {
      return (
        this.formData.title.trim() !== '' &&
        this.formData.category !== '' &&
        this.formData.description.trim() !== '' &&
        this.selectedFile !== null
      );
    }
  },
  methods: {
    handleFileSelected(fileData) {
      this.selectedFile = fileData;
      this.error = null;
    },
    
    handleFileError(error) {
      this.error = `File error: ${error.message}`;
      this.selectedFile = null;
    },
    
    async submitArtwork() {
      if (!this.isFormValid) {
        this.error = 'Please fill in all required fields and select a file';
        this.$emit('artwork-error', this.error);
        return;
      }
      
      this.submitting = true;
      this.error = null;
      
      const formData = new FormData();
      formData.append('title', this.formData.title.trim());
      formData.append('category', this.formData.category);
      formData.append('description', this.formData.description.trim());
      formData.append('media', this.selectedFile.file);
      
      try {
        const response = await fetch('/api/artwork', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to create artwork');
        }
        
        this.resetForm();
        
        // Emit event to parent component
        this.$emit('artwork-created', result);
        
      } catch (error) {
        console.error('Artwork creation error:', error);
        this.error = `Upload failed: ${error.message}`;
        this.$emit('artwork-error', this.error);
      } finally {
        this.submitting = false;
      }
    },
    
    resetForm() {
      this.formData = {
        title: '',
        category: '',
        description: ''
      };
      this.selectedFile = null;
      this.error = null;
      
      if (this.$refs.mediaUpload) {
        this.$refs.mediaUpload.reset();
      }
    }
  }
}
</script>

<style scoped>
.artwork-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.artwork-form h2 {
  color: var(--primary);
  margin-bottom: 2rem;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-light);
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  border: 2px solid rgba(0, 229, 255, 0.3);
  border-radius: 8px;
  background: var(--bg-dark);
  color: var(--text-light);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}


.btn-primary {
  background: var(--primary);
  color: var(--bg-dark);
}

.btn-primary:hover:not(:disabled) {
  background: var(--secondary);
}

.btn-secondary {
  background: transparent;
  color: var(--text-light);
  border: 2px solid var(--text-muted);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

</style>