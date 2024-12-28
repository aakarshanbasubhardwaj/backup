<template>
  <v-app>
    <v-container>
      <!-- Button to trigger the request -->
      <v-btn @click="sendTestRequest" color="primary">Send Test Request</v-btn>

      <!-- Display the response from the server -->
      <v-alert v-if="response" type="success" class="mt-4">
        {{ response }}
      </v-alert>
      
      <!-- Display an error message if any -->
      <v-alert v-if="error" type="error" class="mt-4">
        {{ error }}
      </v-alert>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      response: null,
      error: null
    };
  },
  methods: {
    async sendTestRequest() {
      try {
        // Send GET request to /test route
        const res = await axios.get('http://localhost:3000/test');
        
        // Set the response data
        this.response = res.data;
        this.error = null;
      } catch (err) {
        // Handle error and display it
        console.log(err)
        this.error = "An error occurred while sending the request.";
        this.response = null;
      }
    }
  }
};
</script>

<style>
/* Optional custom styles */
</style>
