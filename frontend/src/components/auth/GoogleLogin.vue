<template>
  <div style="display: flex; flex: 1; align-items: center; justify-content:center; width: 100vw; height: 100vh;">
    <v-card
      class="mx-auto pa-12 pb-8"
      elevation="8"
      max-width="448"
      rounded="lg"
    >

      <v-text-field
        density="compact"
        label="Server"
        placeholder="IN-LKO-LENOVO"
        prepend-inner-icon="mdi-server"
        variant="outlined"
        readonly
        model-value="IN-LKO-LENOVO"
      ></v-text-field>

      <v-text-field
        density="compact"
        label="IP Address"
        placeholder="10.144.113.16"
        prepend-inner-icon="mdi-ip"
        variant="outlined"
        readonly
        model-value="10.144.113.16"
      ></v-text-field>


      <v-btn
        class="mb-8"
        color="#266fd5"
        size="large"
        variant="flat"
        block
        @click="sendLoginRequest"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a
          class="text-blue text-decoration-none"
          href="https://accounts.zerotier.com/realms/zerotier/protocol/openid-connect/auth?client_id=zt-central&redirect_uri=https%3A%2F%2Fmy.zerotier.com%2Fauth%2Fcallback&response_type=code&scope=openid+profile+email+offline_access&state=b77fa9c6931a4307a44008534e7e4c6c&code_challenge=QW40uJ08L3MfH-Yir8NoSqu26n8TcXhPnO2-WF_RAtw&code_challenge_method=S256&response_mode=query"
          rel="noopener noreferrer"
          target="_blank"
          style="color: #FFB354 !important;"
          >
            Link to ZeroTier <v-icon icon="mdi-open-in-new"></v-icon>
        </a>
      </v-card-text>
      
      <v-card
        class="mb-12"
        color="#266fd5"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Info - Use the login button above to continue with your Google account. Only your googleID, email and display name will be collected and stored. 
        </v-card-text>
      </v-card>
      <v-card
        class="mb-12"
        color="#266fd5"
        variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Info - Use the link to navigate to ZeroTier to manage network and devices. 
        </v-card-text>
      </v-card>
      
    </v-card>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        visible: false,
        response: null,
        error: null
      };
    },
    methods: {
      async sendLoginRequest() {
        try {
          const res = window.location.href = "http://localhost:3000/auth/google";
          this.response = res.data;
          this.error = null;
        } catch (err) {
          console.log(err)
          this.error = "An error occurred while sending the request.";
          this.response = null;
        }
      }
    }
  };
  </script>
  
<style>

</style>
