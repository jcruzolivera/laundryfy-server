const { Schema, model } = require('mongoose');

const RoleSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = model('Role', RoleSchema);
