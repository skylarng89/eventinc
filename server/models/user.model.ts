// server/models/user.model.ts

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff'
}

// User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false // Don't return password by default
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.STAFF
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function(): string {
  return `${this.firstName} ${this.lastName}`;
};

export const User = mongoose.model('User', userSchema);

// server/utils/auth.ts

import jwt from 'jsonwebtoken';
import { logger } from '~/server/utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

interface TokenPayload {
  userId: string;
  role: string;
}

export const auth = {
  // Generate JWT token
  generateToken(payload: TokenPayload): string {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Failed to generate token:', error);
      throw error;
    }
  },

  // Verify JWT token
  verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      logger.error('Failed to verify token:', error);
      return null;
    }
  }
};

// Middleware to protect routes
export async function defineAuthMiddleware() {
  return defineEventHandler(async (event) => {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn('No auth token provided');
      throw createError({
        statusCode: 401,
        message: 'Authentication required'
      });
    }

    const payload = auth.verifyToken(token);
    if (!payload) {
      logger.warn('Invalid auth token');
      throw createError({
        statusCode: 401,
        message: 'Invalid or expired token'
      });
    }

    // Add user info to event context
    event.context.auth = payload;
  });
}