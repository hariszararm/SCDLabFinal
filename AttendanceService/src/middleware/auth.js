import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Faculty } from '../models/Faculty.js';
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
  const faculty = await Faculty.findById(decoded.id);

  if (!faculty) {
    throw new AppError('User no longer exists', 401);
  }

  req.user = faculty;
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