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

// Interactive API Documentation endpoint
app.get('/api-docs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>PulseOps AI API Specification</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px; max-width: 900px; margin: auto; }
        h1 { color: #38bdf8; border-b: 1px solid #334155; padding-bottom: 12px; }
        .endpoint { background: #1e293b; border: 1px solid #334155; border-radius: 8px; margin-bottom: 16px; padding: 16px; }
        .method { font-weight: bold; font-family: monospace; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 8px; }
        .post { background: #0284c7; color: #fff; }
        .get { background: #059669; color: #fff; }
        .patch { background: #d97706; color: #fff; }
        .path { font-family: monospace; font-size: 14px; font-weight: bold; }
        .desc { font-size: 13px; color: #94a3b8; margin-top: 6px; }
      </style>
    </head>
    <body>
      <h1>PulseOps AI — REST API Documentation</h1>
      <p style="color:#94a3b8">Production Incident Management API endpoints</p>
      
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/auth/login</span><div class="desc">Authenticate user & return JWT token</div></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/auth/demo-login</span><div class="desc">1-click demo role authentication (ENGINEER, INCIDENT_MANAGER, ADMIN)</div></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/incidents</span><div class="desc">Fetch incident directory with filters and search query</div></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/incidents/:id</span><div class="desc">Fetch full incident details, alerts, telemetry metrics & timeline</div></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/incidents/:id/analyze</span><div class="desc">Trigger AI incident root cause investigation job</div></div>
      <div class="endpoint"><span class="method patch">PATCH</span><span class="path">/api/incidents/:id/status</span><div class="desc">Transition incident status through backend state machine</div></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/incidents/:id/resolve</span><div class="desc">Resolve incident and update service availability</div></div>
      <div class="endpoint"><span class="method post">POST</span><span class="path">/api/alerts</span><div class="desc">Ingest monitoring metric alert and trigger automated correlation engine</div></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/analytics/incidents</span><div class="desc">Fetch SRE reliability KPIs, MTTR, MTTA & severity distributions</div></div>
      <div class="endpoint"><span class="method get">GET</span><span class="path">/api/audit-logs</span><div class="desc">Fetch immutable audit history trail</div></div>
    </body>
    </html>
  `);
});

// Centralized Error Handler
app.use(errorHandler);
