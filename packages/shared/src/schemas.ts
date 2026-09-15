import { z } from 'zod';
import { UserRole, IncidentSeverity, IncidentStatus, AlertSeverity, AlertStatus, ServiceStatus, PostmortemStatus } from './constants';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).default(UserRole.ENGINEER)
});

export const CreateServiceSchema = z.object({
  name: z.string().min(2),
  key: z.string().min(2),
  description: z.string(),
  environment: z.string().default('Production'),
  ownerTeam: z.string(),
  repository: z.string(),
  techStack: z.string()
});

export const CreateAlertSchema = z.object({
  alertId: z.string().optional(),
  serviceKey: z.string(),
  metric: z.string(),
  value: z.number(),
  threshold: z.number(),
  severity: z.nativeEnum(AlertSeverity),
  environment: z.string().default('Production'),
  source: z.string().default('Datadog')
});

export const CreateIncidentSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  serviceId: z.string(),
  environment: z.string().default('Production'),
  severity: z.nativeEnum(IncidentSeverity),
  correlatedAlertIds: z.array(z.string()).optional()
});

export const UpdateIncidentStatusSchema = z.object({
  status: z.nativeEnum(IncidentStatus)
});

export const UpdateIncidentSeveritySchema = z.object({
  severity: z.nativeEnum(IncidentSeverity)
});

export const AssignIncidentSchema = z.object({
  engineerId: z.string()
});

export const CreateCommentSchema = z.object({
  text: z.string().min(1),
  isNote: z.boolean().default(false)
});

export const ResolveIncidentSchema = z.object({
  rootCause: z.string().min(5),
  resolutionSummary: z.string().min(5),
  actionsTaken: z.string().min(5),
  impact: z.string().min(5)
});

// Zod Schema for AI Incident Analysis Output Validation
export const IncidentAnalysisSchema = z.object({
  probableCause: z.string().min(3),
  confidence: z.number().min(0).max(1),
  confirmedEvidence: z.array(z.string()),
  hypotheses: z.array(z.string()),
  potentialImpact: z.string(),
  recommendedInvestigation: z.array(z.string()),
  recommendedMitigation: z.array(z.string())
});

// Zod Schema for AI Postmortem Output Validation
export const PostmortemSchema = z.object({
  title: z.string(),
  incidentOverview: z.string(),
  impactSummary: z.string(),
  timelineSummary: z.array(z.string()),
  rootCauseAnalysis: z.string(),
  contributingFactors: z.array(z.string()),
  detectionDetails: z.string(),
  resolutionDetails: z.string(),
  correctiveActions: z.array(z.string()),
  preventiveActions: z.array(z.string())
});

export const AIQuestionSchema = z.object({
  question: z.string().min(3)
});
