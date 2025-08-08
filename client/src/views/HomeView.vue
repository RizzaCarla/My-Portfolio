<template>
  <div class="homepage">
    <section class="home-section">
      <v-container>
        <v-row align="center" class="full-height-home">
          <v-col cols="12" sm="10" md="11" lg="10" xl="8">
            <h1 class="home-greeting" :class="{ 'typing': !greetingComplete }">{{ displayedGreeting }}</h1>
            <h1 class="home-name" :class="{ 'typing': !nameComplete && greetingComplete }">{{ displayedName }}</h1>
            <p class="home-title"><span class="sparkling-star secret-login" @click="goToLogin">✨&nbsp;</span> Explore my latest creations <span class="sparkling-star sparkling-star-delayed">✨</span></p>
            
            <!-- Latest Content Preview -->
            <div class="latest-content mt-8">
              <v-row>
                <!-- Latest Artwork -->
                <v-col cols="4">
                  <div class="content-card scroll-animate" @click="goToArtwork" ref="artworkCard">
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
                  <div class="content-card scroll-animate" @click="goToTravels" ref="travelCard">
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
                  <div class="content-card scroll-animate" @click="goToResume" ref="projectCard">
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
// Constants for better maintainability
const TYPING_SPEED = 100
const MOBILE_BREAKPOINT = 768
const SECRET_CLICK_THRESHOLD = 3
const ANIMATION_DELAYS = {
  NAME_START: 300,
  FIRST_CARD: 500,
  CARD_STAGGER: 200
}

