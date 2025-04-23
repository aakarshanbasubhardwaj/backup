import { Router } from "express";
import { exec } from 'child_process';

const router = Router();

const getTotalDiskUsage = () => {
    return new Promise((resolve, reject) => {
        exec('df -h', (error, stdout, stderr) => {
        if (error) {
            reject(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            reject(`Stderr: ${stderr}`);
            return;
        }

        const lines = stdout.trim().split('\n').slice(1);
        let totalSize = 0;
        let totalUsed = 0;
        let totalAvailable = 0;

        lines.forEach(line => {
            const columns = line.split(/\s+/);
            if (columns.length < 6) {
            return;
            }
            const size = columns[1];
            const used = columns[2];
            const available = columns[3];

            totalSize += parseSize(size);
            totalUsed += parseSize(used);
            totalAvailable += parseSize(available);
        });

        resolve({
            totalSize: formatSize(totalSize),
            totalUsed: formatSize(totalUsed),
            totalAvailable: formatSize(totalAvailable),
        });
        });
    });
};

const parseSize = sizeStr => {
    if (!sizeStr || typeof sizeStr !== 'string') {
        return 0; 
    }

    const unit = sizeStr.slice(-1); 
    const value = parseFloat(sizeStr.slice(0, -1));

    if (unit === 'G') return value; 
    if (unit === 'M') return value / 1024; 
    if (unit === 'T') return value * 1024; 

    return 0;
};

const formatSize = sizeInGB => {
    if (sizeInGB >= 1024) return `${(sizeInGB / 1024).toFixed(2)}TB`; 
        return `${sizeInGB.toFixed(2)}GB`; 
};

router.get('/disk-usage', async (req, res) => {
    try {
        const totalDiskUsage = await getTotalDiskUsage();
        res.status(200).json({
        success: true,
        data: totalDiskUsage,
        });
    } catch ( error ) {
        console.log("Error fetching disk usage : ", error);
        res.status(500).json({
        success: false,
        error: error.toString(),
        });
    }
});

export default router;