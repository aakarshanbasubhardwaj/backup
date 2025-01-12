<template>
    <v-app>
      <v-container>
        <v-btn @click="sendTestRequest" color="primary">Send Auth Request</v-btn>
  
        <v-alert v-if="response" type="success" class="mt-4">
          {{ response }}
        </v-alert>
        
        <v-alert v-if="error" type="error" class="mt-4">
          {{ error }}
        </v-alert>
      </v-container>
    </v-app>
  </template>
  
  <script>
  // import axios from 'axios';
  
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
          const res = window.location.href = "http://localhost:3000/auth/google";
          
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