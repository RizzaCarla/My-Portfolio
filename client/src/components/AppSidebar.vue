<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    width="320"
    :mini-variant="!drawer && !mobile"
    :temporary="mobile"
    :permanent="!mobile"
    color="grey lighten-5"
    class="elevation-3"
    expand-on-hover
  >
    <!-- Mini Header Section -->
    <template v-if="!drawer && !mobile">
      <v-list-item class="px-2 py-4" style="background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);">
        <v-list-item-avatar size="40" class="mx-auto">
          <v-img
            src="https://via.placeholder.com/40x40/1976d2/ffffff?text=RM"
            alt="Rizza Marzo"
            class="elevation-2"
            style="border: 2px solid white;"
          />
        </v-list-item-avatar>
      </v-list-item>
    </template>

    <!-- Full Header Section -->
    <template v-else>
      <v-list-item class="px-6 py-4" style="background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);">
        <v-list-item-avatar size="80" class="mx-auto">
          <v-img
            src="https://via.placeholder.com/80x80/1976d2/ffffff?text=RM"
            alt="Rizza Marzo"
            class="elevation-4"
            style="border: 3px solid white;"
          />
        </v-list-item-avatar>
      </v-list-item>
      
      <v-list-item class="px-6 pb-4" style="background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);">
        <v-list-item-content class="text-center">
          <v-list-item-title class="white--text font-weight-bold text-h6">
            Rizza Marzo
          </v-list-item-title>
          <v-list-item-subtitle class="white--text">
            Full Stack Developer & Artist
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <!-- Mini sidebar icons -->
    <v-list v-if="!drawer && !mobile" dense class="py-2">
      <v-list-item @click="callPhone" class="justify-center">
        <v-list-item-icon class="mr-0">
          <v-icon color="green">mdi-phone</v-icon>
        </v-list-item-icon>
      </v-list-item>
      
      <v-list-item @click="sendEmail" class="justify-center">
        <v-list-item-icon class="mr-0">
          <v-icon color="red">mdi-email</v-icon>
        </v-list-item-icon>
      </v-list-item>
      
      <v-list-item @click="expandSidebar" class="justify-center">
        <v-list-item-icon class="mr-0">
          <v-icon color="primary">mdi-chevron-right</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>

    <!-- Contact Information -->
    <v-list dense class="py-0" v-if="drawer || mobile">
      <v-subheader class="font-weight-bold text-uppercase">
        <v-icon left color="primary">mdi-account-circle</v-icon>
        Contact Info
      </v-subheader>
      
      <v-list-item class="px-6">
        <v-list-item-icon>
          <v-icon color="green">mdi-phone</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">Phone</v-list-item-title>
          <v-list-item-subtitle>
            <a href="tel:909-904-9029" class="text-decoration-none">
              909-904-9029
            </a>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon small @click="callPhone">
            <v-icon small>mdi-phone</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      
      <v-list-item class="px-6">
        <v-list-item-icon>
          <v-icon color="red">mdi-email</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">Email</v-list-item-title>
          <v-list-item-subtitle>
            <a href="mailto:rizzacarla.12@gmail.com" class="text-decoration-none">
              rizzacarla.12@gmail.com
            </a>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon small @click="sendEmail">
            <v-icon small>mdi-email</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>

    <v-divider class="my-3" v-if="drawer || mobile"></v-divider>

    <!-- Technical Skills -->
    <v-list dense class="py-0" v-if="drawer || mobile">
      <v-subheader class="font-weight-bold text-uppercase">
        <v-icon left color="primary">mdi-code-tags</v-icon>
        Technical Skills
      </v-subheader>
      
      <v-list-item class="px-6">
        <v-list-item-content>
          <div class="d-flex flex-wrap">
            <v-chip
              v-for="skill in skills"
              :key="skill.name"
              :color="skill.color"
              small
              class="ma-1"
              outlined
            >
              <v-icon left small>{{ skill.icon }}</v-icon>
              {{ skill.name }}
            </v-chip>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider class="my-3" v-if="drawer || mobile"></v-divider>

    <!-- Quick Actions -->
    <v-list dense v-if="drawer || mobile">
      <v-subheader class="font-weight-bold text-uppercase">
        <v-icon left color="primary">mdi-lightning-bolt</v-icon>
        Quick Actions
      </v-subheader>
      
      <v-list-item @click="downloadResume" class="px-6">
        <v-list-item-icon>
          <v-icon color="indigo">mdi-download</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Download Resume</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <v-list-item @click="viewPortfolio" class="px-6">
        <v-list-item-icon>
          <v-icon color="purple">mdi-palette</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>View Artwork</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { useDisplay } from 'vuetify'
export default {
  name: 'AppSidebar',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      skills: [
        { name: 'JavaScript', icon: 'mdi-language-javascript', color: 'yellow darken-3' },
        { name: 'Vue.js', icon: 'mdi-vuejs', color: 'green' },
        { name: 'React', icon: 'mdi-react', color: 'blue' },
        { name: 'HTML', icon: 'mdi-language-html5', color: 'orange' },
        { name: 'CSS', icon: 'mdi-language-css3', color: 'blue' },
        { name: 'Angular', icon: 'mdi-angular', color: 'red' }
      ]
    }
  },
  setup() {
    const { mobile } = useDisplay();
    return { mobile };
  },
  computed: {
    drawer: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    callPhone() {
      window.open('tel:909-904-9029')
    },
    sendEmail() {
      window.open('mailto:rizzacarla.12@gmail.com?subject=Portfolio Inquiry')
    },
    downloadResume() {
      // This would link to your actual resume file
      this.$router.push('/resume')
    },
    viewPortfolio() {
      this.$router.push('/artwork')
    },
    minimizeSidebar() {
      this.$emit('input', false)
    },
    expandSidebar() {
      this.$emit('input', true)
    }
  }
}
</script>

<style scoped>
.v-list-item__subtitle a {
  color: inherit !important;
}

.v-list-item__subtitle a:hover {
  color: #1976d2 !important;
}

.v-chip {
  font-size: 11px !important;
}

.v-subheader {
  height: 36px;
  font-size: 12px;
  letter-spacing: 0.5px;
}
</style>