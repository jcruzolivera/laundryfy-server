const { Schema, model } = require('mongoose');

const CustomerSchema = new Schema({
  name: String,
  date_created: {
    type: Date,
    default: Date.now()
  },
  email: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }

});

module.exports = model('Customer', CustomerSchema);
