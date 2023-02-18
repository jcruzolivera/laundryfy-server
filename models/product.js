const { Schema, model } = require('mongoose')

const ProductSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  date_created: {
    type: Date,
    default: Date.now()
  }
})

module.exports = model('Product', ProductSchema)
