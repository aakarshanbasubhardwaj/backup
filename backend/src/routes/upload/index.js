import { Router } from "express";
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { processMultipleFiles } from '../../services/processingQueue.js';
import File from '../../../db/models/metadata.js';

const router = Router();

dotenv.config();

const storage_folder_path = process.env.STORAGE_FOLDER_PATH;

const dynamicUpload = (req, res, next) => {
    try {
        const userFolder = `${storage_folder_path}/${req.user.id}`;

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder, { recursive: true });
            console.log('User folder created successfully');
        }

        const getCategoryFolder = (file) => {
            const ext = path.extname(file.originalname).toLowerCase();

            if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.heic', '.heif', '.webp', '.svg', '.raw', '.ico', '.jfif', '.dng', '.exr'].includes(ext)) {
                return 'photos';
            } else if (['.mp4', '.mkv', '.avi', '.mov', '.flv', '.webm', '.hevc', '.wmv', '.mpg', '.mpeg', '.3gp', '.vob', '.ts', '.rm', '.rmvb', '.ogv'].includes(ext)) {
                return 'videos';
            } else if (['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma', '.alac', '.aiff', '.ape', '.opus', '.midi', '.mka'].includes(ext)) {
                return 'audio';
            } else if (['.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp', '.csv', '.xml', '.json', '.html', '.htm', '.tex', '.yml', '.md', '.js'].includes(ext)) {
                return 'documents';
            } else {
                return 'others';
            }
        };

        const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const categoryFolder = getCategoryFolder(file);
            const categoryPath = path.join(userFolder, categoryFolder);

            if (!fs.existsSync(categoryPath)) {
                fs.mkdirSync(categoryPath, { recursive: true });
                console.log(`Category folder '${categoryFolder}' created.`);
            }

            cb(null, categoryPath);  
        },
        filename: function (req, file, cb) {
            cb(null, `${Date.now()}-${file.originalname}`);  
        }
        });

        const upload = multer({ storage: storage });

        upload.array("files")(req, res, function (err) {
            if (err) {
                console.error('Upload Error:', err);
                return res.status(500).send('Error uploading files.');
            }
            next();
        });

    } catch ( error ) {
        console.error('Error uploading files :', error);
        return res.status(500).send('Internal Server Error');
    }
};

router.post('/uploadFiles', dynamicUpload, async (req, res) => {
    try {
        const fileIds = [];
        
        // Store file information in MongoDB
        for (const file of req.files) {
            const fileDoc = new File({
                filename: file.filename,
                originalname: file.originalname,
                path: file.path,
                size: file.size,
                mimetype: file.mimetype,
                userId: req.user.id,
                ps: {
                    p: false,
                    n: 0,
                    a: new Date()
                }
            });
            
            const savedFile = await fileDoc.save();
            fileIds.push(savedFile._id);
        }
        
        // Process metadata for all files in parallel
        processMultipleFiles(fileIds).catch(error => {
            console.error('Error processing metadata:', error);
        });
        
        res.status(200).json({ message: `Files uploaded successfully!` });
    } catch (error) {
        console.error('Error processing files:', error);
        res.status(500).json({ error: 'Error processing files' });
    }
});

export default router;