const admin = require('../config/firebase/firebase');

const db = admin.firestore();
const usersCollection = db.collection('users');
const notificationCollection = db.collection('notifications');

class NotificationModel {
  static async userExistsByEmail(email) {
    const snap = await usersCollection.where('email', '==', email).limit(1).get();
    return !snap.empty;
  }

  static async create(data) {
    const docRef = await notificationCollection.add({
      email: data.email,
      title: data.title,
      message: data.message,
      type: data.type || 'admin',
      isRead: false,
      createdBy: data.createdBy || 'admin',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const doc = await docRef.get();
    const payload = doc.data();
    return {
      id: doc.id,
      ...payload,
      createdAt: payload.createdAt?.toDate
        ? payload.createdAt.toDate().toISOString()
        : null
    };
  }

  static async findByUserEmail(email) {
    const snap = await notificationCollection.where('email', '==', email).get();

    return snap.docs
      .map((d) => {
        const data = d.data();
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : null;
        return {
          id: d.id,
          ...data,
          createdAt
        };
      })
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
  }

  static async markAsRead(id, email) {
    const ref = notificationCollection.doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      const err = new Error('Notification not found');
      err.statusCode = 404;
      throw err;
    }
    const data = doc.data();
    if (data.email !== email) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      throw err;
    }
    await ref.update({ isRead: true });
    return { id, ...data, isRead: true };
  }

  static async markAllAsRead(email) {
    const snap = await notificationCollection.where('email', '==', email).get();
    const unread = snap.docs.filter((d) => d.data().isRead !== true);
    if (!unread.length) return { updated: 0 };

    const batch = db.batch();
    unread.forEach((d) => batch.update(d.ref, { isRead: true }));
    await batch.commit();
    return { updated: unread.length };
  }
}

module.exports = NotificationModel;
