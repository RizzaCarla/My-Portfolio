<template>
  <v-container class="py-8">
    <v-row>
      <v-col cols="12" class="text-center mb-6">
        <h1 class="text-h3 mb-4 primary--text">
          <v-icon left size="48">mdi-airplane</v-icon>
          My Travels
        </h1>
        <p class="text-h6 text--secondary">
          Adventures and experiences from around the world
        </p>
      </v-col>
    </v-row>

    <!-- Travel Map Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card elevation="4">
          <v-card-title>
            <v-icon left>mdi-map</v-icon>
            Places I've Visited
          </v-card-title>
          <v-card-text>
            <div class="map-placeholder">
              <v-icon size="64" color="grey">mdi-map-marker-multiple</v-icon>
              <p class="text-h6 grey--text mt-4">Interactive Map Coming Soon</p>
              <p class="text-body-2 grey--text">
                A beautiful interactive map showing all my travel destinations
              </p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Travel Blog Posts -->
    <v-row>
      <v-col 
        v-for="travel in travels" 
        :key="travel.id"
        cols="12" 
        md="6" 
        lg="4"
      >
        <v-card class="travel-card mb-6" elevation="4" hover>
          <v-img 
            :src="travel.image" 
            :alt="travel.destination"
            height="200"
            cover
          >
            <v-overlay absolute opacity="0" class="travel-overlay">
              <v-btn color="white" @click="readMore(travel)">
                <v-icon left>mdi-book-open</v-icon>
                Read More
              </v-btn>
            </v-overlay>
            
            <!-- Travel Date Chip -->
            <v-chip 
              class="ma-2" 
              color="primary" 
              style="position: absolute; top: 0; right: 0;"
              small
            >
              {{ travel.date }}
            </v-chip>
          </v-img>
          
          <v-card-title class="text-h6">
            <v-icon left color="primary">mdi-map-marker</v-icon>
            {{ travel.destination }}
          </v-card-title>
          
          <v-card-subtitle>{{ travel.country }}</v-card-subtitle>
          
          <v-card-text>
            <p class="text-body-2 mb-3">{{ travel.excerpt }}</p>
            
            <!-- Travel Stats -->
            <v-row dense class="mb-2">
              <v-col cols="4">
                <v-chip x-small color="blue" outlined>
                  <v-icon left x-small>mdi-calendar-clock</v-icon>
                  {{ travel.duration }}
                </v-chip>
              </v-col>
              <v-col cols="4">
                <v-chip x-small color="green" outlined>
                  <v-icon left x-small>mdi-camera</v-icon>
                  {{ travel.photos }}
                </v-chip>
              </v-col>
              <v-col cols="4">
                <v-chip x-small color="orange" outlined>
                  <v-icon left x-small>mdi-star</v-icon>
                  {{ travel.rating }}/5
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-actions>
            <v-btn text color="primary" @click="readMore(travel)">
              <v-icon left>mdi-book-open</v-icon>
              Read Blog
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn icon @click="toggleFavorite(travel.id)">
              <v-icon :color="travel.favorite ? 'red' : 'grey'">
                {{ travel.favorite ? 'mdi-heart' : 'mdi-heart-outline' }}
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Travel Blog Detail Dialog -->
    <v-dialog v-model="blogDialog" max-width="900" scrollable>
      <v-card v-if="selectedTravel">
        <v-card-title class="text-h5 primary white--text">
          <v-icon left color="white">mdi-map-marker</v-icon>
          {{ selectedTravel.destination }}, {{ selectedTravel.country }}
          <v-spacer></v-spacer>
          <v-btn icon color="white" @click="blogDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-img 
          :src="selectedTravel.image" 
          :alt="selectedTravel.destination"
          height="300"
          cover
        ></v-img>
        
        <v-card-text class="pa-6">
          <v-row class="mb-4">
            <v-col cols="12" md="8">
              <v-chip class="mr-2 mb-2" color="primary" outlined>
                <v-icon left>mdi-calendar</v-icon>
                {{ selectedTravel.date }}
              </v-chip>
              <v-chip class="mr-2 mb-2" color="blue" outlined>
                <v-icon left>mdi-clock</v-icon>
                {{ selectedTravel.duration }}
              </v-chip>
              <v-chip class="mr-2 mb-2" color="green" outlined>
                <v-icon left>mdi-camera</v-icon>
                {{ selectedTravel.photos }} photos
              </v-chip>
            </v-col>
            <v-col cols="12" md="4" class="text-right">
              <v-rating
                :value="selectedTravel.rating"
                color="yellow darken-3"
                background-color="grey darken-1"
                readonly
                half-increments
              ></v-rating>
            </v-col>
          </v-row>
          
          <div class="text-body-1" v-html="selectedTravel.fullStory"></div>
          
          <!-- Photo Gallery Placeholder -->
          <v-divider class="my-6"></v-divider>
          <h3 class="text-h6 mb-4">Photo Gallery</h3>
          <v-row>
            <v-col v-for="i in 6" :key="i" cols="4" sm="2">
              <v-img 
                :src="`https://picsum.photos/150/150?random=${selectedTravel.id}${i}`"
                aspect-ratio="1"
                class="grey lighten-2"
                cover
              ></v-img>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'TravelsView',
  data() {
    return {
      blogDialog: false,
      selectedTravel: null,
      travels: [
        {
          id: 1,
          destination: 'Tokyo',
          country: 'Japan',
          date: 'March 2024',
          duration: '10 days',
          photos: 247,
          rating: 5,
          favorite: true,
          image: 'https://picsum.photos/600/400?random=10',
          excerpt: 'An incredible journey through the bustling streets of Tokyo, experiencing traditional temples, modern technology, and amazing food.',
          fullStory: `
            <p>My trip to Tokyo was absolutely incredible! The city is a perfect blend of traditional Japanese culture and cutting-edge technology.</p>
            
            <h4>Day 1-3: Shibuya and Harajuku</h4>
            <p>Started my adventure in the famous Shibuya crossing - the energy is absolutely electric! Spent time exploring Harajuku's quirky fashion scene and tried some amazing street food.</p>
            
            <h4>Day 4-6: Traditional Tokyo</h4>
            <p>Visited the serene Senso-ji Temple in Asakusa and experienced a traditional tea ceremony. The contrast between ancient traditions and modern life is fascinating.</p>
            
            <h4>Day 7-10: Food and Culture</h4>
            <p>Dedicated the last few days to experiencing Tokyo's incredible food scene - from Michelin-starred restaurants to tiny ramen shops tucked away in alleyways.</p>
          `
        },
        {
          id: 2,
          destination: 'Paris',
          country: 'France',
          date: 'January 2024',
          duration: '7 days',
          photos: 189,
          rating: 4.5,
          favorite: false,
          image: 'https://picsum.photos/600/400?random=11',
          excerpt: 'The city of lights and love lived up to every expectation. From the Eiffel Tower to charming cafés, Paris was magical.',
          fullStory: `
            <p>Paris in winter has a special charm - fewer crowds and a cozy atmosphere that makes every café visit feel intimate.</p>
            
            <h4>Art and Museums</h4>
            <p>Spent entire days in the Louvre and Musée d'Orsay. The art collection is overwhelming in the best possible way.</p>
            
            <h4>Parisian Life</h4>
            <p>Loved the café culture - spending hours with a book and coffee, watching people walk by on the busy streets.</p>
          `
        },
        {
          id: 3,
          destination: 'Santorini',
          country: 'Greece',
          date: 'September 2023',
          duration: '5 days',
          photos: 156,
          rating: 5,
          favorite: true,
          image: 'https://picsum.photos/600/400?random=12',
          excerpt: 'Breathtaking sunsets, crystal blue waters, and charming white-washed buildings made this Greek island unforgettable.',
          fullStory: `
            <p>Santorini exceeded all my expectations. The famous sunsets from Oia are truly spectacular.</p>
            
            <h4>Island Life</h4>
            <p>Rented a scooter and explored the entire island - from Red Beach to the ancient ruins of Akrotiri.</p>
            
            <h4>Local Cuisine</h4>
            <p>The seafood was incredible, and I fell in love with authentic Greek salads and local wines.</p>
          `
        },
        {
          id: 4,
          destination: 'New York',
          country: 'USA',
          date: 'November 2023',
          duration: '4 days',
          photos: 203,
          rating: 4,
          favorite: false,
          image: 'https://picsum.photos/600/400?random=13',
          excerpt: 'The city that never sleeps showed me its incredible energy, from Broadway shows to Central Park walks.',
          fullStory: `
            <p>NYC is overwhelming in the best way - there's always something happening around every corner.</p>
            
            <h4>Broadway and Arts</h4>
            <p>Caught two amazing Broadway shows and spent time in world-class museums like MoMA and the Met.</p>
            
            <h4>Food Adventures</h4>
            <p>From food trucks to fine dining, the culinary diversity is unmatched anywhere else in the world.</p>
          `
        },
        {
          id: 5,
          destination: 'Iceland',
          country: 'Iceland',
          date: 'August 2023',
          duration: '8 days',
          photos: 312,
          rating: 5,
          favorite: true,
          image: 'https://picsum.photos/600/400?random=14',
          excerpt: 'A land of fire and ice, with stunning waterfalls, geysers, and the most beautiful natural landscapes I\'ve ever seen.',
          fullStory: `
            <p>Iceland's raw natural beauty is unlike anywhere else on Earth. Every turn revealed a new breathtaking vista.</p>
            
            <h4>Ring Road Adventure</h4>
            <p>Drove the famous Ring Road, stopping at Gullfoss, Geysir, and countless hidden waterfalls.</p>
            
            <h4>Northern Lights</h4>
            <p>Despite being August, we got lucky and saw a faint aurora on our last night - absolutely magical!</p>
          `
        },
        {
          id: 6,
          destination: 'Bali',
          country: 'Indonesia',
          date: 'June 2023',
          duration: '12 days',
          photos: 278,
          rating: 4.5,
          favorite: true,
          image: 'https://picsum.photos/600/400?random=15',
          excerpt: 'A spiritual journey through rice terraces, ancient temples, and some of the most welcoming people I\'ve ever met.',
          fullStory: `
            <p>Bali offered the perfect balance of relaxation, adventure, and cultural immersion.</p>
            
            <h4>Ubud and Nature</h4>
            <p>Stayed in Ubud surrounded by lush rice terraces. Morning yoga sessions and healthy local cuisine were daily highlights.</p>
            
            <h4>Temple Hopping</h4>
            <p>Visited dozens of beautiful Hindu temples, each with its own unique architecture and spiritual significance.</p>
          `
        }
      ]
    }
  },
  methods: {
    readMore(travel) {
      this.selectedTravel = travel
      this.blogDialog = true
    },
    toggleFavorite(id) {
      const travel = this.travels.find(item => item.id === id)
      if (travel) {
        travel.favorite = !travel.favorite
      }
    }
  }
}
</script>

<style scoped>
.travel-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.travel-card:hover {
  transform: translateY(-2px);
}

.travel-card:hover .travel-overlay {
  opacity: 1 !important;
}

.travel-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>