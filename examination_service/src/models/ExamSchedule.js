import mongoose from 'mongoose';

const examScheduleSchema = new mongoose.Schema({
  examType: { type: String, enum: ['midterm', 'final', 'quiz', 'practical'], required: true },
  courseId: String,
  courseName: String,
  semester: Number,
  academicYear: String,
  date: Date,
  startTime: String,
  duration: Number,
  venue: String,
  maxMarks: Number,
  invigilators: [{ facultyId: String, name: String }],
  instructions: [String],
  status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

export const ExamSchedule = mongoose.model('ExamSchedule', examScheduleSchema);
