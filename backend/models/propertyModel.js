const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    require: true,
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
    require: true,
    min: 0,
    validate: {
      validator: Number.isInteger,
    },
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
    unique: true,
    required: true
  },
  category: {
    type: String,
    enum: ['Apartament per 1 person', 'Apartament per shume persona', 'Vile'],
    required: true
  },
  status: {
    type: String,
    enum: ['ne verifikim', 'ne shitje', 'e shitur'],
    default: 'ne verifikim',
  },
  sell_type: {
    type: String,
    enum: ['blerje', 'qera'],
    required: true
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

propertySchema.index({ slug: 1 });


module.exports = mongoose.model('Property', propertySchema);