<template>
  <header class="modern-header" v-if="!isHomePage">
    <div class="header-container">
      <!-- Logo/Name -->
      <div class="logo">
        <span class="logo-text" @click="navigateTo('/')">Rizza Marzo</span>
      </div>

      <!-- Desktop Navigation -->
      <nav class="nav-menu" v-if="!mobile">
        <a href="#" @click.prevent="navigateTo('/artwork')" class="nav-link">Artworks</a>
        <a href="#" @click.prevent="navigateTo('/travels')" class="nav-link">Travels</a>
        <a href="#" @click.prevent="navigateTo('/resume')" class="nav-link">Projects</a>
        
        <!-- Admin Link (only shown when authenticated) -->
        <a 
          v-if="authStore.isAuthenticated" 
          href="#" 
          @click.prevent="navigateTo('/admin/dashboard')" 
          class="nav-link admin-link"
        >
          Admin
        </a>
        
        <!-- Contact Button -->
        <button class="contact-btn" @click="navigateTo('/contact')">
          Contact
        </button>
      </nav>

      <!-- Mobile Menu -->
      <div v-if="mobile" class="mobile-menu">
        <button class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
        
        <!-- Mobile Menu Overlay -->
        <div v-if="showMobileMenu" class="mobile-overlay" @click="showMobileMenu = false">
          <div class="mobile-nav">
            <a href="#" @click.prevent="navigateAndClose('/artwork')" class="mobile-nav-link">Artworks</a>
            <a href="#" @click.prevent="navigateAndClose('/travels')" class="mobile-nav-link">Travels</a>
            <a href="#" @click.prevent="navigateAndClose('/resume')" class="mobile-nav-link">Projects</a>
            <a 
              v-if="authStore.isAuthenticated" 
              href="#" 
              @click.prevent="navigateAndClose('/admin/dashboard')" 
              class="mobile-nav-link"
            >
              Admin
            </a>
            <button class="contact-btn mobile-contact-btn" @click="navigateAndClose('/contact')">
              Contact
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { useDisplay } from 'vuetify'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AppHeader',
  data() {
    return {
      showMobileMenu: false
    }
  },
  setup() {
    const { mobile } = useDisplay()
    const authStore = useAuthStore()
    return { mobile, authStore }
  },
  
  computed: {
    isHomePage() {
      return this.$route.path === '/'
    }
  },
  methods: {
    navigateTo(path) {
      if (this.$route.path !== path) {
        this.$router.push(path)
      }
    },
    navigateAndClose(path) {
      this.showMobileMenu = false
      this.navigateTo(path)
    }
  }
}
</script>

<style scoped>
.modern-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1rem 0;
  font-family: 'Poppins', sans-serif;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.logo-text {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  cursor: pointer;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 400;
  font-size: 1rem;
  transition: color 0.3s ease;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--primary);
}

.admin-link {
  color: var(--warning) !important;
}

/* Contact Button */
.contact-btn {
  background: var(--primary);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 229, 255, 0.3);
}

/* Mobile Menu */
.mobile-menu {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.hamburger-line {
  width: 20px;
  height: 2px;
  background: var(--text-light);
  transition: all 0.3s ease;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  padding: 1rem;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
  width: 100%;
  max-width: 300px;
}

.mobile-nav-link {
  color: var(--text-light);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  transition: color 0.3s ease;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
}

.mobile-nav-link:hover {
  color: var(--primary);
  background: rgba(0, 229, 255, 0.1);
  border-color: var(--primary);
}

.mobile-contact-btn {
  margin-top: 0.5rem;
  align-self: center;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }
  
  .logo-text {
    font-size: 1.3rem;
  }
}

/* Add padding to body to compensate for fixed header - only when header is visible */
</style>