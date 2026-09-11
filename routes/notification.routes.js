const express = require('express');
const notificationController = require('../controllers/notification.controller');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/send', authenticate, adminOnly, notificationController.sendNotification);
router.post('/list', authenticate, notificationController.getNotificationsByUser);
router.post('/read', authenticate, notificationController.markAsRead);
router.post('/read-all', authenticate, notificationController.markAllAsRead);

module.exports = router;