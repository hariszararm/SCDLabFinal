import { ExamSchedule } from '../models/ExamSchedule.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createExamSchedule = catchAsync(async (req, res) => {
  const examSchedule = await ExamSchedule.create(req.body);
  res.status(201).json({ status: 'success', data: examSchedule });
});

export const getExamSchedule = catchAsync(async (req, res) => {
  const examSchedule = await ExamSchedule.findById(req.params.id);
  if (!examSchedule) throw new AppError('Exam schedule not found', 404);
  res.status(200).json({ status: 'success', data: examSchedule });
});

export const updateExamSchedule = catchAsync(async (req, res) => {
  const examSchedule = await ExamSchedule.findByIdAndUpdate(
    req.params.id, req.body, { new: true, runValidators: true }
  );
  if (!examSchedule) throw new AppError('Exam schedule not found', 404);
  res.status(200).json({ status: 'success', data: examSchedule });
});

export const getSemesterSchedule = catchAsync(async (req, res) => {
  const { semester, academicYear } = req.query;
  const schedules = await ExamSchedule.find({ semester, academicYear }).sort({ date: 1 });
  res.status(200).json({ status: 'success', data: schedules });
});
