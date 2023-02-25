const { Schema, model } = require('mongoose');

const StateOrderSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = model('StateOrder', StateOrderSchema);
