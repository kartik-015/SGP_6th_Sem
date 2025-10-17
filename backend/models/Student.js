const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: [true, 'Student ID is required'],
    unique: true,
    trim: true
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1, 'Year must be at least 1'],
    max: [6, 'Year cannot exceed 6']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester must be at least 1'],
    max: [8, 'Semester cannot exceed 8']
  },
  idCardImage: {
    type: String,
    required: [true, 'ID card image is required']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationOTP: {
    code: String,
    expiresAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  preferences: {
    preferredSports: [String],
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  statistics: {
    totalRequests: { type: Number, default: 0 },
    approvedRequests: { type: Number, default: 0 },
    rejectedRequests: { type: Number, default: 0 },
    totalEquipmentBorrowed: { type: Number, default: 0 },
    totalDaysBorrowed: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ email: 1 });
studentSchema.index({ phoneNumber: 1 });
studentSchema.index({ department: 1 });

// Virtual for full student info
studentSchema.virtual('fullInfo').get(function() {
  return `${this.fullName} (${this.studentId}) - ${this.department} Year ${this.year}`;
});

// Method to generate OTP
studentSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.verificationOTP = {
    code: otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  };
  return otp;
};

// Method to verify OTP
studentSchema.methods.verifyOTP = function(otp) {
  if (!this.verificationOTP || !this.verificationOTP.code) {
    return false;
  }
  
  if (new Date() > this.verificationOTP.expiresAt) {
    this.verificationOTP = undefined;
    return false;
  }
  
  if (this.verificationOTP.code === otp) {
    this.isVerified = true;
    this.verificationOTP = undefined;
    return true;
  }
  
  return false;
};

// Method to get student info without sensitive data
studentSchema.methods.toJSON = function() {
  const student = this.toObject();
  delete student.verificationOTP;
  return student;
};

// Static method to find by student ID
studentSchema.statics.findByStudentId = function(studentId) {
  return this.findOne({ studentId: studentId.toUpperCase() });
};

module.exports = mongoose.model('Student', studentSchema); 