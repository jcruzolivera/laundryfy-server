const { response } = require('express');
const Role = require('../models/role');

const getRoles = async (req, res = response) => {
  try {
    const roles = await Role.find({ active: true });

    return res.json({
      count: roles.length,
      roles
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const getRoleById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);

    return res.json({
      msg: 'Role found successfully',
      role
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const createRole = async (req, res = response) => {
  try {
    const data = req.body;
    const role = new Role(data);

    await role.save();

    return res.json({
      msg: 'Role created successfully',
      role: role._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const updateRole = async (req, res = response) => {
  try {
    //  Active field is not updatable (only when deleting)
    const { active, ...data } = req.body;
    const { id } = req.params;
    const role = await Role.findByIdAndUpdate(id, data);

    return res.json({
      msg: 'Role updated successfully',
      role: role._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const deleteRole = async (req, res = response) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndUpdate(id, { active: false });

    return res.json({
      msg: 'Role deleted successfully',
      role: role._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

module.exports = {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};
