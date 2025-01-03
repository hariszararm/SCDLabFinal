import { ExamResult } from '../models/ExamResult.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const addExamResult = catchAsync(async (req, res) => {
  const result = new ExamResult(req.body);
  const totalObtained = result.components.reduce((sum, comp) => sum + comp.obtainedMarks, 0);
  const totalMaxMarks = result.components.reduce((sum, comp) => sum + comp.maxMarks, 0);
  result.totalMarks = totalObtained;
  result.percentage = (totalObtained / totalMaxMarks) * 100;
  result.grade = result.calculateGrade();
  await result.save();
  res.status(201).json({ status: 'success', data: result });
});

export const getStudentResults = catchAsync(async (req, res) => {
  const results = await ExamResult.find({ studentId: req.params.studentId, status: 'published' }).populate('examScheduleId');
  res.status(200).json({ status: 'success', data: results });
});

export const updateResult = catchAsync(async (req, res) => {
  const result = await ExamResult.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!result) throw new AppError('Exam result not found', 404);
  res.status(200).json({ status: 'success', data: result });
});

export const publishResults = catchAsync(async (req, res) => {
  const results = await ExamResult.updateMany({ examScheduleId: req.params.examScheduleId }, { status: 'published' });
  res.status(200).json({ status: 'success', message: 'Results published successfully', count: results.modifiedCount });
});
