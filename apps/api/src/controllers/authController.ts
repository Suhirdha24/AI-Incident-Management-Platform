import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { AuthenticatedRequest } from '../middleware/auth';
import { recordAuditLog } from '../services/auditLogger';
import { AuditAction, UserRole } from '@opsai/shared';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User with this email already exists' }
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || UserRole.ENGINEER
    });

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      config.jwtSecret as jwt.Secret,
      { expiresIn: '7d' }
    );

    await recordAuditLog(AuditAction.LOGIN, 'User', user._id.toString(), { id: user._id.toString(), name: user.name });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || user.status === 'DISABLED') {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
      });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      config.jwtSecret as jwt.Secret,
      { expiresIn: '7d' }
    );

    await recordAuditLog(AuditAction.LOGIN, 'User', user._id.toString(), { id: user._id.toString(), name: user.name });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function demoLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = req.body;
    const targetRole = role || UserRole.ENGINEER;

    const user = await User.findOne({ role: targetRole });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: `No demo account found for role ${targetRole}` }
      });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
      config.jwtSecret as jwt.Secret,
      { expiresIn: '7d' }
    );

    await recordAuditLog(AuditAction.LOGIN, 'User', user._id.toString(), { id: user._id.toString(), name: user.name }, { demo: true });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          status: user.status
        }
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    if (req.user) {
      await recordAuditLog(AuditAction.LOGOUT, 'User', req.user.id, { id: req.user.id, name: req.user.name });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}
