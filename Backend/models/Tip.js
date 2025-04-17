const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  nurseId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tip', tipSchema);
