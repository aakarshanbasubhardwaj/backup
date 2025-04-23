import { Router } from "express";
import { exec } from 'child_process';

const router = Router();

const getTotalDiskUsage = () => {
    return new Promise((resolve, reject) => {
        const command = "df -B1 / | awk 'NR>1 {printf \"%.2f %.2f %.2f %.1f\", $2/1024/1024/1024, $3/1024/1024/1024, $4/1024/1024/1024, ($3/$2)*100}'";
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
                return;
            }
            if (stderr) {
                reject(`Stderr: ${stderr}`);
                return;
            }

            // Parse the output string (total used available percentage)
            const [totalSize, totalUsed, totalAvailable, usagePercent] = stdout.trim().split(' ').map(Number);

            resolve({
                totalSize: `${totalSize.toFixed(2)} GB`,
                totalUsed: `${totalUsed.toFixed(2)} GB`,
                totalAvailable: `${totalAvailable.toFixed(2)} GB`,
                usagePercent: usagePercent
            });
        });
    });
};

router.get('/disk-usage', async (req, res) => {
    try {
        const totalDiskUsage = await getTotalDiskUsage();
        res.status(200).json({
            success: true,
            data: totalDiskUsage,
        });
    } catch (error) {
        console.log("Error fetching disk usage : ", error);
        res.status(500).json({
            success: false,
            error: error.toString(),
        });
    }
});

export default router;