import { Request, Response, NextFunction } from 'express';
import { Service } from '../models/Service';
import { AuthenticatedRequest } from '../middleware/auth';

export async function getServices(req: Request, res: Response, next: NextFunction) {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json({
      success: true,
      data: services
    });
  } catch (err) {
    next(err);
  }
}

export async function getServiceById(req: Request, res: Response, next: NextFunction) {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }
      });
    }
    res.json({
      success: true,
      data: service
    });
  } catch (err) {
    next(err);
  }
}

export async function createService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({
      success: true,
      data: service
    });
  } catch (err) {
    next(err);
  }
}

export async function updateService(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({
        success: false,
        error: { code: 'SERVICE_NOT_FOUND', message: 'Service not found' }
      });
    }
    res.json({
      success: true,
      data: service
    });
  } catch (err) {
    next(err);
  }
}
