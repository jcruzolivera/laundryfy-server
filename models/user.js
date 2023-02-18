const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  name: String,
  date_created: {
    type: Date,
    default: Date.now()
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  },
  password: String,
  google: Boolean,
  role: {
    type: String,
    required: true,
    enum: ['ADMIN_ROLE', 'USER_ROLE'],
    default: 'USER_ROLE'
  }
})

module.exports = model('User', UserSchema)
