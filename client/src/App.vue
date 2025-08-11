<script>
import { RouterView } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import TravelingBanner from "./components/TravelingBanner.vue";
import starryBackground from "./assets/images/starry-night.png";

export default {
  name: "App",
  components: {
    RouterView,
    AppHeader,
    TravelingBanner,
  },
  computed: {
    // This can be used to dynamically set the background image if needed
    starryBackgroundUrl() {
      return starryBackground;
    },
    isHomePage() {
      return this.$route.path === '/'
    }
  },
};
</script>

<template>
  <v-app class="app" :class="{ 'has-header': !isHomePage }">
    <!-- Header -->
    <AppHeader />

    <!-- Travel Banner (show on all pages except home) -->
    <TravelingBanner v-if="!isHomePage" />

    <!-- Main Content -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
.app {
  min-height: 100vh;
  font-family: "Poppins", sans-serif !important;
  position: relative;
  background-image: v-bind("'url(' + starryBackgroundUrl + ')'");
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

/* Base body styling - clean slate */
body {
  margin: 0;
  padding: 0;
}

/* Dark overlay for readability */
.app::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
  pointer-events: none;
}

.v-main {
  background: transparent !important;
  position: relative;
  z-index: 2;
}

/* Add top padding only when header is visible (not on home page) */
.app.has-header .v-main {
  padding-top: 80px;
}

/* Essential Vuetify overrides only */
.v-application {
  font-family: "Poppins", sans-serif !important;
  background: transparent !important;
  color: var(--text-light) !important;
}

/* Keep cards dark themed for readability over starry background */
.v-card {
  background: rgba(32, 32, 32, 0.9) !important;
  color: var(--text-light) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Button styling for primary actions */
.v-btn--variant-elevated.v-btn--color-primary {
  background: var(--primary) !important;
  color: #000 !important;
}

/* Global text styling */
h1, h2, h3, h4, h5, h6 {
  color: var(--text-light) !important;
  font-family: "Poppins", sans-serif !important;
}
</style>
