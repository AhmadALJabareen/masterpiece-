// const mongoose = require('mongoose');

// const partSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   price: { type: Number },
//   condition: { type: String, enum: ['new', 'used'], default: 'new' },
//   seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//   available: { type: Boolean, default: true }
// }, { timestamps: true });

// module.exports = mongoose.model('Part', partSchema);


const mongoose = require('mongoose');

const partSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  specifications: { type: String },
  carModel: { type: String },
  condition: { type: String, enum: ['جديد', 'مستعمل'] },
  status: { type: String, enum: ['متاح', 'مباع'], default: 'متاح' },
  state: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Part', partSchema);