const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const auth = require('../middlewares/auth');

// Middleware to check if user is admin
const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'الوصول ممنوع: للمشرفين فقط' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: 'خطأ في السيرفر' });
  }
};

// Admin routes
router.get('/me', auth, adminAuth, adminController.getAdminProfile);
router.get('/users', auth, adminAuth, adminController.getAllUsers);
router.get('/mechanics', auth, adminAuth, adminController.getAllMechanics);
router.get('/parts', auth, adminAuth, adminController.getAllParts);
router.put('/parts/:id', auth, adminAuth, adminController.updatePartState);
router.get('/articles', auth, adminAuth, adminController.getAllArticles);
router.get('/bookings', auth, adminAuth, adminController.getAllBookings);
router.get('/stats', auth, adminAuth, adminController.getStats);
router.post('/change-password', auth, adminAuth, adminController.changePassword);
router.post('/profile-pic', auth, adminAuth, adminController.uploadProfilePic);

module.exports = router;