const { response } = require('express');
const StateOrder = require('../models/stateOrder');

const getStateOrders = async (req, res = response) => {
  try {
    const stateOrders = await StateOrder.find({ active: true });

    return res.json({
      count: stateOrders.length,
      stateOrders
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const getStateOrderById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const stateOrder = await StateOrder.findById(id);

    return res.json({
      msg: 'StateOrder found successfully',
      stateOrder
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const createStateOrder = async (req, res = response) => {
  try {
    const data = req.body;
    const stateOrder = new StateOrder(data);

    await stateOrder.save();

    return res.json({
      msg: 'StateOrder created successfully',
      stateOrder: stateOrder._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const updateStateOrder = async (req, res = response) => {
  try {
    //  Active field is not updatable (only when deleting)
    const { active, ...data } = req.body;
    const { id } = req.params;
    const stateOrder = await StateOrder.findByIdAndUpdate(id, data);

    return res.json({
      msg: 'stateOrder updated successfully',
      stateOrder: stateOrder._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const deleteStateOrder = async (req, res = response) => {
  try {
    const { id } = req.params;
    const stateOrder = await StateOrder.findByIdAndUpdate(id, { active: false });

    return res.json({
      msg: 'stateOrder deleted successfully',
      stateOrder: stateOrder._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

module.exports = {
  getStateOrders,
  getStateOrderById,
  createStateOrder,
  updateStateOrder,
  deleteStateOrder
};
