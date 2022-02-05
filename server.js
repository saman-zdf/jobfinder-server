import express from 'express';
import dotenv from 'dotenv';
import 'express-async-errors';
import morgan from 'morgan';
dotenv.config();
const app = express();

import connectDB from './DB/connectDB.js';

// /in ES6 module you need to add .js extension for importing
// Middleware
import notFoundMiddleware from './middleware/not-found.js';
import authenticateUser from './middleware/auth.js';
import errorHandlerMiddleware from './middleware/error-handler.js';
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ msg: 'Welcome to dashboard page' });
});
app.get('/api/v1', (req, res) => {
  res.status(200).json({ msg: 'API' });
});
// auth routes
import authRoutes from './routes/authRoutes.js';
app.use('/api/v1/auth', authRoutes);

// job routes
import jobRoutes from './routes/jobRoutes.js';
app.use('/api/v1/job', authenticateUser, jobRoutes);

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
