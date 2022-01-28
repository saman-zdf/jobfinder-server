import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
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
// auth routes
import authRoutes from './routes/authRoutes.js';
app.use('/auth', authRoutes);

// job routes
import jobRoutes from './routes/jobRoutes.js';
app.use('/job', jobRoutes);

// it does not need to be invoked, it just need to be used as a middleware
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
