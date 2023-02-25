const { Router } = require('express');
const { check } = require('express-validator');
const { validate } = require('../middlewares/validator');
const { validateExistingObjectById } = require('../middlewares/validateExistingObjectById');
const { notExistsCustomerByName, notExistsCustomerByPhone } = require('../helpers/db-validator');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customers');
const verifyJWT = require('../middlewares/verifyJWT');

const router = Router();

//  Get all customers
router.get('/', verifyJWT, getCustomers);

//  Get a customer by id
router.get('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Customer'),
  validate
], getCustomerById);

//  Create a new customer
router.post('/', [
  verifyJWT,
  check('name').notEmpty(),
  check('name').custom(notExistsCustomerByName),
  check('phone').notEmpty(),
  check('phone').custom(notExistsCustomerByPhone),
  validate
], createCustomer);

//  Update an existing customer
router.put('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Customer'),
  validate
], updateCustomer);

//  Delete a customer
router.delete('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Customer'),
  validate
], deleteCustomer);

module.exports = router;
