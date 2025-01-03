import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const academicRecordSchema = new mongoose.Schema({
  semester: {
    type: Number,
    required: true
  },
  courses: [{
    courseCode: String,
    courseName: String,
    credits: Number,
    grade: String,
    gpa: Number
  }],
  semesterGPA: Number,
  cumulativeGPA: Number
});

const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  relation: {
    type: String,
    required: true
  },
  email: String,
  phone: String,
  password: String
});

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  program: {
    type: String,
    required: true
  },
  batch: {
    type: String,
    required: true
  },
  currentSemester: {
    type: Number,
    required: true
  },
  academicRecords: [academicRecordSchema],
  attendance: {
    type: Map,
    of: {
      present: Number,
      total: Number,
      percentage: Number
    }
  },
  parents: [parentSchema],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  
  if (this.parents) {
    for (let parent of this.parents) {
      if (parent.isModified('password')) {
        parent.password = await bcrypt.hash(parent.password, 12);
      }
    }
  }
  next();
});

studentSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Student = mongoose.model('Student', studentSchema);
