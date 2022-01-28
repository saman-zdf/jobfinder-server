import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

import connectDB from './DB/connectDB.js';

// /in ES6 module you need to add .js extension for importing
// Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('hello world');
});
// auth router
import authRoutes from './routes/authRoutes.js';
app.use('/user', authRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('database connected');
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
