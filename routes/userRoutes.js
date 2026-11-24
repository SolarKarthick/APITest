const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// Private routes
router.post('/dashboard', authenticate, userController.dashboard);
router.put('/update-user-data', authenticate, userController.updateUserData);
router.post('/trade/history', authenticate, userController.tradeHistory);

module.exports = router;
