import { readFile } from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './DB/connectDB.js';
import Job from './model/Job.js';

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await Job.deleteMany();
    // to populate DB
    const jsonProducts = JSON.parse(
      await readFile(new URL('./mock-data.json', import.meta.url))
    );
    // create all item at the same time
    await Job.create(jsonProducts);
    console.log('Success');
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
