const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: true
  },
  email_verified: {
    type: Number,
    enum: [0, 1],
    default: 0
  },
  remember_me_token: {
    type: String,
    length: 64
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);