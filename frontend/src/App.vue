<template>
  <v-app>
    <v-main>
      <div>
        <router-view></router-view>
      </div>
    </v-main>
    <v-layout class="overflow-visible">
      <v-bottom-navigation
        v-model="active"
        :mandatory="true"
        color="primary"
        grow
        app
      >
        <v-btn to="/home" value="home" icon>
          <v-icon>mdi-home</v-icon>
          Home
        </v-btn>
        <v-btn to="/login" value="login" icon>
          <v-icon>mdi-login</v-icon>
          Login
        </v-btn>
        <v-btn to="/drive" value="drive" icon>
          <v-icon>mdi-file</v-icon>
          Drive
        </v-btn>
        <v-btn @click="submitLogout" value="logout" icon>
          <v-icon>mdi-logout</v-icon>
          Logout
        </v-btn>
      </v-bottom-navigation>
    </v-layout>
    
  </v-app>
</template>
<script>
import axios from './plugins/axios.js';

export default {
  methods: {
    async submitLogout() {
      try {
        // Call the logout API
        const response = await axios.get('/auth/logout', { withCredentials: true });

        // Check response status
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl;
        } else {
          console.log("Logout error", response.status);
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  }
};
</script>

<style>
/* Optional styles for better presentation */
body {
  margin: 0;
}
</style>