<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" class="text-center mb-6">
        <h1 class="text-h3 mb-4 primary--text">
          <v-icon left size="48">mdi-airplane</v-icon>
          My Travels
        </h1>
        <p class="text-h6 text--secondary">
          Adventures and experiences from around the world
        </p>
      </v-col>
    </v-row>

    <!-- Travel Map Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card elevation="4">
          <v-card-title>
            <v-icon left>mdi-map</v-icon>
            {{ travels.length > 0 ? "Places I've Visited" : "Home Base & Future Adventures" }}
          </v-card-title>
          <v-card-text class="pa-4">
            <TravelMap 
              :travel-destinations="travels" 
              :map-height="400"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Travel Timeline -->
    <v-row v-if="travels.length > 0">
      <v-col cols="12">
        <v-card elevation="4">
          <v-card-title>
            <v-icon left>mdi-timeline</v-icon>
            My Travel Timeline
          </v-card-title>
          <v-card-text>
            <TravelTimeline :travels="travels" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- No Travel Data -->
    <v-row v-if="travels.length === 0" class="mt-8">
      <v-col cols="12" class="text-center">
        <v-icon size="64" color="grey">mdi-home</v-icon>
        <p class="text-h6 grey--text mt-4">Chilling at home</p>
        <p class="text-body-2 grey--text">Check back later for my newest travel adventures!</p>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import TravelMap from '@/components/TravelMap.vue'
import TravelTimeline from '@/components/TravelTimeline.vue'

export default {
  name: 'TravelsView',
  components: {
    TravelMap,
    TravelTimeline
  },
  data() {
    return {
      travels: [],
      loading: false,
      error: null
    }
  },
  
  async mounted() {
    await this.loadTravels()
  },
  
  methods: {
    async loadTravels() {
      try {
        this.loading = true
        const response = await fetch('/api/travel')
        if (response.ok) {
          this.travels = await response.json()
        } else {
          this.error = 'Failed to load travel data'
        }
      } catch (error) {
        console.error('Error loading travels:', error)
        this.error = 'Failed to load travel data'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
/* Travel view specific styles */
</style>