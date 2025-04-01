<template>
        <v-app-bar
        color="#06367a"
        prominent
        v-if="$vuetify.display.mdAndDown"
        style="position: fixed;"
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>
      <v-navigation-drawer 
        app 
        color="#06367a" 
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'left' : 'left'"
        height="100%"
        style="position: fixed; display: flex; flex-direction: column; justify-content: space-between;"

        >
        <v-list>
          <v-list-item link :to="{ path: '/home' }" style="display: flex; align-items: center;">
            <v-avatar class="mx-auto mb-4" size="80" >
              <v-icon size="50" color="#ffffff">mdi-server</v-icon>
            </v-avatar>
            <span>backup</span>
          </v-list-item>
          <v-list-item link :to="{ path: '/' }" style="display: flex; align-items: center;">
            <v-icon size="30" left class="mr-5">mdi-account-lock</v-icon>
            <span>My Cloud</span>
          </v-list-item>
          <v-list-item link :to="{ path: '/' }" style="display: flex; align-items: center;">
            <v-icon size="30" left class="mr-5">mdi-camera</v-icon>
              <span>Pictures</span>
          </v-list-item>
          <v-list-item link :to="{ path: '/' }" style="display: flex; align-items: center;">
            <v-icon size="30" left class="mr-5">mdi-movie</v-icon>
              <span>Videos</span>
          </v-list-item>
          <v-list-item link :to="{ path: '/' }" style="display: flex; align-items: center;">
              <v-icon size="30" left class="mr-5">mdi-file-document</v-icon>
              <span>Documents</span>
          </v-list-item>
          <v-list-item link :to="{ path: '/' }" style="display: flex; align-items: center;">
            <v-icon size="30" left class="mr-5">mdi-music-note</v-icon>
              <span>Audio</span>
          </v-list-item>
        </v-list>
        
        <template v-slot:append>
          <v-list-item style="margin-bottom: 2vh;">
            <v-btn @click="submitLogout" block variant="flat" style="background-color: #ffffff; color: #06367a;">
              Logout
            </v-btn>
          </v-list-item>
          </template>
      </v-navigation-drawer>
</template>

<script>

import axios from '../../plugins/axios.js';

export default {
    data() {
        return {
            drawer: true
        }
    },

    watch: {
      group () {
        this.drawer = false
      },
    },
    methods: {
        async submitLogout() {
        try {
          const response = await axios.get('/auth/logout', { withCredentials: true });

          if (response.data.redirectUrl) {
            window.location.href = response.data.redirectUrl;
          } else {
            console.log("Logout error", response.status);
          }
        } catch (error) {
          console.error("Error during logout:", error);
        }
      },
    }
}


</script>

<style>

</style>