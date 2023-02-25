const { Router } = require('express');
const { check } = require('express-validator');
const { validateExistingObjectById } = require('../middlewares/validateExistingObjectById');
const { notExistsProduct } = require('../helpers/db-validator');

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/products');
const { validate } = require('../middlewares/validator');
const verifyJWT = require('../middlewares/verifyJWT');

const router = Router();

//  Get all products
router.get('/', verifyJWT, getProducts);

//  Get a product by ID
router.get('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Product'),
  validate
], getProductById);

//  Create a new product
router.post('/', [
  verifyJWT,
  check('name').notEmpty(),
  check('name').custom(notExistsProduct),
  validate
], createProduct);

//  Update an exsting product
router.put('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Product'),
  validate
], updateProduct);

//  Delete a product
router.delete('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Product'),
  validate
], deleteProduct);

module.exports = router;
