const { response } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const generateJWT = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/googleVerify');

const login = async (req, res = response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email, active: true });

  if (!user) {
    return res.status(404).json({
      error: true,
      msg: 'Cannot find user with email provided',
      email
    });
  }

  if (!bcrypt.compare(password, user.password)) {
    return res.status(400).json({
      error: true,
      msg: 'Invalid password provided'
    });
  }

  const token = await generateJWT(user._id);

  req.user = user._id;

  return res.json({
    msg: 'Login successful',
    uid: user._id,
    token
  });
};

const register = async (req, res = response) => {
  const data = req.body;
  const { email, password } = data;

  const userExists = await User.findOne({ email, active: true });

  if (userExists) {
    return res.status(404).json({
      error: true,
      msg: 'User exists with email provided',
      email
    });
  }

  const passwordEncrypted = await bcrypt.hash(password, 10);
  data.password = passwordEncrypted;

  const user = new User(data);

  await user.save();

  return res.json({
    msg: 'Registration successful',
    uid: user._id
  });
};

const googleSignIn = async (req, res) => {
  const { token } = req.body;

  try {
    const { name, email } = await googleVerify(token);
    let user = await User.findOne({ email });

    if (!user) {
      const data = {
        name,
        email,
        google: true,
        role: 'USER_ROLE'
      };
      user = new User(data);
      await user.save();
    }

    if (!user.active) {
      return res.status(404).json({
        error: true,
        msg: 'User not found'
      });
    }

    //  Validate login
    const tokenJTW = await generateJWT(user.id);

    return res.json({
      user,
      token: tokenJTW
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

module.exports = {
  login,
  register,
  googleSignIn
};
