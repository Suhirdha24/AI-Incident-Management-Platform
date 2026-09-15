import { Request, Response, NextFunction } from 'express';
import { AuditLog } from '../models/AuditLog';

export async function getAuditLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json({
      success: true,
      data: logs
    });
  } catch (err) {
    next(err);
  }
}
