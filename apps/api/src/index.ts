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
    try {
      await mongoose.connect(config.mongoUri);
      logger.info('Connected to primary MongoDB successfully.');
    } catch (err: any) {
      logger.warn(`Failed to connect to primary MongoDB (${config.mongoUri}): ${err.message}`);
      const fallbackUri = 'mongodb://127.0.0.1:27017/opsai';
      logger.info(`Attempting fallback connection to local MongoDB at ${fallbackUri}...`);
      await mongoose.connect(fallbackUri);
      logger.info('Connected to local fallback MongoDB successfully.');
    }

    server.listen(config.port, () => {
      logger.info(`OpsAI API Server running on port ${config.port} in ${config.env} mode.`);
    });
  } catch (err) {
    logger.error('Failed to start API server:', err);
    process.exit(1);
  }
}

startServer();
