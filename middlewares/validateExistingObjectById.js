const { response } = require('express')
const Pricelist = require('../models/pricelist')
const Product = require('../models/product')
const Customer = require('../models/customer')
const Order = require('../models/order')
const StateOrder = require('../models/stateOrder')
const Role = require('../models/role')
const OrderLine = require('../models/orderLine')
const PricelistLine = require('../models/pricelistline')

const validateExistingObjectById = (model = '') => {
  return async (req, res = response, next) => {
    try {
      const { id } = req.params
      let obj

      switch (model) {
        case 'Pricelist':
          obj = await Pricelist.findOne({ _id: id, active: true })

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No pricelist found with provided id',
              id
            })
          }
          break

        case 'Product':
          obj = await Product.findOne({ _id: id, active: true })

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No product found with provided id',
              id
            })
          }
          break

        case 'Customer':
          obj = await Customer.findOne({ _id: id, active: true })

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No Customer found with provided id',
              id
            })
          }
          break

        case 'Order':
          obj = await Order.findOne({ _id: id, active: true })

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No Order found with provided id',
              id
            })
          }
          break

        case 'Role':
          obj = await Role.findOne({ _id: id, active: true })

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No Role found with provided id',
              id
            })
          }
          break

        case 'StateOrder':
          obj = await StateOrder.findOne({ _id: id, active: true })

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No StateOrder found with provided id',
              id
            })
          }
          break
        case 'OrderLine':
          obj = await OrderLine.findById(id)

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No OrderLine found with provided id',
              id
            })
          }
          break
        case 'PricelistLine':
          obj = await PricelistLine.findById(id)

          if (!obj) {
            return res.status(404).json({
              error: true,
              msg: 'No PricelistLine found with provided id',
              id
            })
          }
          break

        default:
          return res.status(400).json({
            error: true,
            msg: 'Objeto no comtemplado',
            model
          })
      }

      next()
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: error
      })
    }
  }
}

module.exports = {
  validateExistingObjectById
}
