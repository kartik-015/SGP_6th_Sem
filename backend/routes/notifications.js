const express = require('express');
const { body, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const { protectAdmin, protectStudent, checkAdminPermission } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get notifications for current user
// @access  Private
router.get('/', protectAdmin, protectStudent, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      type,
      category,
      unreadOnly = false
    } = req.query;

    // Determine user type and ID
    const userId = req.admin ? req.admin._id : req.student._id;
    const userModel = req.admin ? 'Admin' : 'Student';

    // Build query
    const query = {
      isActive: true,
      $or: [
        { 'recipients.all': true },
        { [`recipients.${userModel === 'Student' ? 'students' : 'admins'}`]: userId }
      ]
    };

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = category;
    }

    if (unreadOnly === 'true') {
      query['readBy'] = {
        $not: {
          $elemMatch: {
            user: userId,
            userModel: userModel
          }
        }
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const notifications = await Notification.find(query)
      .populate('createdBy', 'fullName')
      .sort({ sentAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Notification.countDocuments(query);

    // Get unread count
    const unreadCount = await Notification.getUnreadCount(userId, userModel);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + notifications.length < total,
          hasPrev: parseInt(page) > 1
        },
        unreadCount
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', protectAdmin, protectStudent, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Determine user type and ID
    const userId = req.admin ? req.admin._id : req.student._id;
    const userModel = req.admin ? 'Admin' : 'Student';

    // Mark as read
    await notification.markAsRead(userId, userModel);

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', protectAdmin, protectStudent, async (req, res) => {
  try {
    // Determine user type and ID
    const userId = req.admin ? req.admin._id : req.student._id;
    const userModel = req.admin ? 'Admin' : 'Student';

    // Find unread notifications
    const unreadNotifications = await Notification.find({
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
    });

    // Mark all as read
    for (const notification of unreadNotifications) {
      await notification.markAsRead(userId, userModel);
    }

    res.json({
      success: true,
      message: `Marked ${unreadNotifications.length} notifications as read`
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/notifications
// @desc    Create new notification (Admin only)
// @access  Private
router.post('/', protectAdmin, checkAdminPermission('canSendNotifications'), [
  body('title').notEmpty().withMessage('Title is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('type').isIn(['info', 'success', 'warning', 'error', 'new_equipment', 'request_update', 'system_alert']).withMessage('Valid type is required'),
  body('category').isIn(['general', 'equipment', 'request', 'system', 'maintenance']).withMessage('Valid category is required'),
  body('priority').isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const {
      title,
      message,
      type,
      category,
      priority,
      recipients,
      actionUrl,
      actionText,
      expiresAt,
      tags
    } = req.body;

    // Create notification
    const notification = new Notification({
      title,
      message,
      type,
      category,
      priority,
      recipients: recipients ? JSON.parse(recipients) : { all: true },
      actionUrl,
      actionText,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      tags: tags ? JSON.parse(tags) : [],
      createdBy: req.admin._id
    });

    await notification.save();

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/notifications/stats
// @desc    Get notification statistics (Admin only)
// @access  Private
router.get('/stats', protectAdmin, async (req, res) => {
  try {
    const stats = await Notification.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          readCount: { $sum: { $size: '$readBy' } }
        }
      }
    ]);

    const categoryStats = await Notification.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const priorityStats = await Notification.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byType: stats,
        byCategory: categoryStats,
        byPriority: priorityStats
      }
    });
  } catch (error) {
    console.error('Get notification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete notification (Admin only)
// @access  Private
router.delete('/:id', protectAdmin, checkAdminPermission('canSendNotifications'), async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Soft delete
    notification.isActive = false;
    await notification.save();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 