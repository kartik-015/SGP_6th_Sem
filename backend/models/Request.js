const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required']
  },
  equipment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Equipment',
    required: [true, 'Equipment is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  borrowDate: {
    type: Date,
    required: [true, 'Borrow date is required']
  },
  returnDate: {
    type: Date,
    required: [true, 'Return date is required']
  },
  actualReturnDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'borrowed', 'returned', 'overdue'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  rejectedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [200, 'Rejection reason cannot exceed 200 characters']
  },
  purpose: {
    type: String,
    required: [true, 'Purpose is required'],
    trim: true,
    maxlength: [200, 'Purpose cannot exceed 200 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  specialRequirements: {
    type: String,
    trim: true,
    maxlength: [300, 'Special requirements cannot exceed 300 characters']
  },
  notes: {
    admin: String,
    student: String
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  isDamaged: {
    type: Boolean,
    default: false
  },
  damageReport: {
    description: String,
    reportedAt: Date,
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  extensions: [{
    requestedDate: Date,
    approvedDate: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    newReturnDate: Date,
    reason: String
  }],
  notifications: [{
    type: {
      type: String,
      enum: ['request_created', 'request_approved', 'request_rejected', 'due_reminder', 'overdue_notice', 'return_reminder']
    },
    sentAt: Date,
    sentTo: {
      type: String,
      enum: ['student', 'admin']
    },
    message: String
  }],
  history: [{
    action: {
      type: String,
      enum: ['created', 'approved', 'rejected', 'borrowed', 'returned', 'extended', 'damaged']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    },
    details: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
requestSchema.index({ student: 1 });
requestSchema.index({ equipment: 1 });
requestSchema.index({ status: 1 });
requestSchema.index({ requestDate: -1 });
requestSchema.index({ borrowDate: 1 });
requestSchema.index({ returnDate: 1 });
requestSchema.index({ approvedBy: 1 });

// Virtual for request duration
requestSchema.virtual('duration').get(function() {
  if (!this.borrowDate || !this.returnDate) return 0;
  return Math.ceil((this.returnDate - this.borrowDate) / (1000 * 60 * 60 * 24));
});

// Virtual for days overdue
requestSchema.virtual('daysOverdue').get(function() {
  if (this.status !== 'borrowed' || !this.returnDate) return 0;
  const today = new Date();
  if (today > this.returnDate) {
    return Math.ceil((today - this.returnDate) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for is overdue
requestSchema.virtual('isOverdue').get(function() {
  return this.daysOverdue > 0;
});

// Method to approve request
requestSchema.methods.approve = function(adminId) {
  this.status = 'approved';
  this.approvedBy = adminId;
  this.approvedAt = new Date();
  
  this.history.push({
    action: 'approved',
    performedBy: adminId,
    details: 'Request approved'
  });
  
  return this.save();
};

// Method to reject request
requestSchema.methods.reject = function(adminId, reason) {
  this.status = 'rejected';
  this.rejectedBy = adminId;
  this.rejectedAt = new Date();
  this.rejectionReason = reason;
  
  this.history.push({
    action: 'rejected',
    performedBy: adminId,
    details: `Request rejected: ${reason}`
  });
  
  return this.save();
};

// Method to mark as borrowed
requestSchema.methods.markAsBorrowed = function(adminId) {
  this.status = 'borrowed';
  
  this.history.push({
    action: 'borrowed',
    performedBy: adminId,
    details: 'Equipment borrowed'
  });
  
  return this.save();
};

// Method to mark as returned
requestSchema.methods.markAsReturned = function(adminId, isDamaged = false) {
  this.status = 'returned';
  this.actualReturnDate = new Date();
  this.isDamaged = isDamaged;
  
  this.history.push({
    action: 'returned',
    performedBy: adminId,
    details: `Equipment returned${isDamaged ? ' (damaged)' : ''}`
  });
  
  return this.save();
};

// Method to extend request
requestSchema.methods.extend = function(adminId, newReturnDate, reason) {
  this.returnDate = newReturnDate;
  this.extensions.push({
    requestedDate: new Date(),
    approvedDate: new Date(),
    approvedBy: adminId,
    newReturnDate: newReturnDate,
    reason: reason
  });
  
  this.history.push({
    action: 'extended',
    performedBy: adminId,
    details: `Request extended until ${newReturnDate.toDateString()}`
  });
  
  return this.save();
};

// Static method to find overdue requests
requestSchema.statics.findOverdue = function() {
  const today = new Date();
  return this.find({
    status: 'borrowed',
    returnDate: { $lt: today }
  }).populate('student equipment');
};

// Static method to find pending requests
requestSchema.statics.findPending = function() {
  return this.find({ status: 'pending' })
    .populate('student equipment')
    .sort({ requestDate: -1 });
};

// Static method to get request statistics
requestSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);
  
  const result = {
    pending: 0,
    approved: 0,
    rejected: 0,
    borrowed: 0,
    returned: 0,
    overdue: 0
  };
  
  stats.forEach(stat => {
    result[stat._id] = stat.count;
  });
  
  return result;
};

module.exports = mongoose.model('Request', requestSchema); 