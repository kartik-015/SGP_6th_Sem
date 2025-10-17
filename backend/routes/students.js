const express = require('express');
const { body, validationResult } = require('express-validator');
const Student = require('../models/Student');
const Request = require('../models/Request');
const { protectAdmin, protectStudent, checkAdminPermission } = require('../middleware/auth');
const { uploadProfileImage, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/students
// @desc    Get all students (Admin only)
// @access  Private
router.get('/', protectAdmin, checkAdminPermission('canManageStudents'), async (req, res) => {
  try {
    const {
      search,
      department,
      year,
      verified,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { studentId: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    if (department) {
      query.department = department;
    }

    if (year) {
      query.year = parseInt(year);
    }

    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const students = await Student.find(query)
      .select('-verificationOTP')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Student.countDocuments(query);

    res.json({
      success: true,
      data: {
        students,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + students.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', protectAdmin, protectStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-verificationOTP');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if user has access to this student
    if (req.student && req.student._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get student by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student profile
// @access  Private
router.put('/:id', protectStudent, uploadProfileImage, handleUploadError, [
  body('fullName').optional().notEmpty().withMessage('Full name cannot be empty'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phoneNumber').optional().notEmpty().withMessage('Phone number cannot be empty'),
  body('department').optional().notEmpty().withMessage('Department cannot be empty'),
  body('year').optional().isInt({ min: 1, max: 6 }).withMessage('Year must be between 1 and 6'),
  body('semester').optional().isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8')
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

    // Check if student is updating their own profile
    if (req.student._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update fields
    const updateFields = ['fullName', 'email', 'phoneNumber', 'department', 'year', 'semester', 'address', 'emergencyContact', 'preferences'];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'string' && (req.body[field].startsWith('{') || req.body[field].startsWith('['))) {
          student[field] = JSON.parse(req.body[field]);
        } else {
          student[field] = req.body[field];
        }
      }
    });

    // Update profile image if uploaded
    if (req.file) {
      student.profileImage = req.file.path;
    }

    await student.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/students/:id/requests
// @desc    Get student's request history
// @access  Private
router.get('/:id/requests', protectAdmin, protectStudent, async (req, res) => {
  try {
    // Check if user has access to this student's requests
    if (req.student && req.student._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'requestDate',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { student: req.params.id };

    if (status) {
      query.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const requests = await Request.find(query)
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
    console.error('Get student requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/students/:id/stats
// @desc    Get student statistics
// @access  Private
router.get('/:id/stats', protectAdmin, protectStudent, async (req, res) => {
  try {
    // Check if user has access to this student's stats
    if (req.student && req.student._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Get request statistics
    const requestStats = await Request.aggregate([
      {
        $match: { student: student._id }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get equipment usage by category
    const equipmentUsage = await Request.aggregate([
      {
        $match: { 
          student: student._id,
          status: { $in: ['approved', 'borrowed', 'returned'] }
        }
      },
      {
        $lookup: {
          from: 'equipment',
          localField: 'equipment',
          foreignField: '_id',
          as: 'equipment'
        }
      },
      {
        $unwind: '$equipment'
      },
      {
        $group: {
          _id: '$equipment.category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get recent activity
    const recentActivity = await Request.find({ student: student._id })
      .populate('equipment', 'name category')
      .sort({ requestDate: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        student: {
          id: student._id,
          studentId: student.studentId,
          fullName: student.fullName,
          department: student.department,
          year: student.year,
          semester: student.semester,
          isVerified: student.isVerified,
          statistics: student.statistics
        },
        requestStats,
        equipmentUsage,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/students/:id/verify
// @desc    Manually verify student (Admin only)
// @access  Private
router.put('/:id/verify', protectAdmin, checkAdminPermission('canManageStudents'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.isVerified = true;
    await student.save();

    res.json({
      success: true,
      message: 'Student verified successfully',
      data: student
    });
  } catch (error) {
    console.error('Verify student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/students/:id/deactivate
// @desc    Deactivate student account (Admin only)
// @access  Private
router.put('/:id/deactivate', protectAdmin, checkAdminPermission('canManageStudents'), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.isActive = false;
    await student.save();

    res.json({
      success: true,
      message: 'Student account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate student error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/students/departments
// @desc    Get all departments
// @access  Public
router.get('/departments', async (req, res) => {
  try {
    const departments = await Student.distinct('department');
    
    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 