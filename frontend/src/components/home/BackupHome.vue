<template>
  <v-app>
    <AppDrawer />
    <v-main style="background-color: #ebf2fc;">
      <v-container>
        <v-row>
          <v-col cols="12" md="8">
            <SearchBox
              :fetchPhotos="fetchPhotos"
              @update-loading="updateLoading"
              @update-files="updateFiles"
              @update-searchFiles="updateSearchFiles"
              @update-filesHeader="updateFilesHeader"
              @searchQuery="emitSearchQuery"
            />              
            <FileCategories  
              :fileCounts="fileCounts"
              @update-loading="updateLoading"
              @update-currentCategory="updateCurrentCategory"
              @update-files="updateFiles"
              @update-searchFiles="updateSearchFiles"
              @update-filesHeader="updateFilesHeader"
              @update-noFiles="updateNoFiles"
            />
            <v-row class="mt-4">
              <v-col cols="12" sm="6" md="3">
                <div style="font-weight: bold; font-size: larger; color: #06367a;">{{ filesHeader }}</div>
              </v-col>
            </v-row>
            <FileDisplayGrid
              :noFiles="noFiles"
              :loading="loading"
              :currentCategory="currentCategory"
              :searchFiles="searchFiles"
              :files="files"
              :searchQuery="searchQuery"
              @update-FileCount="updateFileCount"
            />
          </v-col>            
          <v-col cols="12" md="4">
            <v-card
              style="background-color: #ffffff; height: auto; padding: 15px;" class="mb-4 rounded-md">
              <FileUpload
                :fetchFileCounts="fetchFileCounts"
              />
              <StorageSpace/>                
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
  
<script>
import axios from '../../plugins/axios.js';
import AppDrawer from './AppDrawer.vue';
import FileCategories from './FileCategories.vue';
import SearchBox from './SearchBox.vue';
import FileUpload from './FileUpload.vue';
import StorageSpace from './StorageSpace.vue';
import FileDisplayGrid from './FileDisplayGrid.vue';
  export default {
    components: {
      AppDrawer,
      FileCategories,
      SearchBox,
      FileUpload,
      StorageSpace,
      FileDisplayGrid
    },
    data() {
      return {
        group: null,
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
        searchFiles: [],
        filesHeader: 'Files',
        searchQuery: "",
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
      
      async initialLoad() {
        try {
          await Promise.all([
            // this.fetchDiskUsage(),
            this.fetchFileCounts(),
            this.fetchUserID(),
            this.fetchPhotos()
          ]);
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      },
      async fetchFileCounts() {
        try {
          const response = await axios.get("fileServer/file-counts", { withCredentials: true });
          this.fileCounts = response.data;
        } catch (err) {
          console.error("Error fetching file counts:", err);
        }
      },
      async fetchUserID() {
        try {
          const response = await axios.get('/fileServer/userID', { withCredentials: true });
          this.userID = response.data;
        } catch (err) {
          console.error('Error fetching userID:', err);
        }
      },
      async fetchPhotos() {
        try {
          this.loading = true;
          const response = await axios.get('/fileServer/get/photos', { withCredentials: true });
          if(response.data.files){
            this.files = response.data.files; 
            this.currentCategory = 'photos'
          } else {
            this.noFiles = true;
          }
        } catch (err) {
          console.error('Error fetching images:', err);
        }finally {
          this.loading = false;
        }
      },
      updateLoading( value ) {
        this.loading = value;
      },
      updateCurrentCategory( value ) {
        this.currentCategory = value;
      },
      updateFiles( value ) {
        this.files = value;
      },
      updateSearchFiles( value ) {
        this.searchFiles = JSON.parse(JSON.stringify(value));
        // console.log(this.searchFiles)
      },
      updateFilesHeader( value ) {
        this.filesHeader = value;
      },
      updateNoFiles( value ) {
        this.noFiles = value;
      },
      async updateFileCount() {
        await this.fetchFileCounts();
      },
      emitSearchQuery( value ){
        this.searchQuery = value;
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
  