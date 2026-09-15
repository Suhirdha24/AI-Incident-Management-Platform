import { Schema, model } from 'mongoose';

export interface IDeploymentDocument extends Document {
  serviceId: Schema.Types.ObjectId;
  serviceKey: string;
  version: string;
  environment: string;
  deployedAt: Date;
  deployedBy: string;
  commitHash: string;
  changes: string;
}

const deploymentSchema = new Schema<IDeploymentDocument>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true, index: true },
    serviceKey: { type: String, required: true },
    version: { type: String, required: true },
    environment: { type: String, default: 'Production' },
    deployedAt: { type: Date, required: true },
    deployedBy: { type: String, required: true },
    commitHash: { type: String, required: true },
    changes: { type: String, required: true }
  },
  { timestamps: true }
);

export const Deployment = model<IDeploymentDocument>('Deployment', deploymentSchema);
