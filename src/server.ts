import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';

import routes from './routes';
import './database';

const app = express();

app.use(express.json());
app.use(routes);

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
