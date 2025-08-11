<template>
  <div class="travel-timeline">
    <v-timeline 
      :density="$vuetify.display.mobile ? 'compact' : 'default'"
      side="end"
      align="start"
    >
      <v-timeline-item
        v-for="(travel, index) in sortedTravels"
        :key="travel.id"
        :dot-color="index % 2 === 0 ? 'primary' : 'secondary'"
        size="small"
        class="timeline-item"
      >
        <template #icon>
          <v-icon size="small">mdi-airplane</v-icon>
        </template>
        
        <template #opposite>
          <div class="timeline-date">
            <v-chip 
              :color="index % 2 === 0 ? 'primary' : 'secondary'" 
              size="small" 
              variant="outlined"
            >
              <v-icon left size="small">
                {{ travel.photoDateTaken ? 'mdi-camera' : 'mdi-calendar' }}
              </v-icon>
              {{ getDisplayDate(travel) }}
            </v-chip>
          </div>
        </template>

        <v-card class="timeline-card" elevation="2">
          <div class="d-flex">
            <!-- Photo Section -->
            <div class="photo-section">
              <v-img
                :src="travel.photo || '/api/placeholder/120/120'"
                width="120"
                height="120"
                cover
                class="timeline-photo"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-icon size="40" color="grey-lighten-1">mdi-image</v-icon>
                  </div>
                </template>
              </v-img>
            </div>

            <!-- Content Section -->
            <div class="content-section flex-grow-1">
              <v-card-title class="text-h6 pa-3 pb-2">
                <v-icon left color="primary" size="small">mdi-map-marker</v-icon>
                {{ travel.location }}
                <span v-if="travel.country" class="text-caption text-grey ml-1">
                  , {{ travel.country }}
                </span>
              </v-card-title>

              <v-card-text class="pt-0 pb-3">
                <!-- Landmark -->
                <div v-if="travel.landmark" class="mb-2">
                  <v-chip size="small" color="success" variant="outlined">
                    <v-icon left size="small">mdi-castle</v-icon>
                    {{ travel.landmark }}
                  </v-chip>
                </div>

                <!-- Travel Companions -->
                <div v-if="travel.companions && travel.companions.length > 0" class="mb-2">
                  <v-chip 
                    v-for="companion in travel.companions" 
                    :key="companion"
                    size="small" 
                    color="purple" 
                    variant="outlined"
                    class="mr-1 mb-1"
                  >
                    <v-icon left size="small">mdi-account</v-icon>
                    {{ companion }}
                  </v-chip>
                </div>

                <!-- Duration if both dates exist -->
                <div v-if="travel.startDate && travel.endDate" class="text-caption text-grey">
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                  {{ calculateDuration(travel.startDate, travel.endDate) }}
                </div>

                <!-- Photo date indicator -->
                <div v-if="travel.photoDateTaken && travel.photoDateTaken !== travel.startDate" class="text-caption text-grey mt-1">
                  <v-icon size="small" class="mr-1">mdi-camera-outline</v-icon>
                  Photo: {{ new Date(travel.photoDateTaken).toLocaleDateString() }}
                </div>
              </v-card-text>
            </div>
          </div>
        </v-card>
      </v-timeline-item>
    </v-timeline>

    <!-- Empty State -->
    <div v-if="travels.length === 0" class="text-center pa-8">
      <v-icon size="64" color="grey-lighten-1">mdi-timeline-clock-outline</v-icon>
      <p class="text-h6 grey--text mt-4">No travel memories yet</p>
      <p class="text-body-2 grey--text">Your timeline will appear here as you add travels</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TravelTimeline',
  props: {
    travels: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    sortedTravels() {
      // Sort travels by photo date first, then start date (newest first)
      return [...this.travels].sort((a, b) => {
        // Use photo date if available, otherwise fall back to start date
        const dateA = new Date(a.photoDateTaken || a.startDate || a.date || 0)
        const dateB = new Date(b.photoDateTaken || b.startDate || b.date || 0)
        return dateB - dateA
      })
    }
  },
  methods: {
    getDisplayDate(travel) {
      // Show photo date if available, otherwise show date range
      if (travel.photoDateTaken) {
        const photoDate = new Date(travel.photoDateTaken)
        return photoDate.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        })
      }
      return this.formatDateRange(travel.startDate, travel.endDate)
    },
    
    formatDateRange(startDate, endDate) {
      if (!startDate) return 'Date unknown'
      
      const start = new Date(startDate)
      const startFormatted = start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })
      
      if (!endDate) return startFormatted
      
      const end = new Date(endDate)
      const endFormatted = end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: start.getFullYear() === end.getFullYear() ? undefined : 'numeric'
      })
      
      return `${startFormatted} - ${endFormatted}`
    },
    
    calculateDuration(startDate, endDate) {
      if (!startDate || !endDate) return ''
      
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end - start)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) return '1 day'
      if (diffDays < 7) return `${diffDays} days`
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        const days = diffDays % 7
        if (days === 0) return `${weeks} week${weeks > 1 ? 's' : ''}`
        return `${weeks} week${weeks > 1 ? 's' : ''}, ${days} day${days > 1 ? 's' : ''}`
      }
      
      const months = Math.floor(diffDays / 30)
      const remainingDays = diffDays % 30
      if (remainingDays === 0) return `${months} month${months > 1 ? 's' : ''}`
      return `${months} month${months > 1 ? 's' : ''}, ${remainingDays} days`
    }
  }
}
</script>

<style scoped>
.travel-timeline {
  max-width: 100%;
  margin: 0 auto;
}

.timeline-item {
  margin-bottom: 2rem;
}

.timeline-date {
  text-align: right;
  padding-right: 1rem;
}

.timeline-card {
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

.photo-section {
  flex-shrink: 0;
}

.timeline-photo {
  border-radius: 0;
}

.content-section {
  min-width: 0; /* Allows content to shrink */
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .timeline-card .d-flex {
    flex-direction: column;
  }
  
  .photo-section {
    width: 100%;
  }
  
  .timeline-photo {
    width: 100% !important;
    height: 200px !important;
  }
  
  .timeline-date {
    text-align: center;
    padding-right: 0;
    margin-bottom: 1rem;
  }
}

/* Vuetify timeline customization */
:deep(.v-timeline) {
  padding-left: 0;
  padding-right: 0;
}

:deep(.v-timeline-item__body) {
  padding-bottom: 2rem;
}

:deep(.v-timeline-item__opposite) {
  padding-top: 1rem;
}
</style>