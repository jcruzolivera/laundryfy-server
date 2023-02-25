
const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req, res);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors
    });
  }
  next();
};

module.exports = {
  validate
};
