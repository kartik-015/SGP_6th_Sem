const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Equipment name is required'],
    trim: true,
    maxlength: [100, 'Equipment name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Football', 'Basketball', 'Cricket', 'Tennis', 'Badminton', 
      'Volleyball', 'Hockey', 'Athletics', 'Swimming', 'Gym', 
      'Table Tennis', 'Squash', 'Rugby', 'Baseball', 'Other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  specifications: {
    size: String,
    weight: String,
    material: String,
    color: String,
    condition: {
      type: String,
      enum: ['New', 'Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good'
    }
  },
  quantity: {
    total: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    available: {
      type: Number,
      required: [true, 'Available quantity is required'],
      min: [0, 'Available quantity cannot be negative']
    },
    borrowed: {
      type: Number,
      default: 0,
      min: [0, 'Borrowed quantity cannot be negative']
    },
    damaged: {
      type: Number,
      default: 0,
      min: [0, 'Damaged quantity cannot be negative']
    }
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  location: {
    building: String,
    room: String,
    shelf: String,
    rack: String
  },
  purchaseInfo: {
    date: Date,
    price: Number,
    supplier: String,
    warranty: {
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: false }
    }
  },
  maintenance: {
    lastMaintenance: Date,
    nextMaintenance: Date,
    maintenanceHistory: [{
      date: Date,
      description: String,
      cost: Number,
      performedBy: String
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  tags: [String],
  barcode: {
    type: String,
    unique: true,
    sparse: true
  },
  qrCode: {
    type: String,
    unique: true,
    sparse: true
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  usage: {
    totalBorrows: { type: Number, default: 0 },
    totalDays: { type: Number, default: 0 },
    lastBorrowed: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
equipmentSchema.index({ name: 1 });
equipmentSchema.index({ category: 1 });
equipmentSchema.index({ brand: 1 });
equipmentSchema.index({ isActive: 1 });
equipmentSchema.index({ isNewArrival: 1 });
equipmentSchema.index({ barcode: 1 });
equipmentSchema.index({ qrCode: 1 });

// Virtual for availability status
equipmentSchema.virtual('availabilityStatus').get(function() {
  if (this.quantity.available === 0) return 'Out of Stock';
  if (this.quantity.available <= this.quantity.total * 0.2) return 'Low Stock';
  return 'Available';
});

// Virtual for condition percentage
equipmentSchema.virtual('conditionPercentage').get(function() {
  const total = this.quantity.total;
  if (total === 0) return 0;
  return ((total - this.quantity.damaged) / total) * 100;
});

// Method to update quantities
equipmentSchema.methods.updateQuantities = function(borrowed = 0, damaged = 0) {
  this.quantity.borrowed = borrowed;
  this.quantity.damaged = damaged;
  this.quantity.available = this.quantity.total - borrowed - damaged;
  return this.save();
};

// Method to check if equipment is available
equipmentSchema.methods.isAvailable = function(quantity = 1) {
  return this.isActive && this.quantity.available >= quantity;
};

// Method to borrow equipment
equipmentSchema.methods.borrow = function(quantity = 1) {
  if (!this.isAvailable(quantity)) {
    throw new Error('Equipment not available in requested quantity');
  }
  
  this.quantity.borrowed += quantity;
  this.quantity.available -= quantity;
  this.usage.totalBorrows += quantity;
  this.usage.lastBorrowed = new Date();
  
  return this.save();
};

// Method to return equipment
equipmentSchema.methods.return = function(quantity = 1, isDamaged = false) {
  this.quantity.borrowed -= quantity;
  
  if (isDamaged) {
    this.quantity.damaged += quantity;
  } else {
    this.quantity.available += quantity;
  }
  
  return this.save();
};

// Static method to find available equipment
equipmentSchema.statics.findAvailable = function(category = null) {
  const query = { 
    isActive: true, 
    'quantity.available': { $gt: 0 } 
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query);
};

// Static method to find new arrivals
equipmentSchema.statics.findNewArrivals = function(limit = 10) {
  return this.find({ 
    isNewArrival: true, 
    isActive: true 
  }).limit(limit);
};

module.exports = mongoose.model('Equipment', equipmentSchema); 