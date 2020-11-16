import dotenv from 'dotenv';
import express from 'express';

import routes from './routes';

dotenv.config();

const app = express();

app.use(express.json());
app.use(routes);

const { PORT } = process.env;

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
