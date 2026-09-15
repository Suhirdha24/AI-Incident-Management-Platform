import { Schema, model } from 'mongoose';
import { PostmortemStatus } from '@opsai/shared';

export interface IPostmortemDocument extends Document {
  incidentId: Schema.Types.ObjectId;
  title: string;
  authorId: Schema.Types.ObjectId;
  status: PostmortemStatus;
  aiGenerated: boolean;
  content: {
    title: string;
    incidentOverview: string;
    impactSummary: string;
    timelineSummary: string[];
    rootCauseAnalysis: string;
    contributingFactors: string[];
    detectionDetails: string;
    resolutionDetails: string;
    correctiveActions: string[];
    preventiveActions: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const postmortemSchema = new Schema<IPostmortemDocument>(
  {
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', required: true, unique: true, index: true },
    title: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(PostmortemStatus), default: PostmortemStatus.DRAFT },
    aiGenerated: { type: Boolean, default: true },
    content: {
      title: String,
      incidentOverview: String,
      impactSummary: String,
      timelineSummary: [String],
      rootCauseAnalysis: String,
      contributingFactors: [String],
      detectionDetails: String,
      resolutionDetails: String,
      correctiveActions: [String],
      preventiveActions: [String]
    }
  },
  { timestamps: true }
);

export const Postmortem = model<IPostmortemDocument>('Postmortem', postmortemSchema);
