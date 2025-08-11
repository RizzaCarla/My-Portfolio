import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null,
    token: null,
    sessionTimeout: null
  }),
  
  getters: {
    isAdmin: (state) => state.isAuthenticated && state.user?.role === 'admin'
  },
  
  actions: {
    async login(username, password) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
          return { success: false, message: data.message };
        }

        // Store authentication data
        this.isAuthenticated = true;
        this.user = data.user;
        this.token = data.token;

        // Store in localStorage
        localStorage.setItem('portfolio_auth', JSON.stringify({
          isAuthenticated: true,
          user: data.user,
          token: data.token
        }));

        // Start token expiration check
        this.startTokenCheck();

        return { success: true, message: data.message };

      } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Network error. Please try again.' };
      }
    },
    
    async logout() {
      try {
        // Call logout API if token exists
        if (this.token) {
          await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.token}`,
              'Content-Type': 'application/json'
            }
          });
        }
      } catch (error) {
        console.error('Logout API error:', error);
      } finally {
        // Clear local state regardless of API call result
        this.isAuthenticated = false;
        this.user = null;
        this.token = null;
        this.clearSessionTimeout();
        localStorage.removeItem('portfolio_auth');
      }
    },
    
    // Check if user is already logged in (on app startup)
    async checkAuth() {
      const stored = localStorage.getItem('portfolio_auth');
      if (stored) {
        try {
          const authData = JSON.parse(stored);
          
          if (authData.token && authData.user) {
            // Verify token with server
            const isValid = await this.verifyToken(authData.token);
            
            if (isValid) {
              this.isAuthenticated = true;
              this.user = authData.user;
              this.token = authData.token;
              this.startTokenCheck();
              return { success: true };
            } else {
              // Token invalid, clear auth
              this.logout();
              return { expired: true, message: 'Your session has expired. Please login again.' };
            }
          }
        } catch (e) {
          // Invalid stored data, clear it
          localStorage.removeItem('portfolio_auth');
        }
      }
      return { success: false };
    },

    // Verify token with server
    async verifyToken(token) {
      try {
        const response = await fetch('/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        return response.ok;
      } catch (error) {
        console.error('Token verification error:', error);
        return false;
      }
    },

    // Start periodic token check (every 5 minutes)
    startTokenCheck() {
      this.clearSessionTimeout();
      
      this.sessionTimeout = setInterval(async () => {
        if (this.token) {
          const isValid = await this.verifyToken(this.token);
          if (!isValid) {
            console.log('Token expired, logging out...');
            await this.logout();
          }
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    },

    // Clear token check interval
    clearSessionTimeout() {
      if (this.sessionTimeout) {
        clearInterval(this.sessionTimeout);
        this.sessionTimeout = null;
      }
    },

    // Get authorization header for API calls
    getAuthHeader() {
      return this.token ? { 'Authorization': `Bearer ${this.token}` } : {};
    }
  }
})