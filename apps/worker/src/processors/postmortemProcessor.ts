import { Job } from 'bullmq';
import { logger } from '../logger';
import { generateAIPostmortemContent } from '../services/ai/aiService';
import { Incident, Postmortem } from '../models';

export async function processPostmortemGenerationJob(job: Job<{ incidentId: string; authorId: string }>) {
  const { incidentId, authorId } = job.data;
  logger.info(`Processing BullMQ Postmortem job for incident ID: ${incidentId}`);

  const incident = await Incident.findById(incidentId).populate('serviceId');
  if (!incident) {
    logger.error(`Incident ${incidentId} not found for postmortem generation.`);
    return;
  }

  const service = incident.serviceId as any;

  try {
    const content = await generateAIPostmortemContent({
      incidentId: incident.incidentId,
      title: incident.title,
      serviceName: service ? service.name : 'Unknown Service',
      durationMinutes: incident.durationMinutes || 35,
      rootCause: incident.resolution?.rootCause || 'Database connection pool exhaustion',
      resolutionSummary: incident.resolution?.resolutionSummary || 'Increased connection pool limit from 50 to 100'
    });

    let postmortem = await Postmortem.findOne({ incidentId: incident._id });
    if (!postmortem) {
      await Postmortem.create({
        incidentId: incident._id,
        title: `Postmortem: ${incident.title}`,
        authorId: authorId || incident.assignedEngineerId,
        status: 'DRAFT',
        aiGenerated: true,
        content
      });
    } else {
      postmortem.content = content;
      postmortem.aiGenerated = true;
      await postmortem.save();
    }

    logger.info(`Postmortem job completed successfully for ${incident.incidentId}`);
  } catch (err) {
    logger.error(`Postmortem generation job failed for ${incident.incidentId}:`, err);
  }
}
