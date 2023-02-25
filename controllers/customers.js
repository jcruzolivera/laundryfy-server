const { response } = require('express');

const Customer = require('../models/customer');

const getCustomers = async (req, res = response) => {
  try {
    const customers = await Customer.find({ active: true, user: req.user });

    return res.json({
      count: customers.length,
      customers
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const getCustomerById = async (req, res = response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (customer.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find customer with id provided',
        id
      });
    }

    return res.json({
      msg: 'Customer found successfully',
      customer
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const createCustomer = async (req, res = response) => {
  try {
    const data = req.body;
    data.user = req.user;

    const customer = new Customer(data);

    await customer.save();

    return res.json({
      msg: 'Customer created successfully',
      customer: customer._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const updateCustomer = async (req, res = response) => {
  try {
    //  Active field is not updatable (only when deleting)
    const { id } = req.params;
    const { active, ...data } = req.body;

    const customer = await Customer.findById(id);

    if (customer.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find customer with id provided',
        id
      });
    }

    await customer.update(data);

    return res.json({
      msg: 'Customer updated successfully',
      customer: customer._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const deleteCustomer = async (req, res = response) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (customer.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find customer with id provided',
        id
      });
    }

    await customer.update({ active: false });

    return res.json({
      msg: 'Customer deleted successfully',
      customer: customer._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
