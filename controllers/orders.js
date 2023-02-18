const { response } = require('express')
const Order = require('../models/order')
const OrderLine = require('../models/orderLine')
const StateOrder = require('../models/stateOrder')
const OrderStateOrder = require('../models/orderStateOrder')
const ObjectId = require('mongoose').Types.ObjectId
const Product = require('../models/product')
const setTotalOrder = require('../helpers/setTotalOrder')
const Pricelist = require('../models/pricelist')
const Pricelistline = require('../models/pricelistline')
const { default: mongoose } = require('mongoose')

const getOrders = async (req, res = response) => {
  try {
    const orders = await Order.find({ active: true, user: req.user })
      .populate([{ path: 'OrderLine', strictPopulate: false }])
      .populate([{ path: 'OrderStateOrder', strictPopulate: false }])

    return res.json({
      count: orders.length,
      orders
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

const getOrderById = async (req, res = response) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)
      .populate([{ path: 'OrderLine', strictPopulate: false }])
      .populate([{ path: 'OrderStateOrder', strictPopulate: false }])

    if (order.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find order with id provided',
        id
      })
    }

    return res.json({
      order
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

const createOrder = async (req, res) => {
  try {
    const { orderLines, ...data } = req.body
    data.user = req.user
    const order = new Order(data)
    const today = '2023-01-05'//  new Date().getDate() ? new Date().getDate() :

    if (orderLines && orderLines.length > 0) {
      //  Add lines to order
      for (const line of orderLines) {
        let productPrice
        const { product, quantity } = line
        const { pricelist } = await Pricelist.findOne({
          $or: [
            {
              start_validity: { $lt: today },
              end_validity: { $gt: today },
              active: true
            },
            {
              start_validity: today,
              active: true
            }
          ]
        })

        if (!pricelist) {
          productPrice = 10
        } else {
          const pricelistProduct = await Pricelistline.find({
            pricelist: pricelist._id,
            product: product._id
          })

          if (!pricelistProduct) {
            return res.status(500).json({
              error: true,
              msg: 'Product not found in any pricelist',
              productId: product
            })
          }

          productPrice = pricelistProduct.price
        }

        const orderLine = new OrderLine({
          product,
          quantity,
          order: order._id,
          subtotal: quantity * productPrice
        })
        order.orderLines.push(orderLine)
        await orderLine.save()
      }
    }

    //  Create inital order state
    const stateOrder = await StateOrder.findOne({ name: 'No payment' })

    if (!stateOrder) {
      return res.status(500).json({
        error: true,
        msg: 'Cannot find state "No payment" '
      })
    }

    const orderStateOrder = new OrderStateOrder({
      date_issue: new Date().getDate(),
      order: order._id,
      stateOrder: stateOrder._id
    })
    order.orderStates.push(orderStateOrder)
    await orderStateOrder.save()

    //  Save order
    await order.save()

    //  Set total
    await setTotalOrder(order._id)

    return res.json({
      msg: 'Order created successfully',
      order: order._id
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params
    //  Total, active, orderLines and orderStates fields cannot be update here
    const { total, orderLines, active, orderStates, ...data } = req.body
    const order = await Order.findById(id)

    if (order.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find order with id provided',
        id
      })
    }

    await order.update(data)

    //  Set total
    await setTotalOrder(order._id)

    return res.json({
      msg: ' Order updated successfully',
      order: order._id
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (order.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find order with id provided',
        id
      })
    }

    await order.update({ active: false })

    return res.json({
      msg: 'Order deleted successfully',
      order: order._id
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message
    })
  }
}

const addOrderPayment = async (req, res) => {
  try {
    const { id } = req.params
    const { amount } = req.body
    const order = await Order.findById(id)

    if (order.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find order with id provided',
        id
      })
    }

    //  Loof for current state
    const stateOrderTotal = await StateOrder.findOne({ name: 'Total payment' })
    const currentOrderState = await OrderStateOrder.find({ order: id, stateOrder: stateOrderTotal._id }).sort([['date_issue', -1]]).limit(1)

    if (currentOrderState) {
      return res.status(500).json({
        error: true,
        msg: 'Order totally paid'
      })
    }

    let orderStateOrderData

    if (amount < 0) {
      return res.status(400).json({
        error: true,
        msg: 'Amount must be greater than zero'
      })
    }

    if (amount >= order.total) {
      orderStateOrderData = {
        date_issue: new Date().getDate(),
        order: order._id,
        stateOrder: stateOrderTotal._id,
        description: 'Total payment done. Amount: $' + amount
      }
    } else {
      const stateOrderPartial = await StateOrder.findOne({ name: 'Partial payment' })
      orderStateOrderData = {
        date_issue: new Date().getDate(),
        order: order._id,
        stateOrder: stateOrderPartial._id,
        description: 'Partial payment done. Amount: $' + amount
      }
    }

    const orderStateOrder = new OrderStateOrder(orderStateOrderData)

    await orderStateOrder.save()

    order.orderStates.push(orderStateOrder)

    await order.save()

    return res.json({
      msg: 'Order payment added successfully',
      order
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

const deliverOrder = async (req, res) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)

    if (order.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find order with id provided',
        id
      })
    }

    if (order.delivered) {
      return res.status(500).json({
        error: true,
        msg: 'Order already delivered'
      })
    }

    order.delivered = true
    order.date_delivered = new Date().getDate()
    await order.save()

    return res.json({
      msg: 'Order delivered successfully',
      order: order._id
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

const addOrderLine = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity } = req.body
    const productId = ObjectId(req.body.product)
    const productExists = await Product.findById(productId)
    const order = await Order.findById(id)

    if (order.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find order with id provided',
        id
      })
    }

    if (!productExists) {
      return res.status(404).json({
        error: true,
        msg: 'Product does not exist',
        id: req.body.product
      })
    }

    const orderLine = new OrderLine({
      product: productExists._id,
      quantity,
      order: id
    })

    await orderLine.save()

    order.orderLines.push(orderLine)
    await order.save()
    await setTotalOrder(order._id)

    return res.json({
      msg: 'Line added successfully',
      order: order._id
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

const removeOrderLine = async (req, res) => {
  try {
    const { id } = req.params
    const orderLine = await OrderLine.findById(id)

    const orderId = mongoose.Types.ObjectId(orderLine.order)
    const order = await Order.findById(orderId)

    if (order.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find order with id provided',
        id
      })
    }

    const newOrderLines = order.orderLines.filter(line => line._id.toString() !== orderLine._id.toString())

    order.orderLines = newOrderLines
    await order.save()
    await orderLine.delete()
    await setTotalOrder(order._id)

    return res.json({
      msg: 'Line removed successfully',
      order: order._id
    })
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    })
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  addOrderPayment,
  deliverOrder,
  addOrderLine,
  removeOrderLine
}
