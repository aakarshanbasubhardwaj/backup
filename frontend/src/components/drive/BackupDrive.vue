<template>
    <v-container fluid fill-height>
      <v-row class="row">
        <v-col
          cols="12"
          sm="8"
          md="6"
          lg="4"
          class="text-center"
        >
          <v-file-input
            v-model="files"
            label="Select files to upload"
            multiple
            outlined
            class="mb-4"
          ></v-file-input>
  
          <v-btn
            color="primary"
            @click="uploadFiles"
            :disabled="!files.length"
            class="mb-4"
          >
            Upload Files
          </v-btn>
  
          <v-alert v-if="uploadStatus" :type="uploadStatus.type" dismissible>
            {{ uploadStatus.message }}
          </v-alert>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        files: [],
        uploadStatus: null
      };
    },
    methods: {
      handleFileUpload(event) {
        this.files = event.target.files;
      },
      async uploadFiles() {
        const formData = new FormData();
        for (const file of this.files) {
          formData.append('files', file);
        }
  
        try {
          const response = await fetch('http://10.144.113.16:3000/upload', {
            method: 'POST',
            body: formData
          });
          if (response.ok) {
            this.uploadStatus = {
              type: 'success',
              message: 'Files uploaded successfully!'
            };
          } else {
            this.uploadStatus = {
              type: 'error',
              message: 'File upload failed!'
            };
          }
        } catch (error) {
          this.uploadStatus = {
            type: 'error',
            message: 'Error uploading files: ' + error.message
          };
        }
      }
    }
  };
  </script>
  
  <style>
  .row{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
  </style>