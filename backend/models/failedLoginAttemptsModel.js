const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const failedLoginAttemptsSchema = new Schema({
  _id: { // Using email as primary key
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  failed_attempts: {
    type: Number,
    default: 1,
    min: 1
  },
  last_failed_attempt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FailedLoginAttempts', failedLoginAttemptsSchema);
