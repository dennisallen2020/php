import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { admin } from '../config/firebase';
import { createError } from './errorHandler';
import { logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    displayName?: string;
    plan?: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError('No valid authorization header found', 401);
    }

    const token = authHeader.substring(7);

    try {
      // Verify Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      // Get user data from Firestore
      const userDoc = await admin.firestore()
        .collection('users')
        .doc(decodedToken.uid)
        .get();

      if (!userDoc.exists) {
        throw createError('User not found', 404);
      }

      const userData = userDoc.data();
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: decodedToken.name || userData?.displayName,
        plan: userData?.plan?.type || 'free',
      };

      next();
    } catch (error) {
      logger.error('Token verification failed:', error);
      throw createError('Invalid token', 401);
    }
  } catch (error) {
    next(error);
  }
};

export const requirePlan = (requiredPlan: 'free' | 'pro' = 'free') => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError('User not authenticated', 401));
    }

    const userPlan = req.user.plan || 'free';
    
    if (requiredPlan === 'pro' && userPlan !== 'pro') {
      return next(createError('Pro plan required for this feature', 403));
    }

    next();
  };
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(createError('User not authenticated', 401));
  }

  // Check if user is admin (you can implement your own logic here)
  const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
  
  if (!adminEmails.includes(req.user.email)) {
    return next(createError('Admin access required', 403));
  }

  next();
};