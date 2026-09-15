import { Schema, model } from 'mongoose';
import { AlertSeverity, AlertStatus } from '@opsai/shared';

export interface IAlertDocument extends Document {
  alertId: string;
  serviceId: Schema.Types.ObjectId;
  serviceKey: string;
  metric: string;
  value: number;
  threshold: number;
  severity: AlertSeverity;
  status: AlertStatus;
  incidentId?: Schema.Types.ObjectId;
  source: string;
  environment: string;
  timestamp: Date;
}

const alertSchema = new Schema<IAlertDocument>(
  {
    alertId: { type: String, required: true, unique: true, index: true },
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    serviceKey: { type: String, required: true },
    metric: { type: String, required: true },
    value: { type: Number, required: true },
    threshold: { type: Number, required: true },
    severity: { type: String, enum: Object.values(AlertSeverity), required: true, index: true },
    status: { type: String, enum: Object.values(AlertStatus), default: AlertStatus.TRIGGERED, index: true },
    incidentId: { type: Schema.Types.ObjectId, ref: 'Incident', index: true },
    source: { type: String, default: 'Datadog' },
    environment: { type: String, default: 'Production' },
    timestamp: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

export const Alert = model<IAlertDocument>('Alert', alertSchema);
