<template>
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
</template>
<script>
import axios from '../../plugins/axios.js';


export default {
    data () {
        return {
            filesToUpload: [],
            uploadStatus: null,
            uploadProgress: 0,
        }
    },
    props: {
        fetchFileCounts: Function,
    },
    methods: {
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
          const response = await axios.post(`${process.env.VUE_APP_ENV}/upload/uploadFiles`, formData, {
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
    }
}

</script>