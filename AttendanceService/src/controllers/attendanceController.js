import { Attendance } from '../models/Attendance.js';
import { FacultyAttendance } from '../models/FacultyAttendance.js';
import { AppError } from '../utils/appError.js';
import { catchAsync } from '../utils/catchAsync.js';

// Student Attendance Controllers
export const markStudentAttendance = catchAsync(async (req, res) => {
  const { courseId, studentId, status, date, remarks } = req.body;
  
  let attendance = await Attendance.findOne({ courseId, studentId });
  
  if (!attendance) {
    attendance = new Attendance({
      courseId,
      studentId,
      courseName: req.body.courseName,
      semester: req.body.semester,
      academicYear: req.body.academicYear,
      facultyId: req.user.id,
      records: []
    });
  }

  attendance.records.push({
    date: new Date(date),
    status,
    remarks,
    markedBy: req.user.id
  });

  attendance.calculateAttendance();
  await attendance.save();

  res.status(200).json({
    status: 'success',
    data: attendance
  });
});

export const getStudentAttendance = catchAsync(async (req, res) => {
  const { studentId, courseId } = req.params;
  
  const attendance = await Attendance.findOne({ studentId, courseId });
  
  if (!attendance) {
    throw new AppError('No attendance records found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: attendance
  });
});

export const getStudentAttendanceSummary = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  
  const attendanceSummary = await Attendance.find({ studentId });
  
  res.status(200).json({
    status: 'success',
    data: attendanceSummary
  });
});

// Faculty Attendance Controllers
export const markFacultyAttendance = catchAsync(async (req, res) => {
  const attendance = await FacultyAttendance.create({
    ...req.body,
    date: new Date(req.body.date)
  });

  res.status(201).json({
    status: 'success',
    data: attendance
  });
});

export const updateFacultyAttendance = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  const attendance = await FacultyAttendance.findByIdAndUpdate(
    id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!attendance) {
    throw new AppError('No attendance record found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: attendance
  });
});

export const getFacultyAttendance = catchAsync(async (req, res) => {
  const { facultyId, startDate, endDate } = req.query;
  
  const query = { facultyId };
  
  if (startDate && endDate) {
    query.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  const attendance = await FacultyAttendance.find(query).sort({ date: -1 });

  res.status(200).json({
    status: 'success',
    data: attendance
  });
});