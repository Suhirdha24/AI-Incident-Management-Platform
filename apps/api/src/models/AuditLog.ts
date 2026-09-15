import { Schema, model } from 'mongoose';
import { AuditAction } from '@opsai/shared';

export interface IAuditLogDocument extends Document {
  timestamp: Date;
  userId?: Schema.Types.ObjectId;
  userName?: string;
  action: AuditAction;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, any>;
}

const auditLogSchema = new Schema<IAuditLogDocument>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String },
    action: { type: String, enum: Object.values(AuditAction), required: true, index: true },
    resourceType: { type: String, required: true },
    resourceId: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const AuditLog = model<IAuditLogDocument>('AuditLog', auditLogSchema);
