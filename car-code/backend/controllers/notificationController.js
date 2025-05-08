const Notification = require('../models/Notification');

  exports.getUserNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .populate('booking', 'mechanic slot serviceType status');
      res.json({ notifications });
    } catch (error) {
      console.error('Get Notifications Error:', error.message);
      res.status(500).json({ message: 'خطأ أثناء جلب الإشعارات', error: error.message });
    }
  };

  exports.markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params;
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, user: req.user.id },
        { read: true },
        { new: true }
      );
      if (!notification) {
        return res.status(404).json({ message: 'الإشعار غير موجود' });
      }
      res.json({ message: 'تم تحديد الإشعار كمقروء' });
    } catch (error) {
      console.error('Mark Notification Read Error:', error.message);
      res.status(500).json({ message: 'خطأ أثناء تحديد الإشعار', error: error.message });
    }
  };