<script>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',
  components: {
    RouterView,
    AppHeader
  }
}
</script>

<template>
  <v-app>
    <!-- Header -->
    <AppHeader />
    
    <!-- Main Content -->
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style>
</style>
