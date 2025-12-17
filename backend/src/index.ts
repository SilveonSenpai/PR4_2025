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

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);

// health
app.get('/health', (_req, res) => res.json({ ok: true }));

// error handler (last middleware)
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();



