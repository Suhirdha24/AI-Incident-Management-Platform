import http from 'http';
import mongoose from 'mongoose';
import { app } from './app';
import { config } from './config';
import { logger } from './logger';
import { initSocketServer } from './socket/socketServer';

const server = http.createServer(app);

// Initialize Socket.IO
initSocketServer(server);

async function startServer() {
  try {
    logger.info(`Connecting to MongoDB at ${config.mongoUri}...`);
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB successfully.');

    server.listen(config.port, () => {
      logger.info(`OpsAI API Server running on port ${config.port} in ${config.env} mode.`);
    });
  } catch (err) {
    logger.error('Failed to start API server:', err);
    process.exit(1);
  }
}

startServer();
