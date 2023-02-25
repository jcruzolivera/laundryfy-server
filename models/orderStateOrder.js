const { Schema, model } = require('mongoose');

const OrderStateOrderSchema = new Schema({
  date_issue: {
    type: Date,
    default: Date.now()
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  stateOrder: {
    type: Schema.Types.ObjectId,
    ref: 'StateOrder',
    required: true
  },
  description: String
});

module.exports = model('OrderStateOrder', OrderStateOrderSchema);
