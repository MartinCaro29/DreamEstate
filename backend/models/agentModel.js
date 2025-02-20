const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const agentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone_number: {
    type: String,
    required: true
  },
  startYear: {
    type: Number,
    required: true,
    min: 0
  },
  rating: {
    type: Number,
    enum: [4, 4.5, 5],
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Agent', agentSchema);