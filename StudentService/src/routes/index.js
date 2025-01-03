import express from 'express';
import { protect, restrictTo, parentAuth } from '../middleware/auth.js';
import {
  createStudent,
  getStudent,
  updateStudent,
  deleteStudent,
  updateAcademicRecord,
  updateAttendance,
  getStudentForParent
} from '../controllers/studentController.js';

const router = express.Router();

// Admin and staff routes
router.post('/', protect, restrictTo('admin'), createStudent);
router.patch('/:id', protect, restrictTo('admin', 'staff'), updateStudent);
router.delete('/:id', protect, restrictTo('admin'), deleteStudent);
router.patch('/:id/academic-record', protect, restrictTo('admin', 'staff'), updateAcademicRecord);
router.patch('/:id/attendance', protect, restrictTo('admin', 'staff'), updateAttendance);

// Student routes
router.get('/:id', protect, getStudent);

// Parent routes
router.get('/:id/parent-view', parentAuth, getStudentForParent);

export default router;