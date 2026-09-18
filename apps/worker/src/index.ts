import mongoose from 'mongoose';
import { Worker } from 'bullmq';
import { config } from './config';
import { logger } from './logger';
import { processIncidentAnalysisJob } from './processors/analysisProcessor';
import { processPostmortemGenerationJob } from './processors/postmortemProcessor';
import './models';

async function startWorker() {
  try {
    logger.info(`Connecting to MongoDB at ${config.mongoUri}...`);
    try {
      await mongoose.connect(config.mongoUri);
      logger.info('Worker connected to primary MongoDB successfully.');
    } catch (err: any) {
      logger.warn(`Worker failed to connect to primary MongoDB: ${err.message}`);
      const fallbackUri = 'mongodb://127.0.0.1:27017/opsai';
      logger.info(`Attempting worker fallback connection to local MongoDB at ${fallbackUri}...`);
      await mongoose.connect(fallbackUri);
      logger.info('Worker connected to local fallback MongoDB successfully.');
    }

    const connection = {
      host: config.redisHost,
      port: config.redisPort
    };

    logger.info(`Starting BullMQ Workers on Redis ${config.redisHost}:${config.redisPort}...`);

    const analysisWorker = new Worker('incident-analysis', processIncidentAnalysisJob, { connection });
    const postmortemWorker = new Worker('postmortem-generation', processPostmortemGenerationJob, { connection });

    analysisWorker.on('completed', job => {
      logger.info(`Job ${job.id} (incident-analysis) completed.`);
    });
    analysisWorker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} (incident-analysis) failed:`, err);
    });

    postmortemWorker.on('completed', job => {
      logger.info(`Job ${job.id} (postmortem-generation) completed.`);
    });
    postmortemWorker.on('failed', (job, err) => {
      logger.error(`Job ${job?.id} (postmortem-generation) failed:`, err);
    });

    logger.info('OpsAI Worker Service is active and ready to process jobs.');
  } catch (err) {
    logger.error('Worker service failed to start:', err);
  }
}

startWorker();
