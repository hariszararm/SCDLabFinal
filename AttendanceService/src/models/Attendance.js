import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true
  },
  remarks: String,
  markedBy: {
    type: String,
    required: true
  }
});

const attendanceSchema = new mongoose.Schema({
  courseId: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  facultyId: {
    type: String,
    required: true
  },
  studentId: {
    type: String,
    required: true
  },
  records: [attendanceRecordSchema],
  totalClasses: {
    type: Number,
    default: 0
  },
  totalPresent: {
    type: Number,
    default: 0
  },
  attendancePercentage: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
attendanceSchema.index({ courseId: 1, studentId: 1 });
attendanceSchema.index({ facultyId: 1, courseId: 1 });

// Method to calculate attendance percentage
attendanceSchema.methods.calculateAttendance = function() {
  const presentCount = this.records.filter(r => r.status === 'present').length;
  const totalCount = this.records.length;
  this.totalClasses = totalCount;
  this.totalPresent = presentCount;
  this.attendancePercentage = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
};

export const Attendance = mongoose.model('Attendance', attendanceSchema);