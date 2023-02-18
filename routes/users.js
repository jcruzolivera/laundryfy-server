const { Router } = require('express')
const { check } = require('express-validator')
const { validate } = require('../middlewares/validator')
const { validateExistingObjectById } = require('../middlewares/validateExistingObjectById')
const verifyJWT = require('../middlewares/verifyJWT')
const validateRole = require('../middlewares/validateRole')
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/users')
const { notExistsUser } = require('../helpers/db-validator')

const router = Router()

//  Get all users
router.get('/', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  validate
], getUsers)

//  Get a user by id
router.get('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('User'),
  validate
], getUserById)

//  Create a new user
router.post('/', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('email').notEmpty(),
  check('email').isEmail(),
  check('email').custom(notExistsUser),
  check('name').notEmpty(),
  check('phone').notEmpty(),
  validate
], createUser)

//  Update an existing user
router.put('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('User'),
  validate
], updateUser)

//  Delete a user
router.delete('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('User'),
  validate
], deleteUser)

module.exports = router
