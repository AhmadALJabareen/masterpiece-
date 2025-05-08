// const mongoose = require('mongoose');

// const mechanicSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   workshopName: { type: String },
//   ratings: [{
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//     rating: { type: Number, min: 1, max: 5 },
//     comment: { type: String }
//   }],
//   workSchedule: [{
//     day: String, // 'Monday', 'Tuesday', ...
//     from: String, // '08:00'
//     to: String   // '17:00'
//   }],
//   bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
//   revenue: { type: Number, default: 0 }
// }, { timestamps: true });

// module.exports = mongoose.model('Mechanic', mechanicSchema);



// const mongoose = require('mongoose');

// const mechanicSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   workshopName: {
//     type: String,
//     default: '',
//   },
//   workSchedule: [
//     {
//       day: { type: String, required: true },
//       from: { type: String, required: true },
//       to: { type: String, required: true },
//     },
//   ],
//   bookings: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Booking',
//     },
//   ],
//   ratings: [
//     {
//       user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//       rating: { type: Number, required: true, min: 1, max: 5 },
//       comment: { type: String },
//       createdAt: { type: Date, default: Date.now },
//     },
//   ],
// });

// module.exports = mongoose.model('Mechanic', mechanicSchema);




const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workshopName: { type: String },
  specializations: [{ type: String }], // مثل: ["محركات", "كهرباء سيارات", "تكييف"]
  experienceYears: { type: Number, min: 0 }, // سنوات الخبرة
  workSchedule: [{
    day: { type: String, enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] },
    hours: [{ start: String, end: String }], // مثل: [{ start: "09:00", end: "17:00" }]
  }],
  pricing: {
    homeService: { type: Number, min: 0 }, // سعر الخدمة المنزلية بالساعة
    workshopService: { type: Number, min: 0 }, // سعر الخدمة في الورشة
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String }, // تعليق المستخدم
    createdAt: { type: Date, default: Date.now }
  }],
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Mechanic', mechanicSchema);