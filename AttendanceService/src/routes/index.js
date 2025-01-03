import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  markStudentAttendance,
  getStudentAttendance,
  getStudentAttendanceSummary,
  markFacultyAttendance,
  updateFacultyAttendance,
  getFacultyAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

// Student attendance routes
router.post('/student', protect, restrictTo('faculty', 'admin'), markStudentAttendance);
router.get('/student/:studentId/course/:courseId', protect, getStudentAttendance);
router.get('/student/:studentId/summary', protect, getStudentAttendanceSummary);

// Faculty attendance routes
router.post('/faculty', protect, restrictTo('admin'), markFacultyAttendance);
router.patch('/faculty/:id', protect, restrictTo('admin'), updateFacultyAttendance);
router.get('/faculty', protect, getFacultyAttendance);

export default router;