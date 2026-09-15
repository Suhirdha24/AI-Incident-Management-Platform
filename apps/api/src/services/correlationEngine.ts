import { Alert, IAlertDocument } from '../models/Alert';
import { Incident, IIncidentDocument } from '../models/Incident';
import { Service } from '../models/Service';
import { IncidentEvent } from '../models/IncidentEvent';
import { calculateIncidentSeverity } from './severityEngine';
import { IncidentStatus, AlertStatus, IncidentSeverity } from '@opsai/shared';
import { broadcastEvent } from '../socket/socketServer';
import { enqueueIncidentAnalysis } from '../queues/analysisQueue';

export async function processAndCorrelateAlert(alertData: Partial<IAlertDocument>): Promise<{ alert: IAlertDocument; incident: IIncidentDocument }> {
  // 1. Save or find alert
  const service = await Service.findOne({ key: alertData.serviceKey });
  if (!service) {
    throw new Error(`Service with key ${alertData.serviceKey} not found`);
  }

  const alertId = alertData.alertId || `ALERT-${Date.now().toString().slice(-6)}`;

  const alert = await Alert.create({
    alertId,
    serviceId: service._id,
    serviceKey: service.key,
    metric: alertData.metric || 'Error Rate',
    value: alertData.value || 15,
    threshold: alertData.threshold || 5,
    severity: alertData.severity || 'HIGH',
    status: AlertStatus.TRIGGERED,
    source: alertData.source || 'Datadog',
    environment: alertData.environment || 'Production',
    timestamp: new Date()
  });

  // 2. Correlation Check: Look for open incidents in the same service/environment within last 10 mins
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  let incident = await Incident.findOne({
    serviceId: service._id,
    environment: alert.environment,
    status: { $in: [IncidentStatus.DETECTED, IncidentStatus.ACKNOWLEDGED, IncidentStatus.INVESTIGATING, IncidentStatus.MITIGATING] },
    createdAt: { $gte: tenMinutesAgo }
  });

  if (incident) {
    // Attach alert to existing correlated incident
    if (!incident.correlatedAlertIds.includes(alert.alertId)) {
      incident.correlatedAlertIds.push(alert.alertId);
      await incident.save();
    }
    alert.incidentId = incident._id as any;
    await alert.save();

    await IncidentEvent.create({
      incidentId: incident._id,
      eventType: 'ALERT_CORRELATED',
      title: 'Correlated Alert Received',
      description: `Alert ${alert.alertId} (${alert.metric}: ${alert.value}) correlated into incident.`,
      timestamp: new Date()
    });

    broadcastEvent('incident.updated', { incidentId: incident.incidentId, status: incident.status });
  } else {
    // Create new incident
    const count = await Incident.countDocuments();
    const incidentId = `INC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const calculatedSeverity = calculateIncidentSeverity(
      service.key,
      alert.metric,
      alert.value,
      alert.threshold,
      alert.severity
    );

    incident = await Incident.create({
      incidentId,
      title: `${service.name} experiencing elevated ${alert.metric.toLowerCase()}`,
      description: `Automated incident created due to threshold breach on ${service.name}. Metric ${alert.metric} reached ${alert.value} (threshold: ${alert.threshold}).`,
      serviceId: service._id,
      environment: alert.environment,
      severity: calculatedSeverity,
      status: IncidentStatus.DETECTED,
      correlatedAlertIds: [alert.alertId],
      analysisStatus: 'PENDING'
    });

    alert.incidentId = incident._id as any;
    await alert.save();

    // Increment service open incidents count
    service.openIncidentsCount += 1;
    if (calculatedSeverity === IncidentSeverity.SEV_1) {
      service.status = 'CRITICAL' as any;
    } else {
      service.status = 'DEGRADED' as any;
    }
    await service.save();

    // Log timeline event
    await IncidentEvent.create({
      incidentId: incident._id,
      eventType: 'INCIDENT_DETECTED',
      title: 'Incident Detected',
      description: `Alert ${alert.alertId} triggered incident creation. Correlated metrics: ${alert.metric}.`,
      timestamp: new Date()
    });

    // Enqueue background AI analysis job
    await enqueueIncidentAnalysis(incident._id.toString());

    broadcastEvent('alert.created', alert);
    broadcastEvent('incident.updated', { incidentId: incident.incidentId, status: incident.status });
  }

  return { alert, incident };
}
