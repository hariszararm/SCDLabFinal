import mongoose from 'mongoose';

const facultyAttendanceSchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'leave'],
    required: true
  },
  timeIn: Date,
  timeOut: Date,
  leaveType: {
    type: String,
    enum: ['sick', 'casual', 'vacation', null],
    default: null
  },
  reason: String,
  approvedBy: String
}, {
  timestamps: true
});

facultyAttendanceSchema.index({ facultyId: 1, date: 1 });

export const FacultyAttendance = mongoose.model('FacultyAttendance', facultyAttendanceSchema);
