const {
  sendNotification,
  getNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead
} = require('../services/notification.service');

class NotificationController {
  async sendNotification(req, res, next) {
    try {
      const data = await sendNotification(req.body, req.user?.email);
      res.status(201).json({
        success: true,
        message: 'Notification sent successfully',
        data
      });
    } catch (error) {
      next(error);
    }
  }

  async getNotificationsByUser(req, res, next) {
    try {
      const email = req.body?.email?.trim() || req.user?.email;
      if (!email) {
        return res.status(400).json({ success: false, message: 'email is required' });
      }

      if (req.user?.role !== 'admin' && req.user?.email !== email) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }

      const data = await getNotificationsByUser(email);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const id = req.body?.id?.trim();
      const email = req.user?.email;
      if (!email) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const data = await markNotificationRead(id, email);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      const email = req.user?.email;
      if (!email) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const data = await markAllNotificationsRead(email);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotificationController();
