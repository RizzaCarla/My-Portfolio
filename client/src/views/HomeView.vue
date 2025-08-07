<template>
  <v-container fluid>
    <v-row>
      <!-- Welcome Section -->
      <v-col cols="12">
        <v-card class="mb-4" elevation="2">
          <v-card-title class="text-h4 text-center">
            Welcome to Rizza Marzo's Portfolio
          </v-card-title>
          <v-card-text class="text-center">
            <p class="text-h6 mb-4">Artist • Traveler • Creator</p>
            <v-avatar size="120" class="mb-4">
              <v-icon size="80">mdi-account-circle</v-icon>
            </v-avatar>
            <p>Explore my artwork, travel adventures, and creative journey.</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Artwork Section -->
      <v-col cols="12" md="4">
        <v-card height="300" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-palette</v-icon>
            My Artwork
          </v-card-title>
          <v-card-text>
            <p>Discover my latest artistic creations and visual expressions.</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="60" color="primary">mdi-image-multiple</v-icon>
              <p class="mt-2 text-caption">{{ artworkCount }} pieces available</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="goToArtwork">
              View Gallery
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Travel Blogs Section -->
      <v-col cols="12" md="4">
        <v-card height="300" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-airplane</v-icon>
            Travel Blogs
          </v-card-title>
          <v-card-text>
            <p>Read about my adventures around the world and travel experiences.</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="60" color="success">mdi-map-marker-multiple</v-icon>
              <p class="mt-2 text-caption">{{ blogCount }} stories shared</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" block @click="goToBlogs">
              Read Stories
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Personal Info Section -->
      <v-col cols="12" md="4">
        <v-card height="300" elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon class="mr-2">mdi-account</v-icon>
            About Me
          </v-card-title>
          <v-card-text>
            <p>Learn more about my background, skills, and creative process.</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="60" color="info">mdi-information</v-icon>
              <p class="mt-2 text-caption">Professional artist & traveler</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="info" block @click="goToAbout">
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      artworkCount: 12,
      blogCount: 8,
    }
  },
  methods: {
    goToArtwork() {
      this.$router.push('/artwork')
    },
    goToBlogs() {
      this.$router.push('/blogs')
    },
    goToAbout() {
      this.$router.push('/about')
    }
  },
}
</script>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
