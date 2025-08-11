<template>
  <div class="travel-map">
    <div 
      ref="mapContainer" 
      class="map-container"
      :style="{ height: mapHeight + 'px' }"
    ></div>
    <div v-if="loading" class="map-loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p class="mt-2">Loading map...</p>
    </div>
    <div v-if="error" class="map-error">
      <v-icon size="48" color="error">mdi-map-marker-off</v-icon>
      <p class="text-body-2 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { Loader } from '@googlemaps/js-api-loader'

export default {
  name: 'TravelMap',
  props: {
    travelDestinations: {
      type: Array,
      default: () => []
    },
    mapHeight: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      map: null,
      loading: true,
      error: null,
      markers: [],
      // Home location (Rancho Cucamonga, CA)
      homeLocation: {
        lat: 34.1064,
        lng: -117.5931,
        title: 'Home - Rancho Cucamonga, CA',
        isHome: true
      }
    }
  },
  async mounted() {
    await this.initializeMap()
  },
  watch: {
    travelDestinations: {
      handler(newDestinations) {
        if (this.map) {
          this.updateMapPins()
        }
      },
      deep: true
    }
  },
  methods: {
    async initializeMap() {
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
          throw new Error('Google Maps API key not configured')
        }

        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['marker']
        })

        const google = await loader.load()
        
        const { Map } = await google.maps.importLibrary('maps')
        const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary('marker')
        
        // Initialize map
        this.map = new Map(this.$refs.mapContainer, {
          zoom: this.travelDestinations.length > 0 ? 2 : 4,
          center: this.travelDestinations.length > 0 
            ? { lat: 20, lng: 0 } // World view
            : this.homeLocation, // Focus on home
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          scaleControl: true,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: true
        })

        // Add home marker
        this.addHomeMarker()
        
        // Add travel destination markers
        this.updateMapPins()
        
        this.loading = false
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        
        // More specific error messages
        if (error.message.includes('API key')) {
          this.error = 'Google Maps API key not configured properly.'
        } else if (error.message.includes('quota') || error.message.includes('billing')) {
          this.error = 'Google Maps API quota exceeded or billing not enabled.'
        } else if (error.message.includes('referer') || error.message.includes('restriction')) {
          this.error = 'Google Maps API key restricted for this domain.'
        } else {
          this.error = `Failed to load map: ${error.message}`
        }
        
        this.loading = false
      }
    },

    addHomeMarker() {
      if (!this.map) return

      // Create home pin with custom styling
      const homePin = new google.maps.marker.PinElement({
        background: '#00E5FF', // Your neon blue color
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        glyph: '🏠',
        scale: 1.2
      })

      const homeMarker = new google.maps.marker.AdvancedMarkerElement({
        position: this.homeLocation,
        map: this.map,
        title: this.homeLocation.title,
        content: homePin.element
      })

      // Add info window for home
      const homeInfoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3 style="margin: 0 0 5px 0; color: #00E5FF;">🏠 Home Sweet Home</h3>
            <p style="margin: 0; color: #666;">Rancho Cucamonga, California</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">Where all adventures begin and end!</p>
          </div>
        `
      })

      homeMarker.addListener('click', () => {
        // Close all other info windows
        this.markers.forEach(marker => {
          if (marker.infoWindow) {
            marker.infoWindow.close()
          }
        })
        homeInfoWindow.open(this.map, homeMarker)
      })

      this.markers.push({
        marker: homeMarker,
        infoWindow: homeInfoWindow,
        isHome: true
      })
    },

    updateMapPins() {
      if (!this.map) return

      // Clear existing travel markers (keep home marker)
      this.markers = this.markers.filter(markerObj => {
        if (!markerObj.isHome) {
          markerObj.marker.map = null
          return false
        }
        return true
      })

      // Add travel destination markers
      this.travelDestinations.forEach((destination, index) => {
        this.addTravelMarker(destination, index)
      })

      // Adjust map bounds if there are travel destinations
      if (this.travelDestinations.length > 0) {
        this.fitMapToBounds()
      }
    },

    addTravelMarker(destination, index) {
      if (!destination.lat || !destination.lng) return

      // Create travel pin with custom styling
      const travelPin = new google.maps.marker.PinElement({
        background: '#B388FF', // Your secondary color
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
        glyph: '✈️',
        scale: 1.0
      })

      const travelMarker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: destination.lat, lng: destination.lng },
        map: this.map,
        title: destination.title || destination.location,
        content: travelPin.element
      })

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 250px;">
            <h3 style="margin: 0 0 5px 0; color: #B388FF;">✈️ ${destination.title || destination.location}</h3>
            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px;">${destination.country || ''}</p>
            <p style="margin: 0 0 5px 0; font-size: 13px;">${destination.excerpt || destination.description || ''}</p>
            ${destination.date ? `<p style="margin: 5px 0 0 0; font-size: 12px; color: #999;">Visited: ${destination.date}</p>` : ''}
          </div>
        `
      })

      travelMarker.addListener('click', () => {
        // Close all other info windows
        this.markers.forEach(marker => {
          if (marker.infoWindow) {
            marker.infoWindow.close()
          }
        })
        infoWindow.open(this.map, travelMarker)
      })

      this.markers.push({
        marker: travelMarker,
        infoWindow: infoWindow,
        isHome: false
      })
    },

    fitMapToBounds() {
      if (!this.map || this.markers.length <= 1) return

      const bounds = new google.maps.LatLngBounds()
      
      // Include home location
      bounds.extend(this.homeLocation)
      
      // Include all travel destinations
      this.travelDestinations.forEach(destination => {
        if (destination.lat && destination.lng) {
          bounds.extend({ lat: destination.lat, lng: destination.lng })
        }
      })

      this.map.fitBounds(bounds, { padding: 50 })
    }
  }
}
</script>

<style scoped>
.travel-map {
  position: relative;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.map-container {
  width: 100%;
  border-radius: 12px;
}

.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text-light);
  z-index: 10;
}

.map-error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--text-muted);
  z-index: 10;
}
</style>