const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  coordX: {
    type: Number,
    required: true
  },
  coordY: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  beds: {
    type: Number,
    required: true
  },
  baths: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['apartment', 'house', 'villa', 'land'],
    required: true
  },
  status: {
    type: String,
    enum: ['ne shitje', 'e shitur'],
    default: 'ne shitje'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

propertySchema.index({ slug: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ status: 1 });

module.exports = mongoose.model('Property', propertySchema);