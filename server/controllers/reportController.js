const Report = require('../models/Report');

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { description, latitude, longitude, address, crimeType, severity, isAnonymous, reporterName, reporterEmail, reporterPhone } = req.body;

    if (!description || latitude === undefined || longitude === undefined || !crimeType) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const mediaFiles = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        mediaFiles.push({
          filename: file.filename,
          path: `/uploads/${file.filename}`,
          type: file.mimetype.startsWith('image') ? 'image' : 'video'
        });
      });
    }

    const report = new Report({
      description,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
        address
      },
      crimeType,
      severity: severity || 'medium',
      mediaFiles,
      isAnonymous: isAnonymous !== false,
      reporterName: isAnonymous !== false ? 'Anonymous' : reporterName || 'Anonymous',
      reporterEmail: isAnonymous !== false ? undefined : reporterEmail,
      reporterPhone: isAnonymous !== false ? undefined : reporterPhone,
      status: 'pending'
    });

    await report.save();

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('newReport', report);
    }

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully',
      data: report
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reports with optional filtering
exports.getReports = async (req, res) => {
  try {
    const { status, crimeType, severity, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (crimeType) filter.crimeType = crimeType;
    if (severity) filter.severity = severity;

    const skip = (page - 1) * limit;

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reports near a location
exports.getReportsNearby = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude required' });
    }

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single report
exports.getReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Increment view count
    report.views = (report.views || 0) + 1;
    await report.save();

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update report status (Admin only)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['pending', 'in-progress', 'resolved', 'dismissed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, updatedAt: new Date() },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Emit socket event for real-time update
    if (req.io) {
      req.io.emit('reportUpdated', report);
    }

    res.json({
      success: true,
      message: 'Report status updated',
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add response to report
exports.addResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          responses: {
            responderId: req.user?.id,
            message,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    // Emit socket event
    if (req.io) {
      req.io.emit('responseAdded', { reportId: req.params.id, response: report.responses[report.responses.length - 1] });
    }

    res.json({
      success: true,
      message: 'Response added',
      data: report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get crime statistics
exports.getCrimeStats = async (req, res) => {
  try {
    const stats = await Report.aggregate([
      {
        $group: {
          _id: '$crimeType',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const statusStats = await Report.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        byCrimeType: stats,
        byStatus: statusStats,
        totalReports: await Report.countDocuments()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete report (Admin only)
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
