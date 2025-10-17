const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  permissions: {
    canManageEquipment: { type: Boolean, default: true },
    canManageRequests: { type: Boolean, default: true },
    canManageStudents: { type: Boolean, default: true },
    canSendNotifications: { type: Boolean, default: true },
    canViewReports: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

// Index for better query performance
adminSchema.index({ username: 1 });
adminSchema.index({ email: 1 });

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get admin info without password
adminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

// Static method to create default admin
adminSchema.statics.createDefaultAdmin = async function() {
  const adminExists = await this.findOne({ username: 'admin' });
  
  if (!adminExists) {
    await this.create({
      username: 'admin',
      password: 'admin123',
      email: 'admin@sportsequipment.com',
      fullName: 'System Administrator',
      role: 'super_admin'
    });
    console.log('✅ Default admin account created');
  }
};

module.exports = mongoose.model('Admin', adminSchema); 