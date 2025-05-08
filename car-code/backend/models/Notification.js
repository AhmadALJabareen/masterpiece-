const mongoose = require('mongoose');

  const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['booking_approved', 'booking_rejected'], required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    read: { type: Boolean, default: false },
  }, { timestamps: true });

  module.exports = mongoose.model('Notification', notificationSchema);