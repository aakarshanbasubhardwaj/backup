import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import BackupHome from './components/home/BackupHome.vue'
import GoogleLogin from './components/auth/GoogleLogin.vue'
import axios from './plugins/axios.js'

loadFonts()

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/' },
    { path: '/home', name: "Home", component: BackupHome, meta: { requiresAuth: true } },
    { path: '/login', name: "Login", component: GoogleLogin },
  ]
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const response = await axios.get('/auth/status', { withCredentials: true });
      if (response.data.authenticated) {
        next();
      } else {
        next('/login');
      }
    } catch (error) {
      next('/login');
    }
  } else if (to.name === 'Login') {
    try {
      const response = await axios.get('/auth/status', { withCredentials: true });
      if (response.data.authenticated) {
        next('/home');
      } else {
        next();
      }
    } catch (error) {
      next();
    }
  } else {
    next();
  }
});

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
