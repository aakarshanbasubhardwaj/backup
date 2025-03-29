<template>
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
</template>
<script>
import axios from '../../plugins/axios.js';

export default {
    props: {
        fileCounts: Object
    },
    methods: {
        async fetch(category) {
            try {
            this.$emit('update-loading', true)
            this.$emit('update-currentCategory', category)

            this.$emit('update-files', [])

            this.$emit('update-searchFiles', [])

            this.searchQuery = ''
            this.$emit('update-filesHeader', 'Files')

            const response = await axios.get(`/fileServer/get/${category}`, { withCredentials: true });
            if(response.data.files){
            this.$emit('update-files', response.data.files)

                this.noFiles = false;
            this.$emit('update-noFiles', false)

            } else {
                console.log("no files");
            this.$emit('update-files', [])

            this.$emit('update-noFiles', true)

            }
            } catch (err) {
            console.error('Error fetching images:', err);
            } finally {
            this.$emit('update-loading', false)
            }
        },
    }
}

</script>

<style>

</style>