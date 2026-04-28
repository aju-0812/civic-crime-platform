const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: [true, 'Please provide coordinates']
      },
      address: String
    },
    crimeType: {
      type: String,
      enum: [
        'theft',
        'assault',
        'robbery',
        'burglary',
        'accident',
        'vandalism',
        'fraud',
        'harassment',
        'other'
      ],
      required: true
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    mediaFiles: [
      {
        filename: String,
        path: String,
        type: {
          type: String,
          enum: ['image', 'video']
        }
      }
    ],
    isAnonymous: {
      type: Boolean,
      default: true
    },
    reporterName: {
      type: String,
      default: 'Anonymous'
    },
    reporterEmail: String,
    reporterPhone: String,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved', 'dismissed'],
      default: 'pending'
    },
    adminNotes: String,
    responses: [
      {
        responderId: mongoose.Schema.Types.ObjectId,
        message: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ],
    views: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Create geospatial index for location
reportSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Report', reportSchema);
