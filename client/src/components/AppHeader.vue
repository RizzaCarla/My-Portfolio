<template>
  <v-app-bar color="primary" dark app elevation="4">
    <v-toolbar-title class="font-weight-bold">
      Rizza Marzo
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <!-- Desktop Navigation -->
    <v-toolbar-items v-if="!mobile">
      <v-btn text @click="navigateTo('/')">
        <v-icon left>mdi-home</v-icon>
        Home
      </v-btn>
      <v-btn text @click="navigateTo('/contact')">
        <v-icon left>mdi-email</v-icon>
        Contact
      </v-btn>
      <v-btn text @click="navigateTo('/resume')">
        <v-icon left>mdi-file-document</v-icon>
        Resume
      </v-btn>
      <v-btn text @click="navigateTo('/artwork')">
        <v-icon left>mdi-palette</v-icon>
        Artwork
      </v-btn>
      <v-btn text @click="navigateTo('/travels')">
        <v-icon left>mdi-airplane</v-icon>
        Travels
      </v-btn>
      
      <!-- Admin Button (only shown when authenticated) -->
      <v-btn 
        v-if="authStore.isAuthenticated" 
        text 
        color="warning"
        @click="navigateTo('/admin/dashboard')"
      >
        <v-icon left>mdi-shield-account</v-icon>
        Admin
      </v-btn>
    </v-toolbar-items>

    <!-- Mobile Menu -->
    <v-menu v-if="mobile" bottom left>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      
      <v-list>
        <v-list-item @click="navigateTo('/')">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-list-item @click="navigateTo('/contact')">
          <v-list-item-icon>
            <v-icon>mdi-email</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Contact</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-list-item @click="navigateTo('/resume')">
          <v-list-item-icon>
            <v-icon>mdi-file-document</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Resume</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-list-item @click="navigateTo('/artwork')">
          <v-list-item-icon>
            <v-icon>mdi-palette</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Artwork</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <v-list-item @click="navigateTo('/travels')">
          <v-list-item-icon>
            <v-icon>mdi-airplane</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Travels</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        
        <!-- Admin Menu Item (only shown when authenticated) -->
        <v-list-item 
          v-if="authStore.isAuthenticated" 
          @click="navigateTo('/admin/dashboard')"
        >
          <v-list-item-icon>
            <v-icon color="warning">mdi-shield-account</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Admin</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import { useDisplay } from 'vuetify'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AppHeader',
  setup() {
    const { mobile } = useDisplay()
    const authStore = useAuthStore()
    return { mobile, authStore }
  },
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    }
  }
}
</script>

<style scoped>
.v-toolbar-title {
  font-size: 1.25rem !important;
}

.v-btn {
  margin: 0 4px;
}

.v-btn .v-icon {
  margin-right: 8px;
}
</style>