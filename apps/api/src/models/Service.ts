import { Schema, model } from 'mongoose';
import { ServiceStatus } from '@opsai/shared';

export interface IServiceDocument extends Document {
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

const serviceSchema = new Schema<IServiceDocument>(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(ServiceStatus), default: ServiceStatus.HEALTHY },
    environment: { type: String, default: 'Production' },
    ownerTeam: { type: String, required: true },
    repository: { type: String, required: true },
    techStack: { type: String, required: true },
    openIncidentsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Service = model<IServiceDocument>('Service', serviceSchema);