export default {
  name: 'HomeView',
  
  data() {
    return {
      // Typing animation state
      typingState: {
        greetingText: "Hi, I'm",
        nameText: "Rizza Marzo",
        displayedGreeting: "",
        displayedName: "",
        greetingComplete: false,
        nameComplete: false,
        finished: false
      },
      
      // Secret login functionality
      secretClickCount: 0,
      
      // Content data (TODO: Move to API/store)
      content: {
        artwork: {
          title: 'Digital Dreams',
          image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=400&fit=crop',
          date: '2024-01-15'
        },
        travel: {
          title: 'Tokyo Adventures',
          image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=400&fit=crop',
          date: '2024-01-10'
        },
        project: {
          title: 'Portfolio Website',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=400&fit=crop',
          date: '2024-01-08'
        }
      }
    }
  },
  
  computed: {
    // Computed properties for better template readability
    latestArtwork() {
      return this.content.artwork
    },
    
    latestTravel() {
      return this.content.travel
    },
    
    latestProject() {
      return this.content.project
    },
    
    displayedGreeting() {
      return this.typingState.displayedGreeting
    },
    
    displayedName() {
      return this.typingState.displayedName
    },
    
    greetingComplete() {
      return this.typingState.greetingComplete
    },
    
    nameComplete() {
      return this.typingState.nameComplete
    },
    
    isMobile() {
      return window.innerWidth <= MOBILE_BREAKPOINT
    }
  },
  
  mounted() {
    this.initializeAnimations()
  },
  
  beforeUnmount() {
    // Clean up intersection observer if it exists
    if (this.scrollObserver) {
      this.scrollObserver.disconnect()
    }
  },
  
  methods: {
    // Initialization
    initializeAnimations() {
      this.startTypingAnimation()
      this.setupScrollAnimation()
    },
    
    // Typing Animation Methods
    startTypingAnimation() {
      this.typeText('greeting')
    },
    
    typeText(type) {
      const isGreeting = type === 'greeting'
      const text = isGreeting ? this.typingState.greetingText : this.typingState.nameText
      const displayKey = isGreeting ? 'displayedGreeting' : 'displayedName'
      const completeKey = isGreeting ? 'greetingComplete' : 'nameComplete'
      
      let i = 0
      const typeChar = () => {
        if (i < text.length) {
          this.typingState[displayKey] += text.charAt(i)
          i++
          setTimeout(typeChar, TYPING_SPEED)
        } else {
          this.typingState[completeKey] = true
          this.handleTypingComplete(isGreeting)
        }
      }
      typeChar()
    },
    
    handleTypingComplete(wasGreeting) {
      if (wasGreeting) {
        // Start name typing after greeting completes
        setTimeout(() => {
          this.typeText('name')
        }, ANIMATION_DELAYS.NAME_START)
      } else {
        // All typing is finished
        this.typingState.finished = true
        this.triggerFirstCardAnimation()
      }
    },
    
    triggerFirstCardAnimation() {
      if (this.isMobile && this.$refs.artworkCard) {
        setTimeout(() => {
          this.$refs.artworkCard.classList.add('animate-in')
        }, ANIMATION_DELAYS.FIRST_CARD)
      }
    },
    
    // Navigation Methods
    goToArtwork() {
      this.navigateTo('/artwork')
    },
    
    goToTravels() {
      this.navigateTo('/travels')
    },
    
    goToResume() {
      this.navigateTo('/resume')
    },
    
    navigateTo(path) {
      this.$router.push(path)
    },
    
    // Secret Login Functionality
    goToLogin() {
      this.secretClickCount++
      if (this.secretClickCount >= SECRET_CLICK_THRESHOLD) {
        this.navigateTo('/admin/login')
        this.secretClickCount = 0
      }
    },
    
    // Scroll Animation Setup
    setupScrollAnimation() {
      if (!this.isMobile) return
      
      this.scrollObserver = new IntersectionObserver(
        this.handleIntersection,
        {
          threshold: 0.2,
          rootMargin: '0px 0px -50px 0px'
        }
      )
      
      this.observeCards()
    },
    
    handleIntersection(entries) {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          this.animateCardOnScroll(entry.target, index)
        }
      })
    },
    
    animateCardOnScroll(target, index) {
      // First card only animates after typing is finished
      if (target === this.$refs.artworkCard && !this.typingState.finished) {
        return
      }
      
      target.classList.add('animate-in')
      
      // Apply stagger delay (skip first card as it's handled by typing)
      if (target !== this.$refs.artworkCard) {
        target.style.animationDelay = `${index * ANIMATION_DELAYS.CARD_STAGGER}ms`
      }
    },
    
    observeCards() {
      const cards = [this.$refs.artworkCard, this.$refs.travelCard, this.$refs.projectCard]
      cards.forEach(card => {
        if (card && this.scrollObserver) {
          this.scrollObserver.observe(card)
        }
      })
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

@media (min-width: 600px) {
  .home-section .v-container {
    max-width: 95%;
  }
}

.v-col {
  transition: all 0.3s ease;
}

/* Mobile scroll animations */
@media (max-width: 768px) {
  .scroll-animate {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  
  .scroll-animate.animate-in {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  
  /* Cool bounce effect */
  .animate-in .content-image {
    animation: bounceIn 1s ease-out forwards;
  }
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3) rotate(-10deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.05) rotate(2deg);
  }
  70% {
    transform: scale(0.9) rotate(-1deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.full-height-home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
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

.sparkling-star {
  display: inline-block;
  animation: sparkle 3s ease-in-out infinite;
  margin-left: 0.5rem;
}

.sparkling-star-delayed {
  animation-delay: 1.5s;
}

.secret-login {
  cursor: pointer;
}

@keyframes sparkle {
  0%, 100% { 
    transform: scale(1);
    opacity: 0.8;
  }
  25% { 
    transform: scale(1.2);
    opacity: 1;
  }
  50% { 
    transform: scale(0.8);
    opacity: 0.6;
  }
  75% { 
    transform: scale(1.1);
    opacity: 1;
  }
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

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .full-height-home {
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .home-greeting {
    font-size: 2.5rem;
  }
  
  .home-name {
    font-size: 3rem;
  }
  
  .home-title {
    font-size: 1.2rem;
  }
  
  .latest-content .v-row {
    flex-direction: column;
  }
  
  .latest-content .v-col {
    max-width: 100% !important;
    flex-basis: auto !important;
  }
  
}
</style>
