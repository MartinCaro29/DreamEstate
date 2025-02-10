const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginLogsSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

loginLogsSchema.index({ email: 1, timestamp: -1 });
loginLogsSchema.index({ status: 1 });

module.exports = mongoose.model('LoginLogs', loginLogsSchema);