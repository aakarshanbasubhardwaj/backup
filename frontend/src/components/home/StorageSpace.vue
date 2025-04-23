<template>
    <v-card outlined style="background-color: #f5f9fd; color: #06367a;" class="mb-4 rounded-md">
        <v-card-text>
            <div style="font-weight: bold;">Your storage</div><br/>
            <div style="color: #111111; margin-bottom: 5px;">
            {{ diskUsage.totalUsed }} of {{ diskUsage.totalSize }} used
            </div>
            <v-progress-linear 
            v-if="diskUsage.usagePercent !== undefined"
            :model-value="diskUsage.usagePercent" 
            :height="10" 
            color="#266fd5" 
            class="rounded-lg"
            ></v-progress-linear>
            <small style="margin-top: 2px;">{{ diskUsage.usagePercent?.toFixed(1) }} % used</small>
        </v-card-text>
    </v-card>
</template>
<script>
import axios from '../../plugins/axios.js';

export default {
    data() {
        return {
            diskUsage: {
                totalSize: "0 GB",   
                totalUsed: "0 GB",
                totalAvailable: "0 GB",
                usagePercent: 0
            }
        }
    },
    mounted() {
        this.fetchDiskUsage();
    },
    methods: {
        async fetchDiskUsage() {
            try {
                const response = await axios.get("/usage/disk-usage");
                this.diskUsage = response.data.data;
            } catch (err) {
                console.error("Error fetching disk usage:", err);
            }
        }
    }
}
</script>