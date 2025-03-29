<template>
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
</template>
<script>
import axios from '../../plugins/axios.js';

export default {
    data() {
        return {
            diskUsage: {
                totalSize: "0 GB",   
                totalUsed: "0 GB",   
            },
            progress: 0,
        }
    },
    mounted() {
        this.fetchDiskUsage();
    },
    methods: {
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
        async fetchDiskUsage() {
        try {
          const response = await axios.get("/usage/disk-usage");
          this.diskUsage = response.data.data;
          
          const used = this.parseSize(this.diskUsage.totalUsed);
          const total = this.parseSize(this.diskUsage.totalSize);

          this.progress = (used / total) * 100;
        } catch (err) {
          console.error("Error fetching disk usage:", err);
        }
      },
    }
}
</script>