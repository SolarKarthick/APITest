const NotificationModel = require('../models/notification.model');

const sendNotification = async (payload, createdBy) => {
  const email = payload.email?.trim();
  if (!email) throw Object.assign(new Error('email is required'), { statusCode: 400 });

  const title = payload.title?.trim();
  if (!title) throw Object.assign(new Error('title is required'), { statusCode: 400 });

  const message = payload.message?.trim();
  if (!message) throw Object.assign(new Error('message is required'), { statusCode: 400 });

  const ok = await NotificationModel.userExistsByEmail(email);
  if (!ok) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return NotificationModel.create({
    email,
    title,
    message,
    type: payload.type?.trim() || 'admin',
    createdBy: createdBy || 'admin'
  });
};

const getNotificationsByUser = async (email) => {
  if (!email?.trim()) {
    throw Object.assign(new Error('email is required'), { statusCode: 400 });
  }
  return NotificationModel.findByUserEmail(email.trim());
};

const markNotificationRead = async (id, email) => {
  if (!id?.trim()) throw Object.assign(new Error('id is required'), { statusCode: 400 });
  if (!email?.trim()) throw Object.assign(new Error('email is required'), { statusCode: 400 });
  return NotificationModel.markAsRead(id.trim(), email.trim());
};

const markAllNotificationsRead = async (email) => {
  if (!email?.trim()) throw Object.assign(new Error('email is required'), { statusCode: 400 });
  return NotificationModel.markAllAsRead(email.trim());
};

module.exports = {
  sendNotification,
  getNotificationsByUser,
  markNotificationRead,
  markAllNotificationsRead
};
