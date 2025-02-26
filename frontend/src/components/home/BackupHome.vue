<template>
    <v-app>
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
          
          <v-list-item style="color: #FFB354 !important; display: flex; align-items: center;">
            <v-icon size="30" left class="mr-5" icon="mdi-open-in-new"></v-icon>
            <a
            class="text-blue text-decoration-none"
            href="https://accounts.zerotier.com/realms/zerotier/protocol/openid-connect/auth?client_id=zt-central&redirect_uri=https%3A%2F%2Fmy.zerotier.com%2Fauth%2Fcallback&response_type=code&scope=openid+profile+email+offline_access&state=b77fa9c6931a4307a44008534e7e4c6c&code_challenge=QW40uJ08L3MfH-Yir8NoSqu26n8TcXhPnO2-WF_RAtw&code_challenge_method=S256&response_mode=query"
            rel="noopener noreferrer"
            target="_blank"
            style="color: #FFB354 !important;"
          >
          <span>ZeroTier</span> 
          </a>
          </v-list-item>
          <v-list-item style="margin-bottom: 2vh;">
            <v-btn @click="submitLogout" block variant="flat" style="background-color: #ffffff; color: #06367a;">
              Logout
            </v-btn>
          </v-list-item>
          </template>
      </v-navigation-drawer>
      <v-main style="background-color: #ebf2fc;">
        <v-container>
          <v-row>
            <v-col cols="12" md="8">
               <v-card style="height: auto;" class="rounded-pill">
                <v-text-field
                label="Search"
                clearable
                hide-details
                prepend-inner-icon="mdi-magnify"
                variant="solo"
                ></v-text-field>
               </v-card>
              
              <v-row class="mt-4">
                <v-col cols="12" sm="6" md="3">
                  <div style="font-weight: bold; font-size: larger; color: #06367a;">Categories</div>
                </v-col>
              </v-row>
  
              <v-row class="mt-4">
                <v-col cols="12" sm="6" md="3" >
                  <v-card link :to="{ path: '/' }" @click="fetch('photos')" outlined style="background-color: #6663fe; color: #ffffff;" class="rounded-xl">
                    <v-card-text class="text-center">
                      <v-icon class="mb-2" size="40" color="#ffffff">mdi-camera</v-icon>
                      <div style="font-weight: bold;">Pictures</div>
                      <small v-if="fileCounts && fileCounts.photos !== undefined" style="color: #ffffff;">{{ fileCounts.photos }} files</small>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3" >
                  <v-card link :to="{ path: '/' }" @click="fetch('documents')"  outlined style="background-color: #00a0b6; color: #ffffff;" class="rounded-xl">
                    <v-card-text class="text-center">
                      <v-icon class="mb-2" size="40" color="#ffffff">mdi-file-document</v-icon>
                      <div style="font-weight: bold;">Documents</div>
                      <small v-if="fileCounts && fileCounts.documents !== undefined" style="color: #ffffff;">{{ fileCounts.documents }} files</small>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3" >
                  <v-card link :to="{ path: '/' }" @click="fetch('videos')"  outlined style="background-color: #e06c9f; color: #ffffff;" class="rounded-xl">
                    <v-card-text class="text-center">
                      <v-icon class="mb-2" size="40" color="#ffffff">mdi-movie</v-icon>
                      <div style="font-weight: bold;">Videos</div>
                      <small v-if="fileCounts && fileCounts.videos !== undefined" style="color: #ffffff;">{{ fileCounts.videos }} files</small>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3" >
                  <v-card link :to="{ path: '/' }" @click="fetch('audio')"  outlined style="background-color: #266fd5; color: #ffffff;" class="rounded-xl">
                    <v-card-text class="text-center">
                      <v-icon class="mb-2" size="40" color="#ffffff">mdi-music-note</v-icon>
                      <div style="font-weight: bold;">Audio</div>
                      <small v-if="fileCounts && fileCounts.audio !== undefined" style="color: #ffffff;">{{ fileCounts.audio }} files</small>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <v-row class="mt-4">
                <v-col cols="12" sm="6" md="3">
                  <div style="font-weight: bold; font-size: larger; color: #06367a;">Files</div>
                </v-col>
              </v-row>

              <v-row class="mt-4 image-container">
                <div>
                  <v-alert v-if="noFiles" type="error" dismissible closable>
                    No {{ currentCategory }} found!
                  </v-alert>
                  <v-progress-circular
                    v-if="loading"
                    :size="75"
                    :width="7"
                    color="blue"
                    indeterminate
                  />
                </div>
                <v-col
                  v-for="(file, index) in files"
                  :key="index"
                  class="d-flex child-flex"
                  cols="6" sm="4" md="4"
                >
                  <v-img
                    v-if="currentCategory === 'photos'"
                    :src="`${baseURL}/serve/${userID}/photos/${file.storedName}`"
                    aspect-ratio="1/1"
                    class="bg-grey-lighten-2"
                    cover
                    max-height="200px"
                    @click="openFullScreen(file.storedName)"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        align="center"
                        class="fill-height ma-0"
                        justify="center"
                      >
                        <v-progress-circular
                          color="grey-lighten-5"
                          indeterminate
                        ></v-progress-circular>
                      </v-row>
                    </template>

                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn color="white" icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop
                        style="position: absolute; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.5);"></v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="downloadWithAxios(`${baseURL}/serve/${userID}/photos/${file.storedName}`, file.storedName)">
                          <v-list-item-title>Download</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="deleteFile(file)">
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-img>
                  <v-card
                    v-else-if="currentCategory === 'documents'"
                    class="pa-4"
                    outlined
                  >

                    <v-icon size="36" color="#00a0b6">{{ getDocumentIcon(file.originalName)}}</v-icon>
                    <div>{{ file.originalName }}</div>

                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn color="white" icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop
                        style="position: absolute; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.5);"></v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="downloadWithAxios(`${baseURL}/serve/${userID}/documents/${file.storedName}`, file.storedName)">
                          <v-list-item-title>Download</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="deleteFile(file)">
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card>

                  <!-- Display Videos -->
                  <v-card
                    v-else-if="currentCategory === 'videos'"
                    class="pa-4"
                    outlined
                  >
                    <video controls width="100%">
                      <source :src="`${baseURL}/${userID}/videos/${file.storedName}`" />
                    </video>
                    <div>{{ file.originalName }}</div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn color="white" icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop
                        style="position: absolute; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.5);"></v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="downloadWithAxios(`${baseURL}/serve/${userID}/videos/${file.storedName}`, file.storedName)">
                          <v-list-item-title>Download</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="deleteFile(file)">
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card>

                  <!-- Display Audio -->
                  <v-card
                    v-else-if="currentCategory === 'audio'"
                    class="pa-4"
                    outlined
                  >
                    <audio controls>
                      <source :src="`${baseURL}/${userID}/audio/${file.storedName}`" />
                    </audio>
                    <div>{{ file.originalName }}</div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn color="white" icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop
                        style="position: absolute; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.5);"></v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="downloadWithAxios(`${baseURL}/serve/${userID}/audio/${file.storedName}`, file.storedName)">
                          <v-list-item-title>Download</v-list-item-title>
                        </v-list-item>

                        <v-list-item @click="deleteFile(file)">
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card>
                </v-col>
                <v-dialog v-model="deleteDialog" max-width="500">
                  <v-card>
                    <v-card-title class="headline">Are you sure you want to delete this file?</v-card-title>
                    <v-card-actions>
                      <v-btn color="green darken-1" text @click="deleteDialog = false">Cancel</v-btn>
                      <v-btn color="red darken-1" text @click="confirmDelete">Delete</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>

            </v-col>
            
            <v-col cols="12" md="4">
              <v-card
              style="background-color: #ffffff; height: auto; padding: 15px;" class="mb-4 rounded-md">
                <v-card outlined style="background-color: #f5f9fd; height: 50vh; display: flex; align-items: center;" class="mb-4 text-center rounded-md">
                <v-card-text>
                  <v-icon size="40" class="mb-2" color="#266fd5" @click="triggerFileInput">mdi-file-upload</v-icon>
                  <v-file-input
                    v-model="filesToUpload"
                    label="Select files to upload"
                    multiple
                    outlined
                    v-show="false"
                    ref="fileInput"
                    class="mb-4"
                  >
                  </v-file-input>
                  <div>
                    <v-btn
                      color="#266fd5"
                      @click="uploadFiles"
                      :disabled="!filesToUpload.length"
                      class="mb-4"
                      variant="flat"
                      >
                      Add new files
                    </v-btn>
                    <v-progress-linear
                      v-if="uploadProgress > 0"
                      :model-value="uploadProgress"
                      height="10"
                      color="#266fd5"
                      class="mt-4"
                      striped
                    ></v-progress-linear>
                  </div>
                  <div>
                    <v-alert v-if="uploadStatus" :type="uploadStatus.type" dismissible closable>
                      {{ uploadStatus.message }}
                    </v-alert>
                  </div>
                </v-card-text>
              </v-card>
              <v-card outlined style="background-color: #f5f9fd; color: #06367a;" class="mb-4 rounded-md">
                <v-card-text>
                  <div style="font-weight: bold;">Your storage</div><br/>
                  <div style="color: #111111; margin-bottom: 5px;">
                    {{ diskUsage.totalUsed }} of {{ diskUsage.totalSize }} used
                  </div>
                  <v-progress-linear 
                    v-if="progress !== 0"
                    :model-value="progress" 
                    :height="10" 
                    color="#266fd5" 
                    class="rounded-lg"
                  ></v-progress-linear>
                  <small style="margin-top: 2px;">{{ progress.toFixed(2) }} % used</small>
                </v-card-text>
              </v-card>
              </v-card>
            </v-col>
            <v-dialog v-model="dialog" max-width="90%" fullscreen hide-overlay>
              <v-img :src="fullScreenImage" aspect-ratio="1" class="bg-transparent" />
              <v-btn
                icon
                absolute
                top
                right
                @click="dialog = false"
                class="white--text"
                size="small"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-dialog>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script>
