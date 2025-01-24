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

app.get('/test', (req, res) => {
  res.send('Test successful');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/backend/data/backup_data');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.array('files', 10), (req, res) => {
  // res.send('Files uploaded successfully!');
  res.status(200).json({ message: 'Files uploaded successfully!' });
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

      // Parse the output of df
      const lines = stdout.trim().split('\n').slice(1); // Ignore header line
      let totalSize = 0;
      let totalUsed = 0;
      let totalAvailable = 0;

      lines.forEach(line => {
        const columns = line.split(/\s+/);
        const size = columns[1]; // Total size
        const used = columns[2]; // Used space
        const available = columns[3]; // Available space

        // Parse sizes (e.g., 50G, 30G) into numeric values
        totalSize += parseSize(size);
        totalUsed += parseSize(used);
        totalAvailable += parseSize(available);
      });

      // Construct the final response
      resolve({
        totalSize: formatSize(totalSize),
        totalUsed: formatSize(totalUsed),
        totalAvailable: formatSize(totalAvailable),
      });
    });
  });
};

// Helper to parse size strings like "50G", "30M" into numbers (in GB)
const parseSize = sizeStr => {
  const unit = sizeStr.slice(-1); // Last character (e.g., G, M)
  const value = parseFloat(sizeStr.slice(0, -1)); // Numeric part
  if (unit === 'G') return value; // Gigabytes
  if (unit === 'M') return value / 1024; // Megabytes to GB
  if (unit === 'T') return value * 1024; // Terabytes to GB
  return 0; // Default to 0 if unrecognized
};

// Helper to format sizes back to human-readable strings
const formatSize = sizeInGB => {
  if (sizeInGB >= 1024) return `${(sizeInGB / 1024).toFixed(2)}TB`; // Terabytes
  return `${sizeInGB.toFixed(2)}GB`; // Gigabytes
};

// Example usage in an Express route

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


app.use("/auth", auth);

await conn.connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
