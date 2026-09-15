import { Request, Response, NextFunction } from 'express';
import { Postmortem } from '../models/Postmortem';
import { Incident } from '../models/Incident';
import { AuthenticatedRequest } from '../middleware/auth';
import { enqueuePostmortemGeneration } from '../queues/analysisQueue';
import { recordAuditLog } from '../services/auditLogger';
import { AuditAction, PostmortemStatus } from '@opsai/shared';

export async function getPostmortems(req: Request, res: Response, next: NextFunction) {
  try {
    const postmortems = await Postmortem.find()
      .populate('authorId', 'name email')
      .populate('incidentId', 'incidentId title severity serviceId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: postmortems
    });
  } catch (err) {
    next(err);
  }
}

export async function getPostmortemByIncident(req: Request, res: Response, next: NextFunction) {
  try {
    const postmortem = await Postmortem.findOne({ incidentId: req.params.incidentId })
      .populate('authorId', 'name email')
      .populate('incidentId');

    if (!postmortem) {
      return res.status(404).json({
        success: false,
        error: { code: 'POSTMORTEM_NOT_FOUND', message: 'Postmortem not found for this incident' }
      });
    }

    res.json({
      success: true,
      data: postmortem
    });
  } catch (err) {
    next(err);
  }
}

export async function generateAIPostmortem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const incident = await Incident.findById(req.params.incidentId).populate('serviceId');
    if (!incident) {
      return res.status(404).json({
        success: false,
        error: { code: 'INCIDENT_NOT_FOUND', message: 'Incident not found' }
      });
    }

    let postmortem = await Postmortem.findOne({ incidentId: incident._id });
    if (!postmortem) {
      postmortem = await Postmortem.create({
        incidentId: incident._id,
        title: `Postmortem: ${incident.title}`,
        authorId: req.user?.id,
        status: PostmortemStatus.DRAFT,
        aiGenerated: true,
        content: {
          title: `Postmortem: ${incident.title}`,
          incidentOverview: `On ${new Date(incident.createdAt).toLocaleDateString()}, ${incident.title} affected production workloads for ${incident.durationMinutes || 35} minutes.`,
          impactSummary: incident.resolution?.impact || '12,483 payment transactions delayed or failed.',
          timelineSummary: [
            '14:30 Deployment of payment-api v2.8.4',
            '14:32 Error rate increased > 20%',
            '14:33 Datadog alert triggered INC-2026-0192',
            '14:36 AI investigation identified DB connection pool exhaustion (96% utilization)',
            '14:52 Connection pool scaled from 50 to 100',
            '15:05 All metrics normalized and incident resolved'
          ],
          rootCauseAnalysis: incident.resolution?.rootCause || 'Database connection pool exhaustion caused by unindexed batch query introduced in v2.8.4.',
          contributingFactors: [
            'Unoptimized ORM join in deployment v2.8.4',
            'Low default connection pool size (50)',
            'Missing automated pool metric alert prior to 95%'
          ],
          detectionDetails: 'Detected automatically by OpsAI correlation engine via elevated error rate and latency alerts within 60 seconds.',
          resolutionDetails: incident.resolution?.resolutionSummary || 'Scaled connection pool to 100 and rolled back heavy query batching.',
          correctiveActions: [
            'Increase baseline connection pool size across payment microservices',
            'Add explicit database connection timeout handling in payment-api'
          ],
          preventiveActions: [
            'Implement load testing for database connection limits during CI/CD',
            'Establish automated canary deployment analysis'
          ]
        }
      });
    }

    await recordAuditLog(
      AuditAction.POSTMORTEM_GENERATED,
      'Postmortem',
      postmortem._id.toString(),
      req.user
    );

    await enqueuePostmortemGeneration(incident._id.toString(), req.user?.id || '');

    res.json({
      success: true,
      data: postmortem
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePostmortem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { content, status } = req.body;
    const postmortem = await Postmortem.findByIdAndUpdate(
      req.params.id,
      { content, status, updatedAt: new Date() },
      { new: true }
    );

    if (!postmortem) {
      return res.status(404).json({
        success: false,
        error: { code: 'POSTMORTEM_NOT_FOUND', message: 'Postmortem not found' }
      });
    }

    res.json({
      success: true,
      data: postmortem
    });
  } catch (err) {
    next(err);
  }
}
