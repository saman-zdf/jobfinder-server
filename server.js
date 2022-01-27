import express from 'express';
const app = express();

// /in ES6 module you need to add .js extention for importing
import notFoundMiddleware from './middleware/not-found.js';

app.get('/', (req, res) => {
  res.status(200).send('hello world');
});
// Middleware
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('server running on port 5000');
});
