import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import multer from 'multer';
// import path from 'path';
import session from 'express-session';
import passport from 'passport';
import conn from '../db/connection/conn.js'
import auth from './routes/auth/index.js';

dotenv.config();

const app = express();
app.use(session({ secret: process.env.SECRET}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
  origin: 'http://localhost:8080', // Allow your front-end origin
  credentials: true,              // Allow cookies to be sent
}))
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store'); // Prevent browser caching
  next();
});

const port = process.env.PORT;

app.get('/test', (req, res) => {
  res.send('Test successful');
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/backend/data/backup_data');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });

// app.post('/upload', upload.array('files', 10), (req, res) => {
//   res.send('Files uploaded successfully!');
// });

app.use("/auth", auth);

await conn.connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
