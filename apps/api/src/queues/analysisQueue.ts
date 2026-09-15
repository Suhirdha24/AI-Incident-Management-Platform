import { Queue } from 'bullmq';
import { config } from '../config';
import { logger } from '../logger';

let analysisQueue: Queue | null = null;
let postmortemQueue: Queue | null = null;

try {
  const connection = {
    host: config.redisHost,
    port: config.redisPort,
    maxRetriesPerRequest: null
  };

  analysisQueue = new Queue('incident-analysis', { connection });
  postmortemQueue = new Queue('postmortem-generation', { connection });
} catch (err) {
  logger.warn('Redis queue connection failed. Jobs will run directly or mock mode:', err);
}

export async function enqueueIncidentAnalysis(incidentId: string) {
  if (!analysisQueue) {
    logger.warn(`Redis Queue unavailable. Incident ${incidentId} analysis will proceed synchronously or via worker direct trigger.`);
    return;
  }
  try {
    await analysisQueue.add('analyze-incident', { incidentId }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 }
    });
    logger.info(`Enqueued AI analysis for incident: ${incidentId}`);
  } catch (err) {
    logger.error(`Failed to enqueue incident analysis job:`, err);
  }
}

export async function enqueuePostmortemGeneration(incidentId: string, authorId: string) {
  if (!postmortemQueue) {
    logger.warn(`Redis Queue unavailable. Incident ${incidentId} postmortem generation will proceed.`);
    return;
  }
  try {
    await postmortemQueue.add('generate-postmortem', { incidentId, authorId }, {
      attempts: 2,
      backoff: { type: 'exponential', delay: 1000 }
    });
    logger.info(`Enqueued postmortem generation for incident: ${incidentId}`);
  } catch (err) {
    logger.error(`Failed to enqueue postmortem job:`, err);
  }
}
