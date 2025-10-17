const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const Equipment = require('../models/Equipment');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const { protectAdmin, protectStudent, checkAdminPermission } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/requests
// @desc    Create equipment request (Student only)
// @access  Private
router.post('/', protectStudent, [
  body('equipmentId').notEmpty().withMessage('Equipment ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('borrowDate').isISO8601().withMessage('Valid borrow date is required'),
  body('returnDate').isISO8601().withMessage('Valid return date is required'),
  body('purpose').notEmpty().withMessage('Purpose is required'),
  body('location').notEmpty().withMessage('Location is required')
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
      equipmentId,
      quantity,
      borrowDate,
      returnDate,
      purpose,
      location,
      specialRequirements,
      isUrgent
    } = req.body;

    // Check if equipment exists and is available
    const equipment = await Equipment.findById(equipmentId);
    if (!equipment || !equipment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    if (!equipment.isAvailable(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Equipment not available in requested quantity. Available: ${equipment.quantity.available}`
      });
    }

    // Check if dates are valid
    const borrow = new Date(borrowDate);
    const returnD = new Date(returnDate);
    const now = new Date();

    if (borrow < now) {
      return res.status(400).json({
        success: false,
        message: 'Borrow date cannot be in the past'
      });
    }

    if (returnD <= borrow) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be after borrow date'
      });
    }

    // Check if student has pending requests for same equipment
    const existingRequest = await Request.findOne({
      student: req.student._id,
      equipment: equipmentId,
      status: { $in: ['pending', 'approved'] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending or approved request for this equipment'
      });
    }

    // Create request
    const request = new Request({
      student: req.student._id,
      equipment: equipmentId,
      quantity: parseInt(quantity),
      borrowDate: borrow,
      returnDate: returnD,
      purpose,
      location,
      specialRequirements,
      isUrgent: isUrgent === 'true'
    });

    await request.save();

    // Update student statistics
    req.student.statistics.totalRequests += 1;
    await req.student.save();

    res.status(201).json({
      success: true,
      message: 'Request created successfully',
      data: request
    });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/requests
// @desc    Get requests (filtered by user role)
// @access  Private
router.get('/', protectAdmin, protectStudent, async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'requestDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    // Filter by user role
    if (req.student) {
      query.student = req.student._id;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const requests = await Request.find(query)
      .populate('student', 'studentId fullName email department')
      .populate('equipment', 'name category brand')
      .populate('approvedBy', 'fullName')
      .populate('rejectedBy', 'fullName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Request.countDocuments(query);

    res.json({
      success: true,
      data: {
        requests,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + requests.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/requests/:id
// @desc    Get single request by ID
// @access  Private
router.get('/:id', protectAdmin, protectStudent, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('student', 'studentId fullName email department year semester')
      .populate('equipment', 'name category brand description images')
      .populate('approvedBy', 'fullName')
      .populate('rejectedBy', 'fullName');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    // Check if user has access to this request
    if (req.student && request.student._id.toString() !== req.student._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Get request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/requests/:id/approve
// @desc    Approve request (Admin only)
// @access  Private
router.put('/:id/approve', protectAdmin, checkAdminPermission('canManageRequests'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('student')
      .populate('equipment');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    // Check if equipment is still available
    if (!request.equipment.isAvailable(request.quantity)) {
      return res.status(400).json({
        success: false,
        message: 'Equipment not available in requested quantity'
      });
    }

    // Approve request
    await request.approve(req.admin._id);

    // Update equipment quantities
    await request.equipment.borrow(request.quantity);

    // Update student statistics
    request.student.statistics.approvedRequests += 1;
    await request.student.save();

    // Create notification
    await Notification.createRequestUpdateNotification(request, 'approved', req.admin._id);

    res.json({
      success: true,
      message: 'Request approved successfully',
      data: request
    });
  } catch (error) {
    console.error('Approve request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/requests/:id/reject
// @desc    Reject request (Admin only)
// @access  Private
router.put('/:id/reject', protectAdmin, checkAdminPermission('canManageRequests'), [
  body('reason').notEmpty().withMessage('Rejection reason is required')
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

    const request = await Request.findById(req.params.id)
      .populate('student');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request is not pending'
      });
    }

    // Reject request
    await request.reject(req.admin._id, req.body.reason);

    // Update student statistics
    request.student.statistics.rejectedRequests += 1;
    await request.student.save();

    // Create notification
    await Notification.createRequestUpdateNotification(request, 'rejected', req.admin._id);

    res.json({
      success: true,
      message: 'Request rejected successfully',
      data: request
    });
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/requests/:id/borrow
// @desc    Mark request as borrowed (Admin only)
// @access  Private
router.put('/:id/borrow', protectAdmin, checkAdminPermission('canManageRequests'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('student');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Request is not approved'
      });
    }

    // Mark as borrowed
    await request.markAsBorrowed(req.admin._id);

    // Update student statistics
    request.student.statistics.totalEquipmentBorrowed += request.quantity;
    await request.student.save();

    // Create notification
    await Notification.createRequestUpdateNotification(request, 'borrowed', req.admin._id);

    res.json({
      success: true,
      message: 'Request marked as borrowed',
      data: request
    });
  } catch (error) {
    console.error('Mark as borrowed error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/requests/:id/return
// @desc    Mark request as returned (Admin only)
// @access  Private
router.put('/:id/return', protectAdmin, checkAdminPermission('canManageRequests'), async (req, res) => {
  try {
    const request = await Request.findById(req.params.id)
      .populate('student')
      .populate('equipment');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found'
      });
    }

    if (request.status !== 'borrowed') {
      return res.status(400).json({
        success: false,
        message: 'Request is not borrowed'
      });
    }

    const isDamaged = req.body.isDamaged === 'true';

    // Mark as returned
    await request.markAsReturned(req.admin._id, isDamaged);

    // Update equipment quantities
    await request.equipment.return(request.quantity, isDamaged);

    // Update student statistics
    const daysBorrowed = Math.ceil((request.actualReturnDate - request.borrowDate) / (1000 * 60 * 60 * 24));
    request.student.statistics.totalDaysBorrowed += daysBorrowed;
    await request.student.save();

    // Create notification
    await Notification.createRequestUpdateNotification(request, 'returned', req.admin._id);

    res.json({
      success: true,
      message: 'Request marked as returned',
      data: request
    });
  } catch (error) {
    console.error('Mark as returned error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/requests/stats/overview
// @desc    Get request statistics
// @access  Private
router.get('/stats/overview', protectAdmin, async (req, res) => {
  try {
    const stats = await Request.getStatistics();
    
    // Get recent requests
    const recentRequests = await Request.find()
      .populate('student', 'studentId fullName')
      .populate('equipment', 'name category')
      .sort({ requestDate: -1 })
      .limit(5);

    // Get overdue requests
    const overdueRequests = await Request.findOverdue();

    res.json({
      success: true,
      data: {
        statistics: stats,
        recentRequests,
        overdueRequests
      }
    });
  } catch (error) {
    console.error('Get request stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 