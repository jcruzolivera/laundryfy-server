const { ObjectId } = require('mongoose').Types
const Product = require('../models/product')

const validatePricelistLine = async (product, price) => {
  try {
    if (price < 0) {
      return false
    }
    product = ObjectId(product)

    const productExists = await Product.findOne({ active: true, _id: product })

    if (!productExists) {
      return false
    }

    return true
  } catch {
    return false
  }
}

module.exports = validatePricelistLine
