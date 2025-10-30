import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { requestLogger, errorHandler } from './middleware';
import tryOnRoutes from './routes/tryOn';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '20'),
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(requestLogger);

app.use('/api', limiter);
app.use('/api', tryOnRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Virtual Try-On API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      tryOn: '/api/try-on',
      upload: '/api/upload'
    }
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});
