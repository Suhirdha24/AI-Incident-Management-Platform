import { Schema, model } from 'mongoose';

export interface IMetricDocument extends Document {
  serviceId: Schema.Types.ObjectId;
  timestamp: Date;
  errorRate: number;
  latencyMs: number;
  cpuPercent: number;
  memoryPercent: number;
  dbConnectionsPercent: number;
}

const metricSchema = new Schema<IMetricDocument>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    timestamp: { type: Date, required: true, index: true },
    errorRate: { type: Number, required: true },
    latencyMs: { type: Number, required: true },
    cpuPercent: { type: Number, required: true },
    memoryPercent: { type: Number, required: true },
    dbConnectionsPercent: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Metric = model<IMetricDocument>('Metric', metricSchema);
