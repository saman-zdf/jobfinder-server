import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

// /in ES6 module you need to add .js extention for importing
// Middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandlerMiddleware from './middleware/error-handler.js';

app.get('/', (req, res) => {
  throw new Error('error');
  res.status(200).send('hello world');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server runngin on port ${PORT}`);
});
