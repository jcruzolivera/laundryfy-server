const { Router } = require('express');
const { check } = require('express-validator');

const {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
} = require('../controllers/roles');
const { notExistsRole } = require('../helpers/db-validator');
const { validateExistingObjectById } = require('../middlewares/validateExistingObjectById');
const { validate } = require('../middlewares/validator');
const verifyJWT = require('../middlewares/verifyJWT');
const validateRole = require('../middlewares/validateRole');

const router = Router();

//  Get all roles
router.get('/', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  validate
], getRoles);

//  Get a role by ID
router.get('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('Role'),
  validate
], getRoleById);

//  Create a new role
router.post('/', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('name').notEmpty(),
  check('name').custom(notExistsRole),
  validate
], createRole);

//  Update an exsting role
router.put('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('Role'),
  validate
], updateRole);

//  Delete a role
router.delete('/:id', [
  verifyJWT,
  validateRole('ADMIN_ROLE'),
  check('id').isMongoId(),
  validateExistingObjectById('Role'),
  validate
], deleteRole);

module.exports = router;
