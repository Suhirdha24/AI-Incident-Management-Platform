import { Schema, model } from 'mongoose';

export interface IIncidentEventDocument extends Document {
  incidentId: Schema.Types.ObjectId;
  eventType: string;
  title: string;
  description: string;
  createdBy?: Schema.Types.ObjectId;
  timestamp: Date;
}

const incidentEventSchema = new Schema<IIncidentEventDocument>(
  {
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', required: true, index: true },
    eventType: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export const IncidentEvent = model<IIncidentEventDocument>('IncidentEvent', incidentEventSchema);
