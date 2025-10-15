import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import conn from '../db/connection/conn.js'
import auth from './routes/auth/index.js';
import upload from './routes/upload/index.js';
import usage from './routes/diskUsage/index.js';
import fileServer from './routes/fileServer/index.js';
import admin from './routes/admin/index.js';

dotenv.config();

const app = express();
app.use(session({ 
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: false,  
    sameSite: 'Lax', 
  }
}
))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS.split(','),
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

app.use("/auth", auth);
app.use("/upload", upload);
app.use("/usage", usage);
app.use("/fileServer", fileServer);
app.use("/admin", admin);


await conn.connectToDatabase();

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
