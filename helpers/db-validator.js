const Pricelist = require('../models/pricelist')
const Product = require('../models/product')
const Customer = require('../models/customer')
const User = require('../models/user')
const Order = require('../models/order')
const Role = require('../models/role')
const StateOrder = require('../models/stateOrder')

// //  Pricelist validations

// Validate no pricelist is already created with data provided
const notExistsPricelist = async (name = '') => {
  const pricelist = await Pricelist.findOne({ name })

  if (pricelist) {
    throw new Error('Already exists pricelist with name ' + name)
  }

  return true
}

// // Product validations

// Validate no product is already created with data provided
const notExistsProduct = async (name = '') => {
  const product = await Product.findOne({ name })

  if (product) {
    throw new Error('Already exists product with name ' + name)
  }

  return true
}

// // Customer validations

// Validate no customer is already created with name provided
const notExistsCustomerByName = async (name = '') => {
  const customer = await Customer.findOne({ name })

  if (customer) {
    throw new Error('Already exists customer with name ' + name)
  }

  return true
}

// Validate no customer is already created with phone provided
const notExistsCustomerByPhone = async (phone = '') => {
  const customer = await Customer.findOne({ phone })

  if (customer) {
    throw new Error('Already exists customer with phone ' + phone)
  }

  return true
}

// // User validations

// Validate no user is already created with data provided
const notExistsUser = async (email = '') => {
  const user = await User.findOne({ email })

  if (user) {
    throw new Error('Already exists user with email ' + email)
  }

  return true
}

// // Order validations

// Validate no order is already created with data provided
const notExistsOrder = async (name = '') => {
  const order = await Order.findOne({ name })

  if (order) {
    throw new Error('Already exists order with name ' + name)
  }

  return true
}

// // Role validations

// Validate no role is already created with data provided
const notExistsRole = async (name = '') => {
  const role = await Role.findOne({ name })

  if (role) {
    throw new Error('Already exists role with name ' + name)
  }

  return true
}

// // StateOrder validations

// Validate no role is already created with data provided
const notExistsStateOrder = async (name = '') => {
  const stateOrder = await StateOrder.findOne({ name })

  if (stateOrder) {
    throw new Error('Already exists stateOrder with name ' + name)
  }

  return true
}

module.exports = {
  notExistsPricelist,
  notExistsProduct,
  notExistsCustomerByName,
  notExistsCustomerByPhone,
  notExistsUser,
  notExistsOrder,
  notExistsRole,
  notExistsStateOrder
}
