const { Schema, model } = require('mongoose');

const OrderSchema = new Schema({
  name: String,
  date_created: {
    type: Date,
    default: Date.now()
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  delivered: Boolean,
  date_delivered: Date,
  active: {
    type: Boolean,
    default: true
  },
  orderStates: [{
    type: Schema.Types.Object,
    ref: 'orderStateOrder'
  }],
  orderLines: [{
    type: Schema.Types.Object,
    ref: 'orderLine'
  }],
  total: Number
});

module.exports = model('Order', OrderSchema);
