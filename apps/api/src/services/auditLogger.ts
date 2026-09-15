import { AuditLog } from '../models/AuditLog';
import { AuditAction } from '@opsai/shared';

export async function recordAuditLog(
  action: AuditAction,
  resourceType: string,
  resourceId: string,
  user?: { id?: string; name?: string },
  metadata?: Record<string, any>
) {
  try {
    await AuditLog.create({
      timestamp: new Date(),
      userId: user?.id,
      userName: user?.name || 'System',
      action,
      resourceType,
      resourceId,
      metadata
    });
  } catch (err) {
    console.error('Failed to write audit log:', err);
  }
}
