<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-card elevation="8">
          <v-card-title class="text-h4 text-center primary white--text py-6">
            <v-icon left class="mr-3">mdi-file-document</v-icon>
            Resume - Rizza Marzo
          </v-card-title>
          
          <v-card-text class="pa-8">
            <!-- Personal Info -->
            <v-row class="mb-8">
              <v-col cols="12" class="text-center">
                <v-avatar size="120" class="mb-4">
                  <v-img 
                    src="https://via.placeholder.com/120x120/1976d2/ffffff?text=RM"
                    alt="Rizza Marzo"
                  />
                </v-avatar>
                <h2 class="text-h4 mb-2">Rizza Marzo</h2>
                <p class="text-h6 text--secondary mb-4">Full Stack Developer & Digital Artist</p>
                <div class="d-flex justify-center flex-wrap">
                  <v-chip class="ma-1" color="primary" outlined>
                    <v-icon left>mdi-phone</v-icon>
                    909-904-9029
                  </v-chip>
                  <v-chip class="ma-1" color="primary" outlined>
                    <v-icon left>mdi-email</v-icon>
                    rizzacarla.12@gmail.com
                  </v-chip>
                </div>
              </v-col>
            </v-row>

            <v-divider class="mb-6"></v-divider>

            <!-- Professional Summary -->
            <v-row class="mb-6">
              <v-col cols="12">
                <h3 class="text-h5 mb-4 primary--text">
                  <v-icon left color="primary">mdi-account-tie</v-icon>
                  Professional Summary
                </h3>
                <p class="text-body-1 text-justify">
                  Creative and detail-oriented Full Stack Developer with intensive training from App Academy's 
                  rigorous bootcamp program (1000+ hours, less than 3% acceptance rate). Passionate about creating 
                  user-centric applications and combining technical skills with artistic vision. Experienced in both 
                  frontend and backend development with a strong foundation in JavaScript frameworks, responsive design 
                  principles, and collaborative problem-solving in software engineering environments.
                </p>
              </v-col>
            </v-row>

            <!-- Technical Skills -->
            <v-row class="mb-6">
              <v-col cols="12">
                <h3 class="text-h5 mb-4 primary--text">
                  <v-icon left color="primary">mdi-code-tags</v-icon>
                  Technical Skills
                </h3>
                <v-row>
                  <v-col cols="12" sm="6" md="4" v-for="skill in skills" :key="skill.category">
                    <v-card outlined class="pa-4 mb-4">
                      <v-card-title class="text-h6 pb-2">
                        <v-icon left :color="skill.color">{{ skill.icon }}</v-icon>
                        {{ skill.category }}
                      </v-card-title>
                      <v-chip-group column>
                        <v-chip 
                          v-for="tech in skill.technologies" 
                          :key="tech"
                          small
                          :color="skill.color"
                          outlined
                        >
                          {{ tech }}
                        </v-chip>
                      </v-chip-group>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>

            <!-- Experience -->
            <v-row class="mb-6">
              <v-col cols="12">
                <h3 class="text-h5 mb-4 primary--text">
                  <v-icon left color="primary">mdi-briefcase</v-icon>
                  Experience
                </h3>
                <v-timeline dense>
                  <v-timeline-item
                    v-for="job in experience"
                    :key="job.id"
                    color="primary"
                    small
                  >
                    <v-card class="elevation-2">
                      <v-card-title class="text-h6">
                        {{ job.position }}
                        <v-spacer></v-spacer>
                        <v-chip small color="primary" outlined>{{ job.period }}</v-chip>
                      </v-card-title>
                      <v-card-subtitle>{{ job.company }}</v-card-subtitle>
                      <v-card-text>
                        <ul>
                          <li v-for="duty in job.duties" :key="duty">{{ duty }}</li>
                        </ul>
                      </v-card-text>
                    </v-card>
                  </v-timeline-item>
                </v-timeline>
              </v-col>
            </v-row>

            <!-- Education -->
            <v-row class="mb-6">
              <v-col cols="12">
                <h3 class="text-h5 mb-4 primary--text">
                  <v-icon left color="primary">mdi-school</v-icon>
                  Education
                </h3>
                <v-card outlined class="pa-4 mb-4">
                  <v-card-title class="text-h6">
                    Full Stack Web Development
                    <v-spacer></v-spacer>
                    <v-chip small color="success" outlined>Bootcamp</v-chip>
                  </v-card-title>
                  <v-card-subtitle>App Academy • 2020 - 2021</v-card-subtitle>
                  <v-card-text>
                    <p class="mb-2">
                      Completed intensive 1000+ hour full-stack web development program with less than 3% acceptance rate.
                    </p>
                    <v-chip-group>
                      <v-chip small outlined>JavaScript</v-chip>
                      <v-chip small outlined>React</v-chip>
                      <v-chip small outlined>Node.js</v-chip>
                      <v-chip small outlined>Database Design</v-chip>
                      <v-chip small outlined>Algorithms</v-chip>
                      <v-chip small outlined>Data Structures</v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>

                <v-card outlined class="pa-4">
                  <v-card-title class="text-h6">
                    Software Testing & Project Management
                    <v-spacer></v-spacer>
                    <v-chip small color="info" outlined>Certification</v-chip>
                  </v-card-title>
                  <v-card-subtitle>Udemy</v-card-subtitle>
                  <v-card-text>
                    Master Software Testing + Jira + Agile methodologies certification.
                    Specialized training in quality assurance and project management tools.
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Download Button -->
            <v-row class="mt-8">
              <v-col cols="12" class="text-center">
                <v-btn 
                  large 
                  color="primary" 
                  @click="downloadResume"
                  class="mr-4"
                >
                  <v-icon left>mdi-download</v-icon>
                  Download PDF
                </v-btn>
                <v-btn 
                  large 
                  color="success" 
                  outlined
                  @click="contactMe"
                >
                  <v-icon left>mdi-email</v-icon>
                  Contact Me
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ResumeView',
  data() {
    return {
      skills: [
        {
          category: 'Frontend',
          icon: 'mdi-web',
          color: 'blue',
          technologies: ['JavaScript', 'Vue.js', 'React', 'HTML5', 'CSS3']
        },
        {
          category: 'Backend',
          icon: 'mdi-server',
          color: 'green',
          technologies: ['Node.js', 'Express.js', 'MongoDB', 'REST APIs']
        },
        {
          category: 'Tools & Frameworks',
          icon: 'mdi-tools',
          color: 'orange',
          technologies: ['Angular', 'Git', 'Webpack', 'Vite', 'NPM']
        }
      ],
      experience: [
        {
          id: 1,
          position: 'Software Developer',
          company: 'Mongoose',
          period: '2021 - Present',
          duties: [
            'Developed and maintained full-stack web applications',
            'Collaborated with cross-functional teams to deliver high-quality software solutions',
            'Implemented responsive UI components and optimized user experience',
            'Participated in code reviews and maintained high coding standards',
            'Utilized problem-solving strategies to tackle complex technical challenges'
          ]
        },
        {
          id: 2,
          position: 'Full Stack Developer',
          company: 'Freelance Projects',
          period: '2020 - 2021',
          duties: [
            'Built custom web applications for clients using modern JavaScript frameworks',
            'Applied full-stack development skills learned from App Academy intensive program',
            'Integrated APIs and database systems for dynamic web applications',
            'Provided technical consultation and project planning services',
            'Delivered responsive, cross-browser compatible solutions'
          ]
        },
        {
          id: 3,
          position: 'Student Developer',
          company: 'App Academy Bootcamp',
          period: '2020 - 2021',
          duties: [
            'Completed 1000+ hours of intensive full-stack web development training',
            'Mastered JavaScript, React, Node.js, and database technologies',
            'Developed multiple portfolio projects demonstrating technical proficiency',
            'Collaborated on team projects using agile development methodologies',
            'Demonstrated exceptional problem-solving skills in coding challenges'
          ]
        }
      ]
    }
  },
  methods: {
    downloadResume() {
      // This would trigger a download of the actual PDF resume
      alert('Resume download would start here. Please contact me for the latest version!')
    },
    contactMe() {
      this.$router.push('/contact')
    }
  }
}
</script>

<style scoped>
.text-justify {
  text-align: justify;
}

.v-timeline-item__body {
  padding-bottom: 24px;
}

ul {
  padding-left: 20px;
}

li {
  margin-bottom: 8px;
}
</style>