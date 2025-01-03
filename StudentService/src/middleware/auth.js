import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Student } from '../models/Student.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in', 401);
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await Student.findById(decoded.id);

  if (!currentUser) {
    throw new AppError('User no longer exists', 401);
  }

  req.user = currentUser;
  next();
});

export const parentAuth = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in', 401);
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  
  // Verify if the token belongs to a parent
  if (!decoded.parentId) {
    throw new AppError('Invalid access token', 401);
  }

  req.user = { parentId: decoded.parentId };
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission', 403);
    }
    next();
  };
};
