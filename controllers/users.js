const { response } = require('express');
const User = require('../models/user');

const getUsers = async (req, res = response) => {
  try {
    const users = await User.find({ active: true });

    return res.json({
      count: users.length,
      users
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const getUserById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    return res.json({
      msg: 'User found successfully',
      user
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const createUser = async (req, res = response) => {
  try {
    const data = req.body;
    const user = new User(data);

    await user.save();

    return res.json({
      msg: 'User created successfully',
      user: user._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const updateUser = async (req, res = response) => {
  try {
    //  Active field is not updatable (only when deleting)
    const { active, ...data } = req.body;
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, data);

    return res.json({
      msg: 'User updated successfully',
      user: user._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const deleteUser = async (req, res = response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { active: false });

    return res.json({
      msg: 'User deleted successfully',
      user: user._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
