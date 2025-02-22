<template>
  <div class="container">
    <div class="left-section">
      <img src="/images/illustration.png" alt="Logo" class="logo-image" />
    </div>
    
    <v-card class="login-card" elevation="10">
      <img src="/images/logoapp.png" alt="Logo" class="card-logo" />
      
      <!-- Updated Google Login Button with sendLoginRequest -->
      <v-btn class="google-login" block @click="sendLoginRequest">
        <img src="/images/googlelogo.png" alt="Google Logo" class="google-logo" />
        <span>Login with Google</span>
      </v-btn>

      <div class="divider-container">
        <img src="/images/or.png" alt="Divider" class="divider-image" />
      </div>

      <transition name="slide-down">
        <div v-if="showLoginFields" class="login-fields">
          <v-text-field
            density="compact"
            label="Email"
            placeholder="example@gmail.com"
            variant="outlined"
          >
            <template v-slot:prepend-inner>
              <img src="/images/email.png" alt="Email Icon" class="icon" />
            </template>
          </v-text-field>
          
          <v-text-field
            density="compact"
            label="Password"
            placeholder="********"
            variant="outlined"
            type="password"
          >
            <template v-slot:prepend-inner>
              <img src="/images/pwd.png" alt="Password Icon" class="icon" />
            </template>
          </v-text-field>

          <v-btn class="login-button" block @click="performLogin">
            Admin Login
          </v-btn>

          <!-- ZeroTier Link with Tooltip -->
          <div class="zerotier-container">
            <a href="https://accounts.zerotier.com/realms/zerotier/protocol/openid-connect/auth?client_id=zt-central&redirect_uri=https%3A%2F%2Fmy.zerotier.com%2Fauth%2Fcallback&response_type=code&scope=openid+profile+email+offline_access&state=b77fa9c6931a4307a44008534e7e4c6c&code_challenge=QW40uJ08L3MfH-Yir8NoSqu26n8TcXhPnO2-WF_RAtw&code_challenge_method=S256&response_mode=query" target="_blank" class="zerotier-link">
              ZeroTier 
              <v-tooltip>
                <template v-slot:activator="{ props }">
                  <img 
                    src="/images/info.png" 
                    alt="Info Icon" 
                    class="tooltip-icon" 
                    v-bind="props" 
                  />
                </template>
                <span class="custom-tooltip">Manage your network and devices on ZeroTier.</span>
              </v-tooltip>
            </a>
          </div>
        </div>
      </transition>

      <v-btn class="login-button" block @click="toggleLogin" v-if="!showLoginFields">
        Admin Login
      </v-btn>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showLoginFields: false,
      visible: false,
      response: null,
      error: null
    };
  },
  methods: {
    async sendLoginRequest() {
      try {
        const res = window.location.href = `${process.env.VUE_APP_ENV}/auth/google`;
        this.response = res.data; // Note: This may not work as expected, as you're assigning a URL to `res`
        this.error = null;
      } catch (err) {
        console.log(err);
        this.error = "An error occurred while sending the request.";
        this.response = null;
      }
    },
    toggleLogin() {
      this.showLoginFields = !this.showLoginFields;
    },
    performLogin() {
      // Logic for performing the login action
      console.log("Logging in...");
    }
  }
};
</script>

<style scoped>
@import '@/assets/responsive.css'; /* Adjust the path as necessary */
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f9fc;
}

.icon {
  width: 20px; /* Adjust the size as needed */
  height: 20px; /* Adjust the size as needed */
  margin-right: 8px; /* Space between the icon and the input */
}

.zerotier-container {
  display: flex; /* Use flexbox for centering */
  justify-content: center; /* Center align horizontally */
  align-items: center; /* Center align vertically */
  margin: 20px 0; /* Space above and below */
}

.zerotier-link {
  color: #6c5ce7; /* Color of the link */
  display: flex; /* Make the link and icon align next to each other */
  align-items: center; /* Center align vertically */
  margin: 0 10px; /* Optional: Horizontal spacing */
}

.tooltip-icon {
  width: 16px; /* Adjust size of the tooltip icon */
  height: 16px; /* Adjust size of the tooltip icon */
  margin-left: 5px; /* Space between the text and the icon */
}

.left-section {
  width: 50%;
  display: flex;
  justify-content: center;
}

.logo-image {
  width: 60%;
}

.login-card {
  width: 400px;
  padding: 20px;
  border-radius: 12px;
  background: white;
  text-align: center;
}

.card-logo {
  width: 50px;
  margin-bottom: 15px;
}

.divider-container {
  text-align: center;
  margin: 10px 0;
}

.divider-image {
  width: 350px;
  height: auto;
}

.google-logo {
  width: 20px;
  height: 20px;
  margin-right: 8px;
} 

.google-login {
  background-color: #fff;
  border: 1px solid #ccc;
  color: black;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider {
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
}

.login-button {
  background-color: #6c5ce7;
  color: white;
  margin-top: 10px;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter, .slide-down-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
