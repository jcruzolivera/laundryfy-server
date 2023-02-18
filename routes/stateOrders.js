const { Router } = require('express')
const { check } = require('express-validator')

const {
  getStateOrders,
  getStateOrderById,
  createStateOrder,
  updateStateOrder,
  deleteStateOrder
} = require('../controllers/stateOrders')
const { notExistsStateOrder } = require('../helpers/db-validator')
const { validateExistingObjectById } = require('../middlewares/validateExistingObjectById')
const { validate } = require('../middlewares/validator')
const verifyJWT = require('../middlewares/verifyJWT')
const validateRole = require('../middlewares/validateRole')

const router = Router()

//  Get all state orders
router.get('/', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  validate
], getStateOrders)

//  Get a state order by ID
router.get('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('StateOrder'),
  validate
], getStateOrderById)

//  Create a new state order
router.post('/', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('name').notEmpty(),
  check('name').custom(notExistsStateOrder),
  validate
], createStateOrder)

//  Update an exsting state order
router.put('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('StateOrder'),
  validate
], updateStateOrder)

//  Delete a state order
router.delete('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('StateOrder'),
  validate
], deleteStateOrder)

module.exports = router
