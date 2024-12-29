import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors())
const port = process.env.PORT||3000;

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
  res.send('Files uploaded successfully!');
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
