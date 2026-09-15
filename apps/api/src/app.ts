import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import alertRoutes from './routes/alertRoutes';
import incidentRoutes from './routes/incidentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import postmortemRoutes from './routes/postmortemRoutes';
import adminRoutes from './routes/adminRoutes';
import auditRoutes from './routes/auditRoutes';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/postmortems', postmortemRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/audit-logs', auditRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'healthy',
    database: dbState,
    redis: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Centralized Error Handler
app.use(errorHandler);
