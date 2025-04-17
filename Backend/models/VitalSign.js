const mongoose = require('mongoose');

const vitalSignSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  temperature: Number,
  heartRate: Number,
  bloodPressure: String,
  respiratoryRate: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VitalSign', vitalSignSchema);
