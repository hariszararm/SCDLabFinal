import { Faculty } from '../models/Faculty.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createFaculty = catchAsync(async (req, res) => {
  const faculty = await Faculty.create(req.body);
  res.status(201).json({
    status: 'success',
    data: faculty
  });
});

export const getFaculty = catchAsync(async (req, res) => {
  const faculty = await Faculty.findById(req.params.id).select('-password');
  if (!faculty) throw new AppError('Faculty not found', 404);
  
  res.status(200).json({
    status: 'success',
    data: faculty
  });
});

export const updateFaculty = catchAsync(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password');
  
  if (!faculty) throw new AppError('Faculty not found', 404);
  
  res.status(200).json({
    status: 'success',
    data: faculty
  });
});

export const deleteFaculty = catchAsync(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );
  
  if (!faculty) throw new AppError('Faculty not found', 404);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const updateSchedule = catchAsync(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { $push: { schedule: req.body } },
    { new: true, runValidators: true }
  );
  
  if (!faculty) throw new AppError('Faculty not found', 404);
  
  res.status(200).json({
    status: 'success',
    data: faculty
  });
});

export const addTask = catchAsync(async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(
    req.params.id,
    { $push: { tasks: req.body } },
    { new: true, runValidators: true }
  );
  
  if (!faculty) throw new AppError('Faculty not found', 404);
  
  res.status(200).json({
    status: 'success',
    data: faculty
  });
});