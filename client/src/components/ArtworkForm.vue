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
        />
      </div>
      
      <div class="form-group">
        <label for="category">Category *</label>
        <select 
          id="category"
          v-model="formData.category" 
          required
          class="form-select"
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
        ></textarea>
      </div>
      
      <div class="form-group">
        <label>Media Upload *</label>
        <MediaUpload 
          ref="mediaUpload"
          @upload-success="handleUploadSuccess"
          @upload-error="handleUploadError"
        />
      </div>
      
      <div class="form-actions">
        <button 
          type="button" 
          @click="resetForm"
          class="btn btn-secondary"
          :disabled="submitting"
        >
          Reset
        </button>
        
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="submitting || !uploadedMedia"
        >
          <span v-if="submitting">Creating...</span>
          <span v-else>Create Artwork</span>
        </button>
      </div>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
      
      <div v-if="success" class="success-message">
        Artwork created successfully!
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
  data() {
    return {
      formData: {
        title: '',
        category: '',
        description: ''
      },
      uploadedMedia: null,
      submitting: false,
      error: null,
      success: false
    }
  },
  methods: {
    handleUploadSuccess(fileData) {
      this.uploadedMedia = fileData;
      this.error = null;
    },
    
    handleUploadError(error) {
      this.error = `Upload failed: ${error.message}`;
    },
    
    async submitArtwork() {
      if (!this.uploadedMedia) {
        this.error = 'Please upload a media file first';
        return;
      }
      
      this.submitting = true;
      this.error = null;
      this.success = false;
      
      const formData = new FormData();
      formData.append('title', this.formData.title);
      formData.append('category', this.formData.category);
      formData.append('description', this.formData.description);
      
      try {
        const response = await fetch('/api/artwork', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('Failed to create artwork');
        }
        
        const result = await response.json();
        this.success = true;
        this.resetForm();
        
        // Emit event to parent component
        this.$emit('artwork-created', result);
        
      } catch (error) {
        this.error = error.message;
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
      this.uploadedMedia = null;
      this.error = null;
      this.success = false;
      
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.error-message {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid var(--error);
  border-radius: 4px;
  padding: 0.75rem;
  color: var(--error);
}

.success-message {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid var(--success);
  border-radius: 4px;
  padding: 0.75rem;
  color: var(--success);
}
</style>