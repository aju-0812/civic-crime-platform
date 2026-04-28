const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// Register
router.post('/register', adminController.registerAdmin);

// Login
router.post('/login', adminController.loginAdmin);

// Get current admin
router.get('/me', protect, adminController.getCurrentAdmin);

// Get all admins
router.get('/', protect, adminController.getAllAdmins);

// Update admin
router.patch('/:id', protect, adminController.updateAdmin);

// Delete admin
router.delete('/:id', protect, adminController.deleteAdmin);

module.exports = router;
