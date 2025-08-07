<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card elevation="8" class="mx-auto">
          <v-card-title class="text-h4 text-center primary white--text">
            <v-icon left class="mr-3">mdi-email</v-icon>
            Get In Touch
          </v-card-title>
          
          <v-card-text class="pa-8">
            <v-row>
              <v-col cols="12" class="text-center mb-6">
                <p class="text-h6 mb-4">Let's connect and discuss your next project!</p>
                <p class="text-body-1">I'd love to hear from you. Send me a message and I'll respond as soon as possible.</p>
              </v-col>
              
              <!-- Contact Form -->
              <v-col cols="12">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-text-field
                    v-model="form.name"
                    :rules="nameRules"
                    label="Your Name"
                    prepend-icon="mdi-account"
                    outlined
                    required
                    class="mb-2"
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="form.email"
                    :rules="emailRules"
                    label="Email Address"
                    prepend-icon="mdi-email"
                    outlined
                    required
                    class="mb-2"
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="form.subject"
                    label="Subject"
                    prepend-icon="mdi-text-subject"
                    outlined
                    class="mb-2"
                  ></v-text-field>
                  
                  <v-textarea
                    v-model="form.message"
                    :rules="messageRules"
                    label="Message"
                    prepend-icon="mdi-message-text"
                    outlined
                    rows="4"
                    required
                    class="mb-4"
                  ></v-textarea>
                  
                  <v-btn
                    :disabled="!valid || loading"
                    :loading="loading"
                    color="primary"
                    large
                    block
                    @click="submit"
                  >
                    <v-icon left>mdi-send</v-icon>
                    Send Message
                  </v-btn>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Contact Info Cards -->
    <v-row justify="center" class="mt-8">
      <v-col cols="12" sm="6" md="4">
        <v-card class="text-center" elevation="4" height="200">
          <v-card-text class="pa-6">
            <v-icon size="48" color="green" class="mb-4">mdi-phone</v-icon>
            <v-card-title class="text-h6 justify-center">Phone</v-card-title>
            <p class="text-body-1">
              <a href="tel:909-904-9029" class="text-decoration-none">
                909-904-9029
              </a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" sm="6" md="4">
        <v-card class="text-center" elevation="4" height="200">
          <v-card-text class="pa-6">
            <v-icon size="48" color="red" class="mb-4">mdi-email</v-icon>
            <v-card-title class="text-h6 justify-center">Email</v-card-title>
            <p class="text-body-1">
              <a href="mailto:rizzacarla.12@gmail.com" class="text-decoration-none">
                rizzacarla.12@gmail.com
              </a>
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ContactView',
  data() {
    return {
      valid: true,
      loading: false,
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      },
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 2) || 'Name must be at least 2 characters',
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      messageRules: [
        v => !!v || 'Message is required',
        v => (v && v.length >= 10) || 'Message must be at least 10 characters',
      ],
    }
  },
  methods: {
    async submit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        
        // Simulate form submission
        setTimeout(() => {
          this.loading = false
          this.$refs.form.reset()
          
          // Show success message
          this.$nextTick(() => {
            alert('Thank you! Your message has been sent successfully.')
          })
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
.v-card-title {
  word-break: normal;
}

a {
  color: inherit;
  transition: color 0.3s;
}

a:hover {
  color: #1976d2 !important;
}
</style>