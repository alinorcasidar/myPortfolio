const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Visit || mongoose.model('Visit', visitSchema);