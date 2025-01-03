import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createExamSchedule,
  getExamSchedule,
  updateExamSchedule,
  getSemesterSchedule
} from '../controllers/examScheduleController.js';
import {
  addExamResult,
  getStudentResults,
  updateResult,
  publishResults
} from '../controllers/examResultController.js';

const router = express.Router();

router.post('/schedule', protect, restrictTo('admin'), createExamSchedule);
router.get('/schedule/:id', protect, getExamSchedule);
router.patch('/schedule/:id', protect, restrictTo('admin'), updateExamSchedule);
router.get('/schedule', protect, getSemesterSchedule);

router.post('/results', protect, restrictTo('faculty', 'admin'), addExamResult);
router.get('/results/student/:studentId', protect, getStudentResults);
router.patch('/results/:id', protect, restrictTo('faculty', 'admin'), updateResult);
router.post('/results/publish/:examScheduleId', protect, restrictTo('admin'), publishResults);

export default router;
