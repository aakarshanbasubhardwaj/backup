import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

dotenv.config();

const app = express();
app.use(cors())
const port = process.env.PORT;

app.get('/test', (req, res) => {
  res.send('Test successful');
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
