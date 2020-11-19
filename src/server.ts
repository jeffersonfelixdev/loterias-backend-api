import 'dotenv/config';
import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import AppError from './errors/AppError';
import connectDatabase from './database';
import routes from './routes';

connectDatabase();

const app = express();

app.use(express.json());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  console.error(err.message);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
