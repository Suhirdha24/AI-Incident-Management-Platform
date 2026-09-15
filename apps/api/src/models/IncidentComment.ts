import { Schema, model } from 'mongoose';

export interface IIncidentCommentDocument extends Document {
  incidentId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  text: string;
  isNote: boolean;
  createdAt: Date;
}

const incidentCommentSchema = new Schema<IIncidentCommentDocument>(
  {
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    isNote: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const IncidentComment = model<IIncidentCommentDocument>('IncidentComment', incidentCommentSchema);
