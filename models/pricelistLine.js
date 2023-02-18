const { Schema, model } = require('mongoose')

const PricelistLineSchema = new Schema({
  pricelist: {
    type: Schema.Types.ObjectId,
    ref: 'Pricelist',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: Number
})

module.exports = model('PricelistLine', PricelistLineSchema)
