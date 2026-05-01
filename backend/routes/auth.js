const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Student = require('../models/Student');
const { protectAdmin, protectStudent, generateToken } = require('../middleware/auth');
const { uploadIdCard, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/auth/admin/login
// @desc    Admin login
// @access  Public
router.post('/admin/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { username, password } = req.body;

    // Find admin by username
    const admin = await Admin.findOne({ username });
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account deactivated'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken(admin._id, 'admin');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          fullName: admin.fullName,
          email: admin.email,
          role: admin.role,
          permissions: admin.permissions
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/student/register
// @desc    Student registration with ID card upload
// @access  Public
router.post('/student/register', uploadIdCard, handleUploadError, [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('department').optional().isString().withMessage('Department must be a string'),
  body('year').isInt({ min: 1, max: 6 }).withMessage('Year must be between 1 and 6'),
  body('semester').isInt({ min: 1, max: 8 }).withMessage('Semester must be between 1 and 8')
], async (req, res) => {
  try {
    // Debug logging
    console.log('=== REGISTRATION REQUEST DEBUG ===');
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    console.log('Request files:', req.files);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('================================');

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    // Check if ID card was uploaded
    if (!req.file) {
      console.log('No file found in request');
      return res.status(400).json({
        success: false,
        message: 'ID card image is required'
      });
    }

    const {
      studentId,
      fullName,
      email,
      phoneNumber,
      department,
      year,
      semester
    } = req.body;

    // Infer department for certain institutional emails (e.g. 23DIT123@charusat.edu.in)
    let resolvedDepartment = department;
    try {
      if ((!resolvedDepartment || resolvedDepartment.toString().trim() === '') && typeof email === 'string') {
        if (/DIT/i.test(email)) {
          resolvedDepartment = 'IT';
        }
      }
    } catch (err) {
      // noop - we'll validate below
    }

    if (!resolvedDepartment || resolvedDepartment.toString().trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Department is required or could not be inferred from email'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({
      $or: [{ studentId }, { email }, { phoneNumber }]
    });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this ID, email, or phone number already exists'
      });
    }

    // Create new student
    const student = new Student({
      studentId: studentId.toUpperCase(),
      fullName,
      email: email.toLowerCase(),
      phoneNumber,
      department: resolvedDepartment,
      year: parseInt(year),
      semester: parseInt(semester),
      idCardImage: req.file.path
    });

    await student.save();

    // Generate OTP
    const otp = student.generateOTP();
    await student.save();

    // Log OTP for testing (SMS feature removed)
    console.log(`OTP for ${phoneNumber}: ${otp}`);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully. Please verify your phone number with OTP.',
      data: {
        studentId: student.studentId,
        email: student.email,
        phoneNumber: student.phoneNumber
      }
    });
  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/student/verify-otp
// @desc    Verify student OTP
// @access  Public
router.post('/student/verify-otp', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('otp').notEmpty().withMessage('OTP is required')
], async (req, res) => {
  try {
    console.log('=== /student/verify-otp endpoint hit ===');
    console.log('Request body for OTP verification:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors for OTP verification:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { studentId, phoneNumber, otp } = req.body;

    // Find student
    const student = await Student.findOne({
      studentId: studentId.toUpperCase(),
      phoneNumber
    });

    if (!student) {
      console.log(`OTP verification failed: Student not found for ID ${studentId} and phone ${phoneNumber}`);
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Verify OTP
    const isValidOTP = student.verifyOTP(otp);
    if (!isValidOTP) {
      console.log(`OTP verification failed for student ${student.studentId}: Invalid or expired OTP`);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    await student.save();

    // Generate token
    const token = generateToken(student._id, 'student');

    console.log(`OTP successfully verified for student ${student.studentId}`);
    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        token,
        student: {
          id: student._id,
          studentId: student.studentId,
          fullName: student.fullName,
          email: student.email,
          department: student.department,
          year: student.year,
          semester: student.semester,
          isVerified: student.isVerified
        }
      }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/student/resend-otp
// @desc    Resend OTP to student
// @access  Public
router.post('/student/resend-otp', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required')
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

    const { studentId, phoneNumber } = req.body;

    // Find student
    const student = await Student.findOne({
      studentId: studentId.toUpperCase(),
      phoneNumber
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Generate new OTP
    const otp = student.generateOTP();
    await student.save();

    // Log OTP for testing (SMS feature removed)
    console.log(`New OTP for ${phoneNumber}: ${otp}`);

    res.json({
      success: true,
      message: 'OTP resent successfully'
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/auth/student/login
// @desc    Student login - generate OTP
// @access  Public
router.post('/student/login', [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required')
], async (req, res) => {
  try {
    console.log('=== /student/login endpoint hit ===');
    console.log('Request body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
    }

    const { studentId, phoneNumber } = req.body;

    // Find student
    const student = await Student.findOne({
      studentId: studentId.toUpperCase(),
      phoneNumber
    });

    if (!student) {
      console.log('Student not found for login:', studentId, phoneNumber);
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Generate OTP
    const otp = student.generateOTP();
    await student.save();

    // Log OTP for testing
    console.log('==============================');
    console.log(`Login OTP for ${phoneNumber}: ${otp}`);
    console.log('==============================');

    res.json({
      success: true,
      message: 'OTP sent successfully. Please check the console for testing.'
    });
  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

const { optionalAuth } = require('../middleware/auth');

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', optionalAuth, async (req, res) => {
  try {
    if (req.admin) {
      return res.json({
        success: true,
        data: {
          user: req.admin,
          role: 'admin'
        }
      });
    }

    if (req.student) {
      return res.json({
        success: true,
        data: {
          user: req.student,
          role: 'student'
        }
      });
    }

    res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 