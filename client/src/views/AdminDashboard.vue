<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon left color="primary">mdi-view-dashboard</v-icon>
            Admin Dashboard
            <v-spacer></v-spacer>
            <v-chip color="success" outlined>
              <v-icon left small>mdi-check-circle</v-icon>
              Logged in as {{ authStore.user?.name }}
            </v-chip>
          </v-card-title>
          <v-card-subtitle>
            Manage your portfolio content and settings
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- Content Management Cards -->
      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" class="content-card">
          <v-card-title class="d-flex align-center">
            <v-icon left color="purple">mdi-palette</v-icon>
            Artwork
          </v-card-title>
          <v-card-text>
            <p>Upload and manage your artwork portfolio</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="48" color="purple">mdi-image-multiple</v-icon>
              <p class="mt-2 text-caption">Manage gallery items</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="purple" block @click="goToArtworkManagement">
              <v-icon left>mdi-pencil</v-icon>
              Manage Artwork
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" class="content-card">
          <v-card-title class="d-flex align-center">
            <v-icon left color="green">mdi-airplane</v-icon>
            Travel Stories
          </v-card-title>
          <v-card-text>
            <p>Create and edit your travel blog posts</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="48" color="green">mdi-map-marker-multiple</v-icon>
              <p class="mt-2 text-caption">Share your adventures</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" block @click="goToTravelManagement">
              <v-icon left>mdi-pencil</v-icon>
              Manage Travels
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>


      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" class="content-card">
          <v-card-title class="d-flex align-center">
            <v-icon left color="orange">mdi-file-document</v-icon>
            Resume
          </v-card-title>
          <v-card-text>
            <p>Update your professional resume and skills</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="48" color="orange">mdi-account-tie</v-icon>
              <p class="mt-2 text-caption">Professional info</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="orange" block @click="goToResumeManagement">
              <v-icon left>mdi-pencil</v-icon>
              Edit Resume
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" class="content-card">
          <v-card-title class="d-flex align-center">
            <v-icon left color="teal">mdi-email</v-icon>
            Contact Info
          </v-card-title>
          <v-card-text>
            <p>Update contact information and social links</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="48" color="teal">mdi-account-details</v-icon>
              <p class="mt-2 text-caption">Contact details</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="teal" block @click="goToContactManagement">
              <v-icon left>mdi-pencil</v-icon>
              Edit Contact
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" lg="4">
        <v-card elevation="2" class="content-card">
          <v-card-title class="d-flex align-center">
            <v-icon left color="red">mdi-cog</v-icon>
            Settings
          </v-card-title>
          <v-card-text>
            <p>Manage site settings and preferences</p>
            <v-divider class="my-3"></v-divider>
            <div class="text-center">
              <v-icon size="48" color="red">mdi-settings</v-icon>
              <p class="mt-2 text-caption">Site configuration</p>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" block @click="goToSettings">
              <v-icon left>mdi-cog</v-icon>
              Settings
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Actions -->
    <v-row class="mt-4">
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon left>mdi-flash</v-icon>
            Quick Actions
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="success" block class="mb-2">
                  <v-icon left>mdi-plus</v-icon>
                  New Artwork
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="info" block class="mb-2">
                  <v-icon left>mdi-plus</v-icon>
                  New Travel Story
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-btn color="error" outlined block class="mb-2" @click="logout">
                  <v-icon left>mdi-logout</v-icon>
                  Logout
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AdminDashboard',
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  
  mounted() {
    // Redirect if not authenticated
    if (!this.authStore.isAuthenticated) {
      this.$router.push('/admin/login')
    }
  },
  
  methods: {
    goToArtworkManagement() {
      this.$router.push('/admin/artwork')
    },
    
    goToTravelManagement() {
      this.$router.push('/admin/travels')
    },
    
    
    goToResumeManagement() {
      this.$router.push('/admin/resume')
    },
    
    goToContactManagement() {
      this.$router.push('/admin/contact')
    },
    
    goToSettings() {
      this.$router.push('/admin/settings')
    },
    
    logout() {
      this.authStore.logout()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.content-card {
  height: 280px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.content-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.v-card-title {
  font-weight: 600;
}

.v-btn {
  font-weight: 500;
}
</style>