<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-4">
          <v-card-title class="text-h4 text-center mb-6 primary--text">
            Are you Rizza? Prove it!
          </v-card-title>
          
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleLogin">
              <v-text-field
                v-model="credentials.username"
                :rules="usernameRules"
                label="Username"
                prepend-icon="mdi-account"
                outlined
                required
                class="mb-4"
                @keyup.enter="handleLogin"
              ></v-text-field>
              
              <v-text-field
                v-model="credentials.password"
                :rules="passwordRules"
                label="Password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                outlined
                required
                class="mb-4"
                @keyup.enter="handleLogin"
              ></v-text-field>
              
              <v-alert
                v-if="errorMessage"
                type="error"
                class="mb-4"
                dense
              >
                {{ errorMessage }}
              </v-alert>
              
              <v-alert
                v-if="successMessage"
                type="success"
                class="mb-4"
                dense
              >
                {{ successMessage }}
              </v-alert>
              
              <v-btn
                :disabled="!valid || loading"
                :loading="loading"
                color="primary"
                large
                block
                @click="handleLogin"
                class="mb-4"
              >
                <v-icon left>mdi-login</v-icon>
                Login
              </v-btn>
            </v-form>
          </v-card-text>
          
          <v-divider class="mb-4"></v-divider>
          
          <v-card-text class="text-center">
            <v-chip color="info" outlined class="mb-2">
              <v-icon left small>mdi-information</v-icon>
              Admin Access Only
            </v-chip>
            <p class="text-caption grey--text">
              This login is for portfolio administration only.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  name: 'AdminLogin',
  data() {
    return {
      valid: false,
      loading: false,
      showPassword: false,
      errorMessage: '',
      successMessage: '',
      credentials: {
        username: '',
        password: ''
      },
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length >= 3) || 'Username must be at least 3 characters'
      ],
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 6) || 'Password must be at least 6 characters'
      ]
    }
  },
  
  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },
  
  mounted() {
    // If already logged in, redirect to dashboard
    if (this.authStore.isAuthenticated) {
      this.$router.push('/admin/dashboard')
    }
  },
  
  methods: {
    async handleLogin() {
      if (!this.$refs.form.validate()) {
        return
      }
      
      this.loading = true
      this.errorMessage = ''
      this.successMessage = ''
      
      try {
        const result = await this.authStore.login(
          this.credentials.username, 
          this.credentials.password
        )
        
        if (result.success) {
          this.successMessage = result.message
          setTimeout(() => {
            this.$router.push('/admin/dashboard')
          }, 1000)
        } else {
          this.errorMessage = result.message
        }
      } catch (error) {
        this.errorMessage = 'An error occurred during login'
      }
      
      this.loading = false
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}

.v-card {
  border-radius: 16px;
}
</style>