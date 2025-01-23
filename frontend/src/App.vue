<template>
  <v-app>
    <v-main>
      <router-view></router-view> 
    </v-main>
  </v-app>
</template>

<script>
import axios from './plugins/axios.js';
export default {
  created() {
    this.$router.isReady().then(() => {
      this.checkAuthentication();
    });
  },
  methods: {
    async checkAuthentication() {
      try {
        const response = await axios.get('/auth/status', { withCredentials: true });
        if (response.data.authenticated) {
          if (this.$router.currentRoute.value.path !== '/home') {
            this.$router.push('/home'); 
          }
        } else {
          if (this.$router.currentRoute.value.path !== '/login') {
            this.$router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        this.$router.push('/login'); 
      }
    },
  }
};
</script>

<style>

</style>