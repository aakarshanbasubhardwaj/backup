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
    { path: '/', redirect: { name: 'Login' }},
    { path: '/home', name: "Home", component: BackupHome, meta: { requiresAuth: true } },
    { path: '/login', name: "Login", component: GoogleLogin },
  ]
})

router.beforeEach(async (to, from, next) => {
  try{
    const response = await axios.get('/auth/status', { withCredentials: true });
    if (to.meta.requiresAuth) {
      if (response.data.authenticated) {
        next();
      } else {
        next({ name: 'Login', replace: true });
      }
    } else if (to.name === 'Login') {
      if (response.data.authenticated) {
        next({ name: 'Home', replace: true });
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.error('Authentication check failed:', error);
    next({ name: 'Login', replace: true });
  }
});

createApp(App)
  .use(vuetify)
  .use(router)
  .mount('#app')
