import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({}, '-passwordHash').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const { role, status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, status },
      { new: true, select: '-passwordHash' }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}

export async function getAlertSources(req: Request, res: Response, next: NextFunction) {
  try {
    res.json({
      success: true,
      data: [
        { id: 'src_1', name: 'Datadog', type: 'WEBHOOK', status: 'CONNECTED', lastPing: new Date() },
        { id: 'src_2', name: 'Prometheus Alertmanager', type: 'WEBHOOK', status: 'CONNECTED', lastPing: new Date() },
        { id: 'src_3', name: 'AWS CloudWatch', type: 'API', status: 'CONNECTED', lastPing: new Date() },
        { id: 'src_4', name: 'PagerDuty Sync', type: 'INTEGRATION', status: 'CONNECTED', lastPing: new Date() }
      ]
    });
  } catch (err) {
    next(err);
  }
}
