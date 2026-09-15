import { Schema, model } from 'mongoose';
import { IncidentSeverity, IncidentStatus } from '@opsai/shared';

export interface IIncidentDocument extends Document {
  incidentId: string;
  title: string;
  description: string;
  serviceId: Schema.Types.ObjectId;
  environment: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  assignedEngineerId?: Schema.Types.ObjectId;
  resolvedAt?: Date;
  durationMinutes?: number;
  impactSummary?: string;
  correlatedAlertIds: string[];
  recentDeploymentId?: Schema.Types.ObjectId;
  analysisStatus: 'NONE' | 'PENDING' | 'COMPLETED' | 'FAILED';
  analysis?: {
    probableCause: string;
    confidence: number;
    confirmedEvidence: string[];
    hypotheses: string[];
    potentialImpact: string;
    recommendedInvestigation: string[];
    recommendedMitigation: string[];
  };
  resolution?: {
    rootCause: string;
    resolutionSummary: string;
    actionsTaken: string;
    impact: string;
    resolvedBy: Schema.Types.ObjectId;
    resolvedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const incidentSchema = new Schema<IIncidentDocument>(
  {
    incidentId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    environment: { type: String, default: 'Production' },
    severity: { type: String, enum: Object.values(IncidentSeverity), required: true, index: true },
    status: { type: String, enum: Object.values(IncidentStatus), default: IncidentStatus.DETECTED, index: true },
    assignedEngineerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    resolvedAt: { type: Date },
    durationMinutes: { type: Number },
    impactSummary: { type: String },
    correlatedAlertIds: [{ type: String }],
    recentDeploymentId: { type: Schema.Types.ObjectId, ref: 'Deployment' },
    analysisStatus: { type: String, enum: ['NONE', 'PENDING', 'COMPLETED', 'FAILED'], default: 'NONE' },
    analysis: {
      probableCause: String,
      confidence: Number,
      confirmedEvidence: [String],
      hypotheses: [String],
      potentialImpact: String,
      recommendedInvestigation: [String],
      recommendedMitigation: [String]
    },
    resolution: {
      rootCause: String,
      resolutionSummary: String,
      actionsTaken: String,
      impact: String,
      resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
      resolvedAt: Date
    }
  },
  { timestamps: true }
);

export const Incident = model<IIncidentDocument>('Incident', incidentSchema);
