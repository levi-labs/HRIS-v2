import dotenv from 'dotenv';
import express from 'express';
import router from './routes/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { metaMiddleware } from './middlewares/meta.middleware.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(metaMiddleware);
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    }),
);

app.use('/api', router);

app.use(errorMiddleware);

export default app;
