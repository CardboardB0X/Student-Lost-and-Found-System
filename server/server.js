import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { getDBStatus } from './config/db.js';
import itemRoutes from './routes/itemRoutes.js';
import authRoutes from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory first, fallback to current dir
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Universal CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve sample item photos statically if requested through backend
app.use('/sample-items', express.static(path.join(__dirname, '../client/public/sample-items')));

// Body parsers with 10mb limit for image uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware to ensure DB connection for all API routes in serverless
app.use('/api', async (req, res, next) => {
  if (!getDBStatus()) {
    try {
      await connectDB();
    } catch (err) {
      console.error('[DB Connect Error]:', err.message);
    }
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: getDBStatus() ? 'connected' : 'disconnected',
    service: 'LostRadar API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

// 404 Route Handler for undefined API endpoints
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// Custom Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.message);

  const statusCode = err.status || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Start Server listening on port 5000 if not in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[LostRadar API Running]: http://localhost:${PORT} and http://127.0.0.1:${PORT}`);
  });
}

export default app;
