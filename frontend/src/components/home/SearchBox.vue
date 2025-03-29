<template>
    <v-card style="height: auto;" class="rounded-pill">
        <v-text-field
            label="Search"
            clearable
            hide-details
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            v-model="searchQuery"
            @input="handleSearch"
        ></v-text-field>
    </v-card>
</template>

<script>

import axios from '../../plugins/axios.js';

export default {
    data() {
        return {
            searchQuery: '',
        }
    },
    props: {
        fetchPhotos: Function,
    },
    methods: {
        async handleSearch() {
            try {

            this.$emit('update-loading', true)
            this.$emit('update-searchFiles', [])
            this.$emit('update-files', [])
            this.$emit('update-filesHeader', 'Search Results')
            
            if (this.searchQuery.trim() !== '') {
                try {
                const response = await axios.get(`/fileServer/search?query=${this.searchQuery}`, { withCredentials: true });
                this.$emit('update-searchFiles', response.data)

                } catch (error) {
                console.error("Error searching for files:", error);
                }
            } else {
                this.$emit('update-searchFiles', [])
                
                this.$emit('update-filesHeader', 'Files')

                this.fetchPhotos();
            }
            } catch (error) {
            console.log(error);
            } finally {
            this.$emit('update-loading', false)
            }
        },
    }
}


</script>

<style>

</style>