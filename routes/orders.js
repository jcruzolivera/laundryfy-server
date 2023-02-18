const { Router } = require('express')
const { check } = require('express-validator')
const verifyJWT = require('../middlewares/verifyJWT')
const { notExistsOrder } = require('../helpers/db-validator')
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  addOrderPayment,
  deliverOrder,
  addOrderLine,
  removeOrderLine
} = require('../controllers/orders')
const { validateExistingObjectById } = require('../middlewares/validateExistingObjectById')
const { validate } = require('../middlewares/validator')

const router = Router()

//  Get all orders
router.get('/', verifyJWT, getOrders)

//  Get one order with id
router.get('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Order'),
  validate
], getOrderById)

//  Create a new order
router.post('/', [
  verifyJWT,
  check('customer').isMongoId(),
  check('name').custom(notExistsOrder),
  validate
], createOrder)

//  Update an existing order
router.put('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Order'),
  validate
], updateOrder)

//  Delete or archive an order
router.delete('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Order'),
  validate
], deleteOrder)

//  Add payment
router.post('/addPayment/:id', [
  check('id').isMongoId(),
  validateExistingObjectById('Order'),
  check('amount').isNumeric(),
  validate
], addOrderPayment)

//  Deliver order
router.post('/deliverOrder/:id', [
  check('id').isMongoId(),
  validateExistingObjectById('Order'),
  validate
], deliverOrder)

//  Add line to order
router.post('/addOrderLine/:id', [
  check('id').isMongoId(),
  check('product').notEmpty(),
  check('product').isMongoId(),
  validateExistingObjectById('Order'),
  validate
], addOrderLine)

//  Remove line to order
router.post('/removeOrderLine/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('OrderLine'),
  validate
], removeOrderLine)

module.exports = router
