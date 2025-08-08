<template>
  <div class="homepage">
    <section class="home-section">
      <v-container>
        <v-row align="center" class="full-height-home">
          <v-col cols="12" md="6">
            <h1 class="home-greeting" :class="{ 'typing': !greetingComplete }">{{ displayedGreeting }}</h1>
            <h1 class="home-name" :class="{ 'typing': !nameComplete && greetingComplete }">{{ displayedName }}</h1>
            <p class="home-title">Explore my latest creations</p>
            
            <!-- Latest Content Preview -->
            <div class="latest-content mt-8">
              <v-row>
                <!-- Latest Artwork -->
                <v-col cols="4">
                  <div class="content-card" @click="goToArtwork">
                    <div class="content-image" :style="{ backgroundImage: `url(${latestArtwork.image})` }">
                      <div class="content-overlay">
                        <div class="content-label">Latest Artwork</div>
                        <div class="content-title">{{ latestArtwork.title }}</div>
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Latest Travel -->
                <v-col cols="4">
                  <div class="content-card" @click="goToTravels">
                    <div class="content-image" :style="{ backgroundImage: `url(${latestTravel.image})` }">
                      <div class="content-overlay">
                        <div class="content-label">Latest Travel</div>
                        <div class="content-title">{{ latestTravel.title }}</div>
                      </div>
                    </div>
                  </div>
                </v-col>

                <!-- Latest Project -->
                <v-col cols="4">
                  <div class="content-card" @click="goToResume">
                    <div class="content-image" :style="{ backgroundImage: `url(${latestProject.image})` }">
                      <div class="content-overlay">
                        <div class="content-label">Latest Project</div>
                        <div class="content-title">{{ latestProject.title }}</div>
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>

        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      // Typing animation data
      greetingText: "Hi, I'm",
      nameText: "Rizza Marzo",
      displayedGreeting: "",
      displayedName: "",
      greetingComplete: false,
      nameComplete: false,
      typingSpeed: 100, // milliseconds per character
      
      latestArtwork: {
        title: 'Digital Dreams',
        image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=400&fit=crop',
        date: '2024-01-15'
      },
      latestTravel: {
        title: 'Tokyo Adventures',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=400&fit=crop',
        date: '2024-01-10'
      },
      latestProject: {
        title: 'Portfolio Website',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
        date: '2024-01-08'
      },
      skills: [
        { name: 'Digital Art', percentage: 90 },
        { name: 'Photography', percentage: 85 },
        { name: 'Travel Writing', percentage: 80 }
      ]
    }
  },
  
  mounted() {
    this.startTypingAnimation()
  },
  
  methods: {
    startTypingAnimation() {
      this.typeGreeting()
    },
    
    typeGreeting() {
      let i = 0
      const typeChar = () => {
        if (i < this.greetingText.length) {
          this.displayedGreeting += this.greetingText.charAt(i)
          i++
          setTimeout(typeChar, this.typingSpeed)
        } else {
          this.greetingComplete = true
          // Wait a moment, then start typing the name
          setTimeout(() => {
            this.typeName()
          }, 300)
        }
      }
      typeChar()
    },
    
    typeName() {
      let i = 0
      const typeChar = () => {
        if (i < this.nameText.length) {
          this.displayedName += this.nameText.charAt(i)
          i++
          setTimeout(typeChar, this.typingSpeed)
        } else {
          this.nameComplete = true
        }
      }
      typeChar()
    },
    
    goToArtwork() {
      this.$router.push('/artwork')
    },
    goToTravels() {
      this.$router.push('/travels')
    },
    goToResume() {
      this.$router.push('/resume')
    }
  }
}
</script>

<style scoped>
.homepage {
  background: var(--bg-dark);
  color: var(--text-light);
  font-family: 'Poppins', sans-serif;
}

.home-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.full-height-home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.min-vh-100 {
  min-height: 100vh;
}

.home-greeting {
  font-size: 3.5rem;
  font-weight: 400;
  color: var(--text-light);
  margin-bottom: 0;
  line-height: 1.1;
  position: relative;
}

.home-greeting.typing::after {
  content: '|';
  color: var(--primary);
  animation: blink 1s infinite;
  margin-left: 2px;
}

.home-name {
  font-size: 4rem;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 1rem;
  line-height: 1.1;
  position: relative;
}

.home-name.typing::after {
  content: '|';
  color: var(--primary);
  animation: blink 1s infinite;
  margin-left: 2px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.home-title {
  font-size: 1.5rem;
  color: var(--primary);
  font-weight: 500;
  margin-bottom: 2rem;
}

/* Latest Content Preview */
.latest-content {
  margin-top: 3rem;
}

.content-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.content-card:hover {
  transform: translateY(-5px);
}

.content-image {
  aspect-ratio: 1;
  background-size: cover;
  background-position: center;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.content-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 1rem;
  color: white;
}

.content-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.content-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0;
}

/* Section Spacing */
.section-spacing {
  padding: 6rem 0;
}

.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: var(--text-light);
  margin-bottom: 3rem;
}

/* Project Cards */
.project-card {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.project-image {
  width: 200px;
  height: 150px;
  border-radius: 12px;
  flex-shrink: 0;
}

.geometric-art {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.project-content {
  flex: 1;
}

.project-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.project-description {
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.view-project-btn {
  color: var(--primary) !important;
  text-transform: none;
  font-weight: 500;
}

/* Travels Section */
.travels-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.world-map {
  position: relative;
  width: 200px;
  height: 100px;
  background: rgba(0, 229, 255, 0.1);
  border-radius: 12px;
}

.travel-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--primary);
}

.travel-project-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Skills Section */
.skill-card {
  text-align: center;
  padding: 1rem;
}

.skill-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  background: rgba(0, 229, 255, 0.1);
}

.skill-percentage {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary);
}

.skill-name {
  font-weight: 500;
  color: var(--text-light);
}

/* Resume Section */
.resume-btn {
  background: transparent !important;
  border: 2px solid var(--primary) !important;
  color: var(--primary) !important;
  padding: 1rem 2rem !important;
  text-transform: none !important;
  font-weight: 500 !important;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .home-greeting {
    font-size: 2.5rem;
  }
  
  .home-name {
    font-size: 3rem;
  }
  
  .home-title {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .project-card {
    flex-direction: column;
    text-align: center;
  }
  
  .travels-header {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
