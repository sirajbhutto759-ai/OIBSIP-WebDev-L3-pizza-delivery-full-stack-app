const express = require('express');
const { getProfile, updateProfile, getDashboard, getAllUsers } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getProfile);
router.patch('/me', protect, updateProfile);

// Admin routes
router.get('/admin/dashboard', protect, adminOnly, getDashboard);
router.get('/admin/users', protect, adminOnly, getAllUsers);

module.exports = router;
