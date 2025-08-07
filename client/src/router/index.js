import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import ContactView from '@/views/ContactView.vue'
import ResumeView from '@/views/ResumeView.vue'
import ArtworkView from '@/views/ArtworkView.vue'
import TravelsView from '@/views/TravelsView.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'
import ArtworkManagement from '@/views/admin/ArtworkManagement.vue'
import TravelManagement from '@/views/admin/TravelManagement.vue'
// import ResumeManagement from '@/views/admin/ResumeManagement.vue'
// import ContactManagement from '@/views/admin/ContactManagement.vue'
// import Settings from '@/views/admin/Settings.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/contact',
      name: 'contact',
      component: ContactView,
    },
    {
      path: '/resume',
      name: 'resume',
      component: ResumeView,
    },
    {
      path: '/artwork',
      name: 'artwork',
      component: ArtworkView,
    },
    {
      path: '/travels',
      name: 'travels',
      component: TravelsView,
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: AdminLogin,
    },
    {
      path: '/admin/dashboard',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/artwork',
      name: 'admin-artwork',
      component: ArtworkManagement,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin/travels',
      name: 'admin-travels',
      component: TravelManagement,
      meta: { requiresAuth: true },
    },
    // {
    //   path: '/admin/resume',
    //   name: 'admin-resume',
    //   component: ResumeManagement,
    //   meta: { requiresAuth: true },
    // },
    // {
    //   path: '/admin/contact',
    //   name: 'admin-contact',
    //   component: ContactManagement,
    //   meta: { requiresAuth: true },
    // },
    // {
    //   path: '/admin/settings',
    //   name: 'admin-settings',
    //   component: Settings,
    //   meta: { requiresAuth: true },
    // },
  ],
})

// Route guard for authentication
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      next('/admin/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
