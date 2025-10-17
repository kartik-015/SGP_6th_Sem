const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'new_equipment', 'request_update', 'system_alert'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['general', 'equipment', 'request', 'system', 'maintenance'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  recipients: {
    all: { type: Boolean, default: false },
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }],
    departments: [String],
    specificUsers: [String] // For specific user IDs or emails
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'readBy.userModel'
    },
    userModel: {
      type: String,
      enum: ['Student', 'Admin']
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  sentAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  actionUrl: {
    type: String,
    trim: true
  },
  actionText: {
    type: String,
    trim: true
  },
  metadata: {
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment' },
    requestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Request' },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    customData: mongoose.Schema.Types.Mixed
  },
  deliveryChannels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  deliveryStatus: {
    inApp: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: [true, 'Notification creator is required']
  },
  tags: [String],
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ type: 1 });
notificationSchema.index({ category: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ sentAt: -1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ isActive: 1 });
notificationSchema.index({ 'recipients.all': 1 });
notificationSchema.index({ 'recipients.students': 1 });
notificationSchema.index({ 'recipients.admins': 1 });

// Virtual for is expired
notificationSchema.virtual('isExpired').get(function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
});

// Virtual for read count
notificationSchema.virtual('readCount').get(function() {
  return this.readBy.length;
});

// Method to mark as read by user
notificationSchema.methods.markAsRead = function(userId, userModel) {
  const existingRead = this.readBy.find(read => 
    read.user.toString() === userId.toString() && read.userModel === userModel
  );
  
  if (!existingRead) {
    this.readBy.push({
      user: userId,
      userModel: userModel,
      readAt: new Date()
    });
  }
  
  return this.save();
};

// Method to check if user has read
notificationSchema.methods.hasUserRead = function(userId, userModel) {
  return this.readBy.some(read => 
    read.user.toString() === userId.toString() && read.userModel === userModel
  );
};

// Static method to create new equipment notification
notificationSchema.statics.createNewEquipmentNotification = function(equipment, adminId) {
  return this.create({
    title: 'New Equipment Available!',
    message: `New ${equipment.name} has been added to our inventory. Check it out now!`,
    type: 'new_equipment',
    category: 'equipment',
    priority: 'medium',
    recipients: { all: true },
    actionUrl: `/equipment/${equipment._id}`,
    actionText: 'View Equipment',
    metadata: { equipmentId: equipment._id },
    createdBy: adminId
  });
};

// Static method to create request update notification
notificationSchema.statics.createRequestUpdateNotification = function(request, status, adminId) {
  const statusMessages = {
    approved: 'Your equipment request has been approved!',
    rejected: 'Your equipment request has been rejected.',
    borrowed: 'Your equipment has been borrowed successfully.',
    returned: 'Your equipment has been returned successfully.'
  };
  
  return this.create({
    title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: statusMessages[status] || `Your request status has been updated to ${status}.`,
    type: 'request_update',
    category: 'request',
    priority: 'medium',
    recipients: { students: [request.student] },
    actionUrl: `/requests/${request._id}`,
    actionText: 'View Request',
    metadata: { requestId: request._id },
    createdBy: adminId
  });
};

// Static method to find active notifications for user
notificationSchema.statics.findForUser = function(userId, userModel, limit = 20) {
  const query = {
    isActive: true,
    $or: [
      { 'recipients.all': true },
      { [`recipients.${userModel === 'Student' ? 'students' : 'admins'}`]: userId }
    ]
  };
  
  if (this.expiresAt) {
    query.$or.push({ expiresAt: { $gt: new Date() } });
  }
  
  return this.find(query)
    .sort({ sentAt: -1 })
    .limit(limit)
    .populate('createdBy', 'fullName');
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = function(userId, userModel) {
  const query = {
    isActive: true,
    $or: [
      { 'recipients.all': true },
      { [`recipients.${userModel === 'Student' ? 'students' : 'admins'}`]: userId }
    ],
    'readBy': {
      $not: {
        $elemMatch: {
          user: userId,
          userModel: userModel
        }
      }
    }
  };
  
  return this.countDocuments(query);
};

module.exports = mongoose.model('Notification', notificationSchema); 