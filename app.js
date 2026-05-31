import express from 'express';
import { PORT } from './config/env.js';
import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';  
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import workflowRouter from './routes/workflow.routes.js';

// Membuat aturan rate limit
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // Waktu: 10 menit
    max: 100, // Batas maksimal: 100 request per IP selama 10 menit
    message: 'Too Many Requests',
    standardHeaders: false, // Mengirim informasi rate limit di header `RateLimit-*`
    legacyHeaders: false, // Mematikan header `X-RateLimit-*` yang lama
});
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended : false }));
app.use(cookieParser());
app.use('/api', apiLimiter);
app.use(helmet());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/workflows', workflowRouter);

app.use(errorMiddleware);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, async () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
  await connectDB();
});