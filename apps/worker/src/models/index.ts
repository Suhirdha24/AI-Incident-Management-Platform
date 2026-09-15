import { Schema, model, models } from 'mongoose';
import { IncidentSeverity, IncidentStatus, AlertSeverity, AlertStatus, ServiceStatus, PostmortemStatus } from '@opsai/shared';

const serviceSchema = new Schema({
  name: String,
  key: String,
  description: String,
  status: String,
  environment: String,
  ownerTeam: String,
  repository: String,
  techStack: String,
  openIncidentsCount: Number
}, { timestamps: true });

const alertSchema = new Schema({
  alertId: String,
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
  serviceKey: String,
  metric: String,
  value: Number,
  threshold: Number,
  severity: String,
  status: String,
  incidentId: { type: Schema.Types.ObjectId, ref: 'Incident' },
  source: String,
  environment: String,
  timestamp: Date
}, { timestamps: true });

const incidentSchema = new Schema({
  incidentId: String,
  title: String,
  description: String,
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
  environment: String,
  severity: String,
  status: String,
  assignedEngineerId: { type: Schema.Types.ObjectId, ref: 'User' },
  resolvedAt: Date,
  durationMinutes: Number,
  impactSummary: String,
  correlatedAlertIds: [String],
  recentDeploymentId: { type: Schema.Types.ObjectId, ref: 'Deployment' },
  analysisStatus: String,
  analysis: Schema.Types.Mixed,
  resolution: Schema.Types.Mixed
}, { timestamps: true });

const deploymentSchema = new Schema({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
  serviceKey: String,
  version: String,
  environment: String,
  deployedAt: Date,
  deployedBy: String,
  commitHash: String,
  changes: String
}, { timestamps: true });

const metricSchema = new Schema({
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
  timestamp: Date,
  errorRate: Number,
  latencyMs: Number,
  cpuPercent: Number,
  memoryPercent: Number,
  dbConnectionsPercent: Number
}, { timestamps: true });

const incidentEventSchema = new Schema({
  incidentId: { type: Schema.Types.ObjectId, ref: 'Incident' },
  eventType: String,
  title: String,
  description: String,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  timestamp: Date
}, { timestamps: true });

const auditLogSchema = new Schema({
  timestamp: Date,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  action: String,
  resourceType: String,
  resourceId: String,
  metadata: Schema.Types.Mixed
}, { timestamps: true });

const postmortemSchema = new Schema({
  incidentId: { type: Schema.Types.ObjectId, ref: 'Incident' },
  title: String,
  authorId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: String,
  aiGenerated: Boolean,
  content: Schema.Types.Mixed
}, { timestamps: true });

export const Service = models.Service || model('Service', serviceSchema);
export const Alert = models.Alert || model('Alert', alertSchema);
export const Incident = models.Incident || model('Incident', incidentSchema);
export const Deployment = models.Deployment || model('Deployment', deploymentSchema);
export const Metric = models.Metric || model('Metric', metricSchema);
export const IncidentEvent = models.IncidentEvent || model('IncidentEvent', incidentEventSchema);
export const AuditLog = models.AuditLog || model('AuditLog', auditLogSchema);
export const Postmortem = models.Postmortem || model('Postmortem', postmortemSchema);
