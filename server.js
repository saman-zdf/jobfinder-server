import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

import connectDB from './databse/connectDB.js';

// /in ES6 module you need to add .js extention for importing
// Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.get('/', (req, res) => {
  res.status(200).send('hello world');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('database connected');
    app.listen(PORT, () => {
      console.log(`server runngin on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
