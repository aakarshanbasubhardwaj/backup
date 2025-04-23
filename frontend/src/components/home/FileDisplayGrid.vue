<template>
  <div>
                  <!-- <v-alert v-if="noFiles" type="error" dismissible closable>
                    No {{ currentCategory }} found!
                  </v-alert> -->
                  <v-progress-circular
                    v-if="loading"
                    :size="75"
                    :width="7"
                    color="blue"
                    indeterminate
                  />
                </div>
    <v-row class="mt-4 image-container" v-if="files.length">
                
                <v-col
                  v-for="(file, index) in localFiles"
                  :key="index"
                  class="d-flex child-flex"
                  cols="6" sm="4" md="4"
                >
                  <v-img
                    v-if="currentCategory === 'photos'"
                    :src="`${baseURL}/fileServer/serve/${userID}/photos/${file.storedName}`"
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
                        <v-list-item @click="downloadWithAxios(`${baseURL}/fileServer/serve/${userID}/photos/${encodeURIComponent(file.storedName)}`, file.storedName)">
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
                        <v-list-item @click="downloadWithAxios(`${baseURL}/fileServer/serve/${userID}/documents/${encodeURIComponent(file.storedName)}`, file.storedName)">
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
                        <v-list-item @click="downloadWithAxios(`${baseURL}/fileServer/serve/${userID}/videos/${encodeURIComponent(file.storedName)}`, file.storedName)">
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
                        <v-list-item @click="downloadWithAxios(`${baseURL}/fileServer/serve/${userID}/audio/${encodeURIComponent(file.storedName)}`, file.storedName)">
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

              <v-row v-else>
                <v-col v-if="searchFiles.length">
                  <v-list>
                    <v-list-item v-for="file in searchFiles" :key="file._id">
                        <v-list-item-title>{{ file.originalName }}</v-list-item-title>
                        <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn color="white" icon="mdi-dots-vertical" variant="text" v-bind="props" @click.stop
                        style="position: absolute; top: 10px; right: 10px; background-color: rgba(0, 0, 0, 0.5);"></v-btn>
                      </template>

                      <v-list>
                        <v-list-item @click="downloadWithAxios(`${baseURL}/fileServer/serve/${userID}/${file.folder}/${encodeURIComponent(file.storedName)}`, file.storedName)">
                          <v-list-item-title>Download</v-list-item-title>
                      </v-list-item>

                        <!-- <v-list-item @click="deleteFile(file)">
                          <v-list-item-title>Delete</v-list-item-title>
                        </v-list-item> -->
                      </v-list>
                    </v-menu>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col v-else>
                  <span>No matching files found.</span>
                </v-col>
              </v-row>

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

</template>

<script>
import axios from '../../plugins/axios.js';


export default {
    props: {
        noFiles: Boolean,
        loading: Boolean,
        files: Array,
        currentCategory: String,
        searchFiles: Array,
        searchQuery: String,
    },
    mounted() {
        this.fetchUserID();
    },
    data() {
        return {
            userID: null,
            fullScreenImage: "",
            deleteDialog: false,
            localFiles: this.files.slice(),
            baseURL: process.env.VUE_APP_ENV,
            dialog: false,
        }
    },

    watch: {
        files(newFiles) {
            this.localFiles = newFiles.slice();  
        },
    },
    
    methods: {
        openFullScreen(file) {
        this.fullScreenImage = `${this.baseURL}/fileServer/serve/${this.userID}/photos/${file}`;
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
      async fetchUserID() {
        try {
          const response = await axios.get('/fileServer/userID', { withCredentials: true });
          this.userID = response.data;
        } catch (err) {
          console.error('Error fetching userID:', err);
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
          const response = await axios.delete(`/fileServer/delete/file/${this.userID}/${this.currentCategory}/${file.storedName}`);

          if (response.status === 200) {    
            const index = this.localFiles.indexOf(file);
            if (index !== -1) {
              this.localFiles.splice(index, 1); 
            }
            await this.$emit('update-FileCount');
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
    }
}

</script>
