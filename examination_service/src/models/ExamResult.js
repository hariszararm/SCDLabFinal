import mongoose from 'mongoose';

const componentSchema = new mongoose.Schema({
  name: String,
  maxMarks: Number,
  obtainedMarks: Number
});

const examResultSchema = new mongoose.Schema({
  examScheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExamSchedule', required: true },
  studentId: String,
  courseId: String,
  components: [componentSchema],
  totalMarks: Number,
  percentage: Number,
  grade: String,
  remarks: String,
  status: { type: String, enum: ['pending', 'published', 'withheld'], default: 'pending' }
}, { timestamps: true });

examResultSchema.methods.calculateGrade = function() {
  const percentage = this.percentage;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

export const ExamResult = mongoose.model('ExamResult', examResultSchema);
