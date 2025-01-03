import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createFaculty,
  getFaculty,
  updateFaculty,
  deleteFaculty,
  updateSchedule,
  addTask
} from '../controllers/facultyController.js';

const router = express.Router();

router.post('/', protect, restrictTo('admin'), createFaculty);
router.get('/:id', protect, getFaculty);
router.patch('/:id', protect, updateFaculty);
router.delete('/:id', protect, restrictTo('admin'), deleteFaculty);
router.patch('/:id/schedule', protect, updateSchedule);
router.patch('/:id/tasks', protect, addTask);

export default router;