import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    // Simple admin credentials - in production this would be handled server-side
    adminCredentials: {
      username: 'rizza',
      password: 'admin2024!' // You can change this password
    }
  }),
  
  getters: {
    isAdmin: (state) => state.isAuthenticated && state.user?.role === 'admin'
  },
  
  actions: {
    async login(username, password) {
      // Simple client-side authentication - for demo purposes
      // In production, this would make an API call to your backend
      if (username === this.adminCredentials.username && 
          password === this.adminCredentials.password) {
        
        this.isAuthenticated = true
        this.user = {
          id: 1,
          username: 'rizza',
          name: 'Rizza Marzo',
          role: 'admin'
        }
        
        // Store auth state in localStorage for persistence
        localStorage.setItem('portfolio_auth', JSON.stringify({
          isAuthenticated: true,
          user: this.user
        }))
        
        return { success: true, message: 'Login successful!' }
      } else {
        return { success: false, message: 'Invalid credentials' }
      }
    },
    
    logout() {
      this.isAuthenticated = false
      this.user = null
      localStorage.removeItem('portfolio_auth')
    },
    
    // Check if user is already logged in (on app startup)
    checkAuth() {
      const stored = localStorage.getItem('portfolio_auth')
      if (stored) {
        try {
          const authData = JSON.parse(stored)
          if (authData.isAuthenticated && authData.user) {
            this.isAuthenticated = true
            this.user = authData.user
          }
        } catch (e) {
          // Invalid stored data, clear it
          localStorage.removeItem('portfolio_auth')
        }
      }
    }
  }
})