const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const tenantDetection = require('../middleware/tenantDetection');

// All auth routes need tenant detection to know which customer pool to check
router.post('/register', tenantDetection, authController.register);
router.post('/login', tenantDetection, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

module.exports = router;
