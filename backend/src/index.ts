import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import menuRoutes from './routes/menuRoutes';
import orderRoutes from './routes/orderRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// error handler (last middleware)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
