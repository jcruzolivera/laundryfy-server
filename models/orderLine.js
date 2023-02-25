const { Schema, model } = require('mongoose');

const OrderLineSchema = new Schema({
  quantity: Number,
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  subtotal: Number
});

module.exports = model('OrderLine', OrderLineSchema);
