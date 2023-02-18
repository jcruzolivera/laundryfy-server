const { Router } = require('express')
const { check } = require('express-validator')
const { validate } = require('../middlewares/validator')
const {
  notExistsPricelist
} = require('../helpers/db-validator')

const {
  getPricelists,
  getPricelistById,
  createPricelist,
  updatePricelist,
  deletePricelist,
  addPricelistLine,
  removePricelistLine
} = require('../controllers/pricelists')
const { validateExistingObjectById } = require('../middlewares/validateExistingObjectById')
const verifyJWT = require('../middlewares/verifyJWT')

const router = Router()

//  Get all pricelists
router.get('/', verifyJWT, getPricelists)

//  Get a pricelist by id
router.get('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Pricelist'),
  validate
], getPricelistById)

//  Create a new pricelist
router.post('/', [
  verifyJWT,
  check('name').notEmpty(),
  check('start_validity').notEmpty(),
  check('end_validity').notEmpty(),
  check('name').custom(notExistsPricelist),
  validate
], createPricelist)

//  Update an existing pricelist
router.put('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Pricelist'),
  validate
], updatePricelist)

//  Delete a pricelist
router.delete('/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('Pricelist'),
  validate
], deletePricelist)

//  Add new pricelist line
router.post('/addPricelistLine/:id', [
  verifyJWT,
  check('id').isMongoId(),
  check('product').notEmpty(),
  check('product').isMongoId(),
  validateExistingObjectById('Pricelist'),
  validate
], addPricelistLine)

//  Remove line to pricelist
router.post('/removePricelistLine/:id', [
  verifyJWT,
  check('id').isMongoId(),
  validateExistingObjectById('PricelistLine'),
  validate
], removePricelistLine)

module.exports = router
