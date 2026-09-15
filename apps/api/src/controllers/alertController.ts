import { Request, Response, NextFunction } from 'express';
import { Alert } from '../models/Alert';
import { processAndCorrelateAlert } from '../services/correlationEngine';
import { AuthenticatedRequest } from '../middleware/auth';
import { AlertStatus } from '@opsai/shared';

export async function createAlert(req: Request, res: Response, next: NextFunction) {
  try {
    const { alert, incident } = await processAndCorrelateAlert(req.body);
    res.status(201).json({
      success: true,
      data: {
        alert,
        correlatedIncidentId: incident.incidentId
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAlerts(req: Request, res: Response, next: NextFunction) {
  try {
    const { serviceId, severity, status } = req.query;
    const filter: any = {};
    if (serviceId) filter.serviceId = serviceId;
    if (severity) filter.severity = severity;
    if (status) filter.status = status;

    const alerts = await Alert.find(filter).populate('serviceId', 'name key').sort({ timestamp: -1 });
    res.json({
      success: true,
      data: alerts
    });
  } catch (err) {
    next(err);
  }
}

export async function getAlertById(req: Request, res: Response, next: NextFunction) {
  try {
    const alert = await Alert.findById(req.params.id).populate('serviceId', 'name key');
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: { code: 'ALERT_NOT_FOUND', message: 'Alert not found' }
      });
    }
    res.json({
      success: true,
      data: alert
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAlertStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;
    const alert = await Alert.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!alert) {
      return res.status(404).json({
        success: false,
        error: { code: 'ALERT_NOT_FOUND', message: 'Alert not found' }
      });
    }
    res.json({
      success: true,
      data: alert
    });
  } catch (err) {
    next(err);
  }
}
