import { Schema, model } from 'mongoose';

export interface INotificationDocument extends Document {
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'SUCCESS';
  read: boolean;
  link?: string;
  createdAt: Date;
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL', 'SUCCESS'], default: 'INFO' },
    read: { type: Boolean, default: false },
    link: { type: String }
  },
  { timestamps: true }
);

export const Notification = model<INotificationDocument>('Notification', notificationSchema);
