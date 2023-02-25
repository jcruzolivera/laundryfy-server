const { Router } = require('express');
const { check } = require('express-validator');
const { validate } = require('../middlewares/validator');

const { login, register, googleSignIn } = require('../controllers/auth');

const router = Router();

//  Login user
router.post('/login',
  check('email').isEmail(),
  check('password').notEmpty(),
  validate
  , login);

//  Register user
router.post('/register',
  check('email').isEmail(),
  check('password').notEmpty(),
  validate
  , register);

//  Register or login user by google
router.post('/google',
  check('token').notEmpty(),
  validate
  , googleSignIn);

module.exports = router;
