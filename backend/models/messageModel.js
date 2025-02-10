const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  agent_id: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  property_id: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

messageSchema.index({ user_id: 1, agent_id: 1 });

module.exports = mongoose.model('Message', messageSchema);