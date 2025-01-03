import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const facultySchema = new mongoose.Schema({
  employeeId: {
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
  department: {
    type: String,
    required: true
  },
  designation: {
    type: String,
    required: true
  },
  specialization: [String],
  contactNumber: String,
  schedule: [{
    day: String,
    timeSlots: [{
      startTime: String,
      endTime: String,
      subject: String,
      class: String
    }]
  }],
  tasks: [{
    title: String,
    description: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    }
  }],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
facultySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
facultySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const Faculty = mongoose.model('Faculty', facultySchema);