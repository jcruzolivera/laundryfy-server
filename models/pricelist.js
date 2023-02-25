const { Schema, model } = require('mongoose');

const PricelistSchema = new Schema({
  name: String,
  date_created: {
    type: Date,
    default: Date.now()
  },
  start_validity: Date,
  end_validity: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  pricelistLines: [{
    type: Schema.Types.ObjectId,
    ref: 'PricelistLine'
  }]

});

module.exports = model('Pricelist', PricelistSchema);
