import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import BackupDrive from './components/drive/BackupDrive.vue'
import BackupHome from './components/home/BackupHome.vue'
import GoogleLogin from './components/auth/GoogleLogin.vue'
import axios from 'axios'

loadFonts()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/home', name: "Home", component: BackupHome },
    { path: '/login', name: "Login", component: GoogleLogin },
    { path: '/drive', name: "Drive", component: BackupDrive, meta: { requiresAuth: true } },
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const response = await axios.get('http://localhost:3000/auth/status', { withCredentials: true });
      if (response.data.authenticated) {
        next(); // User is authenticated, proceed
      } else {
        next('/login'); // User not authenticated, redirect to login
      }
    } catch (error) {
      next('/login'); // Redirect to login on error (e.g., 401)
    }
  } else if (to.name === 'Login') {
    // If the user is already authenticated and trying to visit the login page, redirect them to the homepage
    try {
      const response = await axios.get('http://localhost:3000/auth/status', { withCredentials: true });
      if (response.data.authenticated) {
        next('/drive'); // Redirect to homepage if user is already logged in
      } else {
        next(); // Proceed to login if user is not logged in
      }
    } catch (error) {
      next(); // Proceed to login page if there's an error (e.g., 401)
    }
  } else {
    next(); // Proceed if route does not require authentication
  }
});

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
