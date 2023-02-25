const { response } = require('express');

const Product = require('../models/product');

const getProducts = async (req, res = response) => {
  try {
    const products = await Product.find({ active: true, user: req.user });

    return res.json({
      count: products.length,
      products
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const getProductById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find product with id provided',
        id
      });
    }

    return res.json({
      msg: 'Product found successfully',
      product
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const createProduct = async (req, res = response) => {
  try {
    const data = req.body;
    data.user = req.user;
    const product = new Product(data);

    await product.save();

    return res.json({
      msg: 'Product created successfully',
      product: product._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const updateProduct = async (req, res = response) => {
  try {
    //  Active field is not updatable (only when deleting)
    const { id } = req.params;
    const { active, ...data } = req.body;
    const product = await Product.findById(id);

    if (product.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find product with id provided',
        id
      });
    }

    await product.update(data);

    return res.json({
      msg: 'Product updated successfully',
      product: product._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const deleteProduct = async (req, res = response) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find product with id provided',
        id
      });
    }

    await product.update({ active: false });

    return res.json({
      msg: 'Product deleted successfully',
      product: product._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
