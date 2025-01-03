// src/controllers/studentController.js
import { Student } from '../models/Student.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

export const createStudent = catchAsync(async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json({
    status: 'success',
    data: student
  });
});

export const getStudent = catchAsync(async (req, res) => {
  const student = await Student.findById(req.params.id)
    .select('-password -parents.password');
  
  if (!student) throw new AppError('Student not found', 404);
  
  res.status(200).json({
    status: 'success',
    data: student
  });
});

export const updateStudent = catchAsync(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-password -parents.password');
  
  if (!student) throw new AppError('Student not found', 404);
  
  res.status(200).json({
    status: 'success',
    data: student
  });
});

export const deleteStudent = catchAsync(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { active: false },
    { new: true }
  );
  
  if (!student) throw new AppError('Student not found', 404);
  
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const updateAcademicRecord = catchAsync(async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    { $push: { academicRecords: req.body } },
    { new: true, runValidators: true }
  );
  
  if (!student) throw new AppError('Student not found', 404);
  
  res.status(200).json({
    status: 'success',
    data: student
  });
});

export const updateAttendance = catchAsync(async (req, res) => {
  const { courseCode, present, total } = req.body;
  const percentage = (present / total) * 100;

  const student = await Student.findById(req.params.id);
  if (!student) throw new AppError('Student not found', 404);

  student.attendance.set(courseCode, { present, total, percentage });
  await student.save();

  res.status(200).json({
    status: 'success',
    data: student
  });
});

export const getStudentForParent = catchAsync(async (req, res) => {
  const student = await Student.findOne({
    _id: req.params.id,
    'parents._id': req.user.parentId
  }).select('-password -parents.password');
  
  if (!student) throw new AppError('Student not found or access denied', 404);
  
  res.status(200).json({
    status: 'success',
    data: student
  });
});