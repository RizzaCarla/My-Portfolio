<template>
  <div class="media-upload">
    <div class="upload-area" @click="triggerFileInput" @drop="handleDrop" @dragover.prevent @dragenter.prevent>
      <div v-if="!uploading && !uploadedFile" class="upload-prompt">
        <svg class="upload-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
        </svg>
        <p>Click to upload or drag and drop</p>
        <p class="upload-hint">Images and videos up to 500MB</p>
      </div>
      
      <div v-if="uploading" class="upload-progress">
        <div class="spinner"></div>
        <p>Uploading...</p>
      </div>
      
      <div v-if="uploadedFile" class="upload-success">
        <svg class="success-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
        </svg>
        <p>Upload successful!</p>
        <p class="file-name">{{ uploadedFile.originalName }}</p>
      </div>
    </div>
    
    <input 
      ref="fileInput" 
      type="file" 
      accept="image/*,video/*"
      @change="handleFileSelect"
      style="display: none;"
    />
    
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaUpload',
  emits: ['file-selected', 'file-error'],
  data() {
    return {
      uploading: false,
      uploadedFile: null,
      error: null
    }
  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.uploadFile(file);
      }
    },
    
    handleDrop(event) {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        this.uploadFile(file);
      }
    },
    
    async uploadFile(file) {
      this.uploading = true;
      this.error = null;
      this.uploadedFile = null;
      
      // Validate file
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        this.error = 'Please select an image or video file';
        this.$emit('file-error', { message: this.error });
        this.uploading = false;
        return;
      }
      
      if (file.size > 500 * 1024 * 1024) { // 500MB
        this.error = 'File size must be less than 500MB';
        this.$emit('file-error', { message: this.error });
        this.uploading = false;
        return;
      }
      
      // Just store file data and emit to parent
      setTimeout(() => {
        this.uploadedFile = {
          file: file,
          originalName: file.name,
          size: file.size,
          type: file.type
        };
        
        this.$emit('file-selected', this.uploadedFile);
        this.uploading = false;
      }, 500); // Small delay for UX
    },
    
    reset() {
      this.uploadedFile = null;
      this.error = null;
      this.uploading = false;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    }
  }
}
</script>

<style scoped>
.media-upload {
  margin: 1rem 0;
}

.upload-area {
  border: 2px dashed var(--primary);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 229, 255, 0.05);
}

.upload-area:hover {
  border-color: var(--secondary);
  background: rgba(179, 136, 255, 0.05);
}

.upload-prompt p {
  margin: 0.5rem 0;
  color: var(--text-light);
}

.upload-hint {
  font-size: 0.875rem;
  color: var(--text-muted);
}

.upload-icon, .success-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  color: var(--primary);
}

.success-icon {
  color: var(--success);
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 229, 255, 0.3);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.upload-success {
  color: var(--success);
}

.file-name {
  font-size: 0.875rem;
  color: var(--text-muted);
  word-break: break-all;
}

.error-message {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid var(--error);
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
  color: var(--error);
}
</style>