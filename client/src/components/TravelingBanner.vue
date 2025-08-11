<template>
  <v-slide-y-transition>
    <v-banner
      v-if="currentTravel"
      class="traveling-banner"
      color="red"
      dark
      sticky
    >
      <template #icon>
        <v-icon 
          :class="{ 'airplane-flying': currentTravel.currentTravelStatus === 'traveling' }"
          size="24"
        >
          {{ getStatusIcon() }}
        </v-icon>
      </template>

      <div class="banner-content">
        <div class="travel-status">
          <span class="status-text">
            {{ getStatusMessage() }} {{ currentTravel.location }}{{ currentTravel.country ? `, ${currentTravel.country}` : '' }}
          </span>
        </div>

        <div v-if="currentTravel.currentTravelStatus === 'traveling'" class="unavailable-notice">
          <v-chip 
            small 
            :color="getChipColor()" 
            class="mr-2 solid-chip"
          >
            {{ getStatusLabel() }}
          </v-chip>
          <v-icon small class="mr-1">mdi-message-off</v-icon>
          <span class="notice-text">Can't respond to messages right now</span>
          <router-link to="/travels" class="travel-link ml-2">
            <v-icon small>mdi-arrow-right</v-icon>
            Check my travels
          </router-link>
        </div>
        
        <div v-else class="status-chip">
          <v-chip 
            small 
            :color="getChipColor()" 
            class="ml-2 solid-chip"
          >
            {{ getStatusLabel() }}
          </v-chip>
        </div>
      </div>

      <v-btn 
        icon 
        small 
        @click="dismissBanner" 
        class="dismiss-btn"
        style="position: absolute; top: 8px; right: 8px;"
      >
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </v-banner>
  </v-slide-y-transition>
</template>

<script>
export default {
  name: 'TravelingBanner',
  data() {
    return {
      currentTravel: null,
      dismissed: false,
      refreshInterval: null
    }
  },
  
  async mounted() {
    await this.loadCurrentTravel()
    // Refresh every 30 seconds to check for status updates
    this.refreshInterval = setInterval(this.loadCurrentTravel, 30000)
  },
  
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  
  
  methods: {
    async loadCurrentTravel() {
      try {
        const response = await fetch('/api/travel/current')
        if (response.ok) {
          const travel = await response.json()
          this.currentTravel = travel
          // Reset dismissed state if there's a new travel
          if (travel && travel._id !== this.lastTravelId) {
            this.dismissed = false
            this.lastTravelId = travel._id
          }
        } else {
          this.currentTravel = null
        }
      } catch (error) {
        console.error('Error loading current travel:', error)
        this.currentTravel = null
      }
    },
    
    getStatusMessage() {
      switch (this.currentTravel?.currentTravelStatus) {
        case 'planning':
          return "I'm planning a trip to"
        case 'traveling':
          return "I'm currently flying to"
        case 'arrived':
          return "I've arrived in"
        default:
          return "Recent travel:"
      }
    },
    
    getStatusLabel() {
      switch (this.currentTravel?.currentTravelStatus) {
        case 'planning':
          return 'Planning'
        case 'traveling':
          return 'In Transit'
        case 'arrived':
          return 'Arrived'
        default:
          return 'Completed'
      }
    },
    
    getStatusIcon() {
      switch (this.currentTravel?.currentTravelStatus) {
        case 'planning':
          return 'mdi-calendar-clock'
        case 'traveling':
          return 'mdi-airplane'
        case 'arrived':
          return 'mdi-map-marker-check'
        default:
          return 'mdi-airplane-landing'
      }
    },
    
    
    getChipColor() {
      switch (this.currentTravel?.currentTravelStatus) {
        case 'planning':
          return 'warning'
        case 'traveling':
          return 'success'
        case 'arrived':
          return 'success'
        default:
          return 'info'
      }
    },
    
    dismissBanner() {
      this.dismissed = true
      // Store dismissal in sessionStorage so it stays dismissed during the session
      sessionStorage.setItem(`travel-banner-dismissed-${this.currentTravel._id}`, 'true')
    }
  },
  
  watch: {
    currentTravel: {
      handler(newTravel) {
        if (newTravel && newTravel._id) {
          // Check if this specific travel was already dismissed in this session
          const isDismissed = sessionStorage.getItem(`travel-banner-dismissed-${newTravel._id}`)
          this.dismissed = !!isDismissed
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.traveling-banner {
  position: sticky;
  top: 64px; /* Below the app bar */
  z-index: 999;
  border-radius: 0 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  background-color: #f44336 !important; /* Force red background */
}

.traveling-banner :deep(.v-banner) {
  background-color: #f44336 !important; /* Force red background on banner */
}

.traveling-banner :deep(.v-banner__content) {
  padding-right: 50px; /* Make room for close button */
  position: relative;
}

.banner-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.travel-status {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.status-text {
  font-size: 16px;
  font-weight: 500;
}

.status-chip {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.unavailable-notice {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
  font-size: 13px;
  opacity: 0.95;
}

.notice-text {
  font-style: italic;
}

.travel-link {
  color: inherit;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 2px;
  transition: opacity 0.2s ease;
}

.travel-link:hover {
  opacity: 0.8;
}

.dismiss-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.dismiss-btn:hover {
  opacity: 1;
}

/* Force chip to have 100% opacity background */
.solid-chip :deep(.v-chip) {
  opacity: 1 !important;
}

.solid-chip :deep(.v-chip__content) {
  opacity: 1 !important;
}

.solid-chip :deep(.v-chip__overlay) {
  opacity: 0 !important; /* Remove any overlay that might cause transparency */
}

/* Airplane flying animation */
.airplane-flying {
  animation: fly 3s ease-in-out infinite;
}

@keyframes fly {
  0% {
    transform: translateX(0) rotate(0deg);
  }
  25% {
    transform: translateX(5px) rotate(5deg);
  }
  50% {
    transform: translateX(0) rotate(0deg);
  }
  75% {
    transform: translateX(-5px) rotate(-5deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .banner-content {
    font-size: 14px;
  }
  
  .status-text {
    font-size: 14px;
  }
  
  .destination-text {
    font-size: 13px;
  }
  
  .unavailable-notice {
    font-size: 12px;
  }
  
  .traveling-banner {
    top: 56px; /* Mobile app bar height */
  }
}

/* Animation for banner appearance */
.v-slide-y-transition-enter-active,
.v-slide-y-transition-leave-active {
  transition: transform 0.4s ease, opacity 0.4s ease;
}

.v-slide-y-transition-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.v-slide-y-transition-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>