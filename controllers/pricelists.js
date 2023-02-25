const { response } = require('express');
const { ObjectId } = require('mongoose').Types;
const Pricelist = require('../models/pricelist');
const PricelistLine = require('../models/pricelistLine');
const Product = require('../models/product');
const validatePricelistLine = require('../helpers/validatePricelistLine');

const getPricelists = async (req, res = response) => {
  try {
    const pricelists = await Pricelist.find({ active: true, user: req.user }).populate([{ path: 'pricelistLines', strictPopulate: false }]);

    return res.json({
      count: pricelists.length,
      pricelists
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const getPricelistById = async (req, res = response) => {
  try {
    const { id } = req.params;
    const pricelist = await Pricelist.findById(id).populate([{ path: 'pricelistLines', strictPopulate: false }]);

    if (pricelist.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find pricelist with id provided',
        id
      });
    }

    return res.json({
      msg: 'Pricelist found successfully',
      pricelist
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const createPricelist = async (req, res = response) => {
  try {
    const { pricelistLines, ...data } = req.body;
    data.user = req.user;
    const pricelist = new Pricelist(data);
    if (pricelistLines && pricelistLines.length > 0) {
      //  Add every line of the pricelist by using push method
      for (const dataPricelistLine of pricelistLines) {
        const { product, price } = dataPricelistLine;
        const validateLine = await validatePricelistLine(product, price);

        if (!validateLine) {
          return res.status(400).json({
            error: true,
            msg: 'Pricelist line error. Check your product and price fields.'
          });
        }

        const pricelistLine = new PricelistLine({
          product,
          price,
          pricelist: pricelist._id
        });
        await pricelistLine.save();

        pricelist.pricelistLines.push(pricelistLine._id);
      }
    }

    await pricelist.save();

    return res.json({
      msg: 'Pricelist created successfully',
      pricelist: pricelist._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const updatePricelist = async (req, res = response) => {
  try {
    //  Active field is not updatable (only when deleting)
    const { id } = req.params;
    const { active, pricelistLines, ...data } = req.body;
    const pricelist = await Pricelist.findById(id);

    if (pricelist.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find pricelist with id provided',
        id
      });
    }

    await pricelist.update(data);

    return res.json({
      msg: 'Pricelist updated successfully',
      pricelist: pricelist._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const deletePricelist = async (req, res = response) => {
  try {
    const { id } = req.params;
    const pricelist = await Pricelist.findById(id);

    if (pricelist.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find pricelist with id provided',
        id
      });
    }

    await pricelist.update({ active: false });

    return res.json({
      msg: 'Pricelist deleted successfully',
      pricelist: pricelist._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const addPricelistLine = async (req, res) => {
  try {
    const { id } = req.params;
    const { price } = req.body;
    const pricelist = await Pricelist.findById(id);

    if (pricelist.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find pricelist with id provided',
        id
      });
    }

    const productId = ObjectId(req.body.product);
    const productExists = await Product.findById(productId);

    if (!productExists) {
      return res.status(404).json({
        error: true,
        msg: 'Product does not exist',
        id: req.body.product
      });
    }

    const pricelistLine = new PricelistLine({
      product: productExists._id,
      price,
      pricelist: id
    });

    await pricelistLine.save();

    pricelist.pricelistLines.push(pricelistLine);
    await pricelist.save();

    return res.json({
      msg: 'Line added successfully',
      pricelist: pricelist._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

const removePricelistLine = async (req, res) => {
  try {
    const { id } = req.params;
    const pricelistLine = await PricelistLine.findById(id);

    const pricelistId = ObjectId(pricelistLine.pricelist);
    const pricelist = await Pricelist.findById(pricelistId);

    if (pricelist.user.toString() !== req.user) {
      return res.status(404).json({
        error: true,
        msg: 'Cannot find pricelist with id provided',
        id
      });
    }

    const newPricelistLines = pricelist.pricelistLines.filter(line => line._id.toString() !== pricelistLine._id.toString());

    pricelist.pricelistLines = newPricelistLines;
    await pricelist.save();
    await pricelistLine.delete();

    return res.json({
      msg: 'Line removed successfully',
      pricelist: pricelist._id
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
};

module.exports = {
  getPricelists,
  getPricelistById,
  createPricelist,
  updatePricelist,
  deletePricelist,
  addPricelistLine,
  removePricelistLine
};
