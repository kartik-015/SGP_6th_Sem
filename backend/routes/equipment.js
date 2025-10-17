const express = require('express');
const { body, validationResult } = require('express-validator');
const Equipment = require('../models/Equipment');
const { protectAdmin, checkAdminPermission } = require('../middleware/auth');
const { uploadEquipmentImages, handleUploadError, processUploadedFiles } = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/equipment
// @desc    Get all equipment (with optional filters)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      search,
      available,
      newArrivals,
      page = 1,
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (available === 'true') {
      query['quantity.available'] = { $gt: 0 };
    }

    if (newArrivals === 'true') {
      query.isNewArrival = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const equipment = await Equipment.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Equipment.countDocuments(query);

    res.json({
      success: true,
      data: {
        equipment,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / parseInt(limit)),
          hasNext: skip + equipment.length < total,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/equipment/:id
// @desc    Get single equipment by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment || !equipment.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    res.json({
      success: true,
      data: equipment
    });
  } catch (error) {
    console.error('Get equipment by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/equipment
// @desc    Add new equipment (Admin only)
// @access  Private
router.post('/', protectAdmin, checkAdminPermission('canManageEquipment'), uploadEquipmentImages, handleUploadError, [
  body('name').notEmpty().withMessage('Equipment name is required'),
  body('category').isIn(['Football', 'Basketball', 'Cricket', 'Tennis', 'Badminton', 'Volleyball', 'Hockey', 'Athletics', 'Swimming', 'Gym', 'Table Tennis', 'Squash', 'Rugby', 'Baseball', 'Other']).withMessage('Valid category is required'),
  body('quantity.total').isInt({ min: 1 }).withMessage('Total quantity must be at least 1'),
  body('quantity.available').isInt({ min: 0 }).withMessage('Available quantity cannot be negative')
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
      name,
      category,
      subcategory,
      brand,
      model,
      description,
      specifications,
      quantity,
      location,
      purchaseInfo,
      tags,
      isNewArrival
    } = req.body;

    // Process uploaded images
    const images = req.files ? processUploadedFiles(req.files, 'equipment') : [];

    // Create equipment
    const equipment = new Equipment({
      name,
      category,
      subcategory,
      brand,
      model,
      description,
      specifications: specifications ? JSON.parse(specifications) : {},
      quantity: {
        total: parseInt(quantity.total),
        available: parseInt(quantity.available),
        borrowed: 0,
        damaged: 0
      },
      location: location ? JSON.parse(location) : {},
      purchaseInfo: purchaseInfo ? JSON.parse(purchaseInfo) : {},
      tags: tags ? JSON.parse(tags) : [],
      isNewArrival: isNewArrival === 'true',
      images
    });

    await equipment.save();

    res.status(201).json({
      success: true,
      message: 'Equipment added successfully',
      data: equipment
    });
  } catch (error) {
    console.error('Add equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/equipment/:id
// @desc    Update equipment (Admin only)
// @access  Private
router.put('/:id', protectAdmin, checkAdminPermission('canManageEquipment'), uploadEquipmentImages, handleUploadError, async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Process uploaded images if any
    if (req.files && req.files.length > 0) {
      const newImages = processUploadedFiles(req.files, 'equipment');
      equipment.images = [...equipment.images, ...newImages];
    }

    // Update fields
    const updateFields = ['name', 'category', 'subcategory', 'brand', 'model', 'description', 'specifications', 'location', 'purchaseInfo', 'tags', 'isNewArrival'];
    
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (typeof req.body[field] === 'string' && (req.body[field].startsWith('{') || req.body[field].startsWith('['))) {
          equipment[field] = JSON.parse(req.body[field]);
        } else {
          equipment[field] = req.body[field];
        }
      }
    });

    // Update quantities if provided
    if (req.body.quantity) {
      const quantity = typeof req.body.quantity === 'string' ? JSON.parse(req.body.quantity) : req.body.quantity;
      equipment.quantity = {
        ...equipment.quantity,
        ...quantity
      };
    }

    await equipment.save();

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      data: equipment
    });
  } catch (error) {
    console.error('Update equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment (Admin only)
// @access  Private
router.delete('/:id', protectAdmin, checkAdminPermission('canManageEquipment'), async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // Soft delete
    equipment.isActive = false;
    await equipment.save();

    res.json({
      success: true,
      message: 'Equipment deleted successfully'
    });
  } catch (error) {
    console.error('Delete equipment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/equipment/categories
// @desc    Get all equipment categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Equipment.distinct('category');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/equipment/stats/overview
// @desc    Get equipment statistics
// @access  Private
router.get('/stats/overview', protectAdmin, async (req, res) => {
  try {
    const stats = await Equipment.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: null,
          totalEquipment: { $sum: 1 },
          totalItems: { $sum: '$quantity.total' },
          availableItems: { $sum: '$quantity.available' },
          borrowedItems: { $sum: '$quantity.borrowed' },
          damagedItems: { $sum: '$quantity.damaged' }
        }
      }
    ]);

    const categoryStats = await Equipment.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalItems: { $sum: '$quantity.total' },
          availableItems: { $sum: '$quantity.available' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: stats[0] || {
          totalEquipment: 0,
          totalItems: 0,
          availableItems: 0,
          borrowedItems: 0,
          damagedItems: 0
        },
        byCategory: categoryStats
      }
    });
  } catch (error) {
    console.error('Get equipment stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 