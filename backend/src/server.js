import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import conn from '../db/connection/conn.js'
import auth from './routes/auth/index.js';
import { exec } from 'child_process';
import fs from 'fs';
dotenv.config();

const app = express();
app.use(session({ 
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,}
))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true, 
}))
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const port = process.env.PORT;
const storage_folder_path = process.env.STORAGE_FOLDER_PATH;

app.get('/test', (req, res) => {
  res.send('Test successful');
});

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
      } else if (['.pdf', '.txt', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp', '.rtf', '.csv', '.epub', '.mobi', '.chm', '.xml', '.json', '.html', '.htm', '.tex', '.yml', '.md'].includes(ext)) {
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
        cb(null, Date.now() + path.extname(file.originalname));  
      }
    });

    const upload = multer({ storage: storage });

    upload.array("files", 10)(req, res, function (err) {
      if (err) {
        console.error('Upload Error:', err);
        return res.status(500).send('Error uploading files.');
      }
      next();
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('Internal Server Error');
  }
};

app.post('/upload', dynamicUpload, (req, res) => {
  res.status(200).json({ message: `Files uploaded successfully!` });
});

app.get('/file-counts', (req, res) => {
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
});

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

app.get('/disk-usage', async (req, res) => {
  try {
    const totalDiskUsage = await getTotalDiskUsage();
    res.status(200).json({
      success: true,
      data: totalDiskUsage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.toString(),
    });
  }
});

app.use('/serve/:userId/:category', (req, res, next) => {
  const userId = req.params.userId;
  const category = req.params.category;
  const categoryFolder = path.join(`${storage_folder_path}`, userId, category);
  

  const requestedFilePath = path.join(categoryFolder, req.path.split('/').pop());


  if (fs.existsSync(requestedFilePath)) {
    return res.sendFile(requestedFilePath); 
  } else {
    return res.status(404).json({ message: 'File not found' });
  }
});


app.get('/get/:category', (req, res) => {
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
    return res.status(200).json({ files: files });
  });
});

app.get('/userID', (req, res) => {
  const userId = req.user.id;  
  return res.status(200).json(userId);
});

app.delete('/delete/file/:userId/:category/:fileName', (req, res) => {
  const { userId, category, fileName } = req.params;
  const filePath = `${storage_folder_path}/${userId}/${category}/${fileName}`;
  
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting file', error: err });
    }
    res.status(200).json({ message: 'File deleted successfully' });
  });
});


app.use("/auth", auth);

await conn.connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
