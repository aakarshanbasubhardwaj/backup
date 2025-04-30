import { Router } from "express";
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const router = Router();

dotenv.config();

const storage_folder_path = process.env.STORAGE_FOLDER_PATH;

router.get('/file-counts', (req, res) => {
    try {
        const userId = req.user.id;
        const userFolder = `${storage_folder_path}/${userId}`;

        const categories = ['photos', 'videos', 'audio', 'documents', 'others'];
        let fileCounts = {
            photos: 0,
            videos: 0,
            audio: 0,
            documents: 0,
            others: 0
        };

        categories.forEach((category) => {
            const categoryPath = path.join(userFolder, category);

            if (fs.existsSync(categoryPath)) {
                const files = fs.readdirSync(categoryPath);
                fileCounts[category] = files.length;
            }
        });
        return res.status(200).json(fileCounts);
    } catch ( error ) {
        console.log("Error fetching file counts : ", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.use('/serve/:userId/:category/*', (req, res, next) => {
    try {
        const userId = req.params.userId;
        const category = req.params.category;
        const fileName = decodeURIComponent(req.params[0]);
        const categoryFolder = path.join(`${storage_folder_path}`, userId, category);


        const requestedFilePath = path.join(categoryFolder, fileName);


        if (fs.existsSync(requestedFilePath)) {
            return res.sendFile(requestedFilePath); 
        } else {
            return res.status(404).json({ message: 'File not found' });
        }
    } catch ( error ) {
        console.log("Error serving file : ", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get/:category', (req, res) => {
    try {
        const userId = req.user.id; 
        const category = req.params.category;
        const userFolder = `${storage_folder_path}/${userId}/${category}`;

        if (!fs.existsSync(userFolder)) {
            return res.status(200).json({ files: null, message: `${category} folder not found` });
        }

        fs.readdir(userFolder, (err, files) => {
            if (err) {
                return res.status(500).json({ message: 'Error reading files', error: err });
            }
            const processedFiles = files.map(file => {
                const originalName = file.replace(/^\d{13}-/, ''); 
                return {
                    storedName: file,
                    originalName: originalName
                };
            });
            return res.status(200).json({ files: processedFiles });
        });
    } catch ( error ) {
        console.log("Error retrieving files : ", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/userID', (req, res) => {
    try {  
        const userId = req.user.id;  
        return res.status(200).json(userId);
    } catch ( error ) {
        console.log("Error retrieving userID : ", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete/file/:userId/:category/:fileName', (req, res) => {
    try{
        const { userId, category, fileName } = req.params;
        const filePath = `${storage_folder_path}/${userId}/${category}/${fileName}`;

        fs.unlink(filePath, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error deleting file', error: err });
            }
            res.status(200).json({ message: 'File deleted successfully' });
        });
    } catch ( error ) {
        console.log("Error deleting files : ", error);
        res.status(500).json({ message: 'Server error' });
    }
});

const getFilesRecursively = (dirPath, query) => {
    try {
        let matchingFiles = [];

        const filesAndDirs = fs.readdirSync(dirPath);

        filesAndDirs.forEach(item => {
            const itemPath = path.join(dirPath, item);

            const stats = fs.statSync(itemPath);
            if (stats.isDirectory()) {
                matchingFiles = matchingFiles.concat(getFilesRecursively(itemPath, query));
            } else {
                if (item.toLowerCase().includes(query.toLowerCase())) {
                    const folderName = path.basename(path.dirname(itemPath));
                    matchingFiles.push({ name: item, folder: folderName });
                }
            }
        });

        return matchingFiles;
    } catch ( error ) {
        console.log("Error retrieving files : ", error);
        res.status(500).json({ message: 'Server error' });
    }
    
};

router.get('/search', (req, res) => {
    try {
        const query = req.query.query;
        const storageDir = `${storage_folder_path}/${req.user.id}`;
        const matchingFiles = getFilesRecursively(storageDir, query);

        if (matchingFiles.length === 0) {
            return res.status(404).json({ message: 'No files found' });
        }

        const processedFiles = matchingFiles.map(file => {
            const originalName = file.name.replace(/^\d{13}-/, ''); 
            return {
                storedName: file.name,
                originalName: originalName,
                folder: file.folder
            };
        });
        res.status(200).json(processedFiles);
    } catch (error) {
        console.error("Error searching for files:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;