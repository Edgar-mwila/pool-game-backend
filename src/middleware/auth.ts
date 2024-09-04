// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { firestore } from '../config/firebase';
import { Timestamp } from 'firebase-admin/firestore';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }

  try {
    // Example token validation (replace with actual implementation)
    const user = await firestore.collection('users').where('authToken', '==', authToken).get();

    if (user.empty) {
      return res.status(401).json({ error: 'Invalid authentication token' });
    }

    // Attach user info to request
    req.body.user = user.docs[0].data();
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
