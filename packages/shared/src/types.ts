import { z } from 'zod';
import {
  UserRole,
  IncidentSeverity,
  IncidentStatus,
  AlertSeverity,
  AlertStatus,
  ServiceStatus,
  PostmortemStatus,
  AuditAction
} from './constants';
import {
  IncidentAnalysisSchema,
  PostmortemSchema
} from './schemas';

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: 'ACTIVE' | 'DISABLED';
  createdAt?: string;
}

export interface IService {
  id: string;
  name: string;
  key: string;
  description: string;
  status: ServiceStatus;
  environment: string;
  ownerTeam: string;
  repository: string;
  techStack: string;
  openIncidentsCount: number;
}

export interface IAlert {
  id: string;
  alertId: string;
  serviceId: string;
  serviceKey?: string;
  metric: string;
  value: number;
  threshold: number;
  severity: AlertSeverity;
  status: AlertStatus;
  incidentId?: string;
  source: string;
  environment: string;
  timestamp: string;
}

export interface IDeployment {
  id: string;
  serviceId: string;
  serviceKey: string;
  version: string;
  environment: string;
  deployedAt: string;
  deployedBy: string;
  commitHash: string;
  changes: string;
}

export interface IMetricPoint {
  timestamp: string;
  errorRate: number;
  latencyMs: number;
  cpuPercent: number;
  memoryPercent: number;
  dbConnectionsPercent: number;
}

export interface IIncidentEvent {
  id: string;
  incidentId: string;
  eventType: string;
  title: string;
  description: string;
  createdBy?: string;
  timestamp: string;
}

export interface IIncidentComment {
  id: string;
  incidentId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  text: string;
  isNote: boolean;
  createdAt: string;
}

export type IIncidentAnalysis = z.infer<typeof IncidentAnalysisSchema>;

export interface ISimilarIncident {
  incidentId: string;
  title: string;
  similarityScore: number;
  rootCause: string;
  resolution: string;
}

export interface IIncident {
  id: string;
  incidentId: string;
  title: string;
  description: string;
  serviceId: string;
  serviceName?: string;
  serviceKey?: string;
  environment: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedEngineerId?: string;
  assignedEngineerName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  durationMinutes?: number;
  impactSummary?: string;
  correlatedAlertIds: string[];
  recentDeploymentId?: string;
  analysisStatus: 'NONE' | 'PENDING' | 'COMPLETED' | 'FAILED';
  analysis?: IIncidentAnalysis;
  resolution?: {
    rootCause: string;
    resolutionSummary: string;
    actionsTaken: string;
    impact: string;
    resolvedBy: string;
    resolvedAt: string;
  };
}

export type IPostmortemContent = z.infer<typeof PostmortemSchema>;

export interface IPostmortem {
  id: string;
  incidentId: string;
  incidentTitle: string;
  serviceName: string;
  severity: IncidentSeverity;
  authorId: string;
  authorName: string;
  status: PostmortemStatus;
  aiGenerated: boolean;
  content: IPostmortemContent;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
}

export interface INotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  read: boolean;
  createdAt: string;
  link?: string;
}
