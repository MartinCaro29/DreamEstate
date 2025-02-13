const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoritesSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property_id: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Index for faster lookup of user favorites
favoritesSchema.index({ user_id: 1 });
favoritesSchema.index({ property_id: 1 });

module.exports = mongoose.model('Favorites', favoritesSchema);
