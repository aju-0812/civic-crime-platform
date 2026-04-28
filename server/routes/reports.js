const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');

// Create report
router.post('/', upload.array('media', 5), reportController.createReport);

// Get all reports
router.get('/', reportController.getReports);

// Get reports nearby
router.get('/nearby', reportController.getReportsNearby);

// Get crime statistics
router.get('/stats/all', reportController.getCrimeStats);

// Get single report
router.get('/:id', reportController.getReport);

// Update report status (Admin)
router.patch('/:id/status', protect, reportController.updateReportStatus);

// Add response to report
router.post('/:id/response', protect, reportController.addResponse);

// Delete report (Admin)
router.delete('/:id', protect, reportController.deleteReport);

module.exports = router;