import axios from '../../plugins/axios.js';
  export default {
    data() {
      return {
        filesToUpload: [],
        uploadStatus: null,
        uploadProgress: 0,
        drawer: true,
        group: null,
        diskUsage: {
          totalSize: "0 GB",   
          totalUsed: "0 GB",   
        },
        progress: 0,
        error: null,
        fileCounts: {
          photos: 0,
          videos: 0,
          audio: 0,
          documents: 0,
          others: 0,
        },
        files: [],
        userID: null,
        currentCategory: "photos",
        dialog: false, 
        fullScreenImage: "",
        noFiles: false,
        deleteDialog: false, 
        fileToDelete: null,
        baseURL: process.env.VUE_APP_ENV,
        loading: false,
      };
    },
    watch: {
      group () {
        this.drawer = false
      },
    },
    mounted() {
      this.initialLoad();
    },
    methods: {
      openFullScreen(file) {
        this.fullScreenImage = `${process.env.VUE_APP_ENV}/serve/${this.userID}/photos/${file}`;
        this.dialog = true; 
      },
      forceFileDownload(response, title) {
        console.log(title)
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', title)
        document.body.appendChild(link)
        link.click()
      },
      async downloadWithAxios(url, title) {
        await axios.get(url,{ responseType: 'arraybuffer' })
          .then((response) => {
            this.forceFileDownload(response, title)
          })
          .catch(() => console.log('error occured'))
      },
      handleFileUpload(event) {
        this.filesToUpload = event.target.files;
      },
      triggerFileInput() {
        this.$refs.fileInput.$el.querySelector('input[type="file"]').click();
      },
      async uploadFiles() {
        this.uploadStatus = null;
        const formData = new FormData();
        for (const file of this.filesToUpload) {
          formData.append('files', file);
        }
        for (let key of formData.keys()) {
      console.log('FormData Key:', key, 'Value:', formData.get(key));
    }
  
        try {
          const response = await axios.post(`${process.env.VUE_APP_ENV}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          },
          withCredentials: true,
        });
          if (response.status === 200) {
            this.filesToUpload = [];
            this.uploadStatus = {
              type: 'success',
              message: 'Files uploaded successfully!'
            };
            this.uploadProgress = 0;
            this.fetchFileCounts();
          } else {
            this.filesToUpload = [];
            this.uploadStatus = {
              type: 'error',
              message: 'File upload failed!'
            };
            this.uploadProgress = 0;
          }
        } catch (error) {
          this.filesToUpload = [];
          this.uploadStatus = {
            type: 'error',
            message: 'Error uploading files: ' + error.message
          };
          this.uploadProgress = 0;
        }
      },
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
      
      async initialLoad() {
        try {
          await Promise.all([
            this.fetchDiskUsage(),
            this.fetchFileCounts(),
            this.fetchUserID(),
            this.fetchPhotos()
          ]);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      },

      async fetchDiskUsage() {
        try {
          const response = await axios.get("/disk-usage");
          this.diskUsage = response.data.data;
          
          const used = this.parseSize(this.diskUsage.totalUsed);
          const total = this.parseSize(this.diskUsage.totalSize);

          this.progress = (used / total) * 100;
        } catch (err) {
          console.error("Error fetching disk usage:", err);
        }
      },

      async fetchFileCounts() {
        try {
          const response = await axios.get("/file-counts", { withCredentials: true });
          this.fileCounts = response.data;
        } catch (err) {
          console.error("Error fetching file counts:", err);
        }
      },

      async fetchUserID() {
        try {
          const response = await axios.get('/userID', { withCredentials: true });
          this.userID = response.data;
        } catch (err) {
          console.error('Error fetching userID:', err);
        }
      },

      async fetchPhotos() {
        try {
          this.loading = true;
          const response = await axios.get('/get/photos', { withCredentials: true });
          if(response.data.files){
            this.files = response.data.files; 
          } else {
            this.noFiles = true;
          }
        } catch (err) {
          console.error('Error fetching images:', err);
        }finally {
          this.loading = false;
        }
      },

      async fetch(category) {
        try {
          this.loading = true;
          this.currentCategory = category;
          this.files = [];
          const response = await axios.get(`/get/${category}`, { withCredentials: true });
          if(response.data.files){
            this.files = response.data.files; 
            this.noFiles = false;
          } else {
            console.log("no files");
            this.files = [];
            this.noFiles = true;
          }
        } catch (err) {
          console.error('Error fetching images:', err);
        } finally {
          this.loading = false;
        }
      },
      
      parseSize(sizeString) {
        const sizeMatch = sizeString.match(/(\d+\.?\d*)\s*(GB|MB|TB)/i);
        if (!sizeMatch) return 0;

        const value = parseFloat(sizeMatch[1]);
        const unit = sizeMatch[2].toUpperCase();

        switch (unit) {
          case "GB":
            return value;
          case "MB":
            return value / 1024;  
          case "TB":
            return value * 1024;  
          default:
            return 0;
        }
      },
      deleteFile(file) {
        this.fileToDelete = file; 
        this.deleteDialog = true; 
      },

      confirmDelete() {
        this.deleteDialog = false;
        this.deleteConfirmedFile(this.fileToDelete); 
      },
      async deleteConfirmedFile(file) {
        try {
          const response = await axios.delete(`/delete/file/${this.userID}/${this.currentCategory}/${file.storedName}`);

          if (response.status === 200) {    
            const index = this.files.indexOf(file);
            if (index !== -1) {
              this.files.splice(index, 1); 
            }
            await this.fetchFileCounts();
          }
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      },
      getDocumentIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        const icons = {
          pdf: "mdi-file-pdf",
          txt: "mdi-file-document-outline",
          doc: "mdi-file-word",
          docx: "mdi-file-word",
          xls: "mdi-file-excel",
          xlsx: "mdi-file-excel",
          ppt: "mdi-file-powerpoint",
          pptx: "mdi-file-powerpoint",
          odt: "mdi-file-document",
          ods: "mdi-file-table",
          odp: "mdi-file-presentation-box",
          csv: "mdi-file-delimited",
          xml: "mdi-xml",
          json: "mdi-code-json",
          html: "mdi-language-html5",
          htm: "mdi-language-html5",
          tex: "mdi-file-document-outline",
          yml: "mdi-file-code",
          md: "mdi-language-markdown",
          js: "mdi-language-javascript"
        };

        return icons[extension] || "mdi-file-document";
      },
    },
  };
  </script>
  
  <style>
  .text-center {
    text-align: center;
  }
  .v-dialog__overlay {
  background-color: rgba(0, 0, 0, 0.7) !important; 
}
.v-dialog__content {
  background: transparent !important;
}
.v-btn[absolute] {
  position: absolute;
  top: 16px; 
  right: 16px; 
  z-index: 2; 
}
.image-container {
  height: 500px; 
  overflow-y: auto; 
}
  </style>
  