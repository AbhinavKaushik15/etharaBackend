import express from 'express';
import connectToMongo from './database/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// DB connect
connectToMongo();

// middleware
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// listen
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
