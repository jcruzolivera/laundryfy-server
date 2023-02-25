const User = require('../models/user');

const validateRole = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findOne({ _id: req.user, active: true });

    if (!roles.includes(user.role)) {
      return res.status(401).json({
        error: true,
        msg: 'Not authorized to perform this action'
      });
    }
    next();
  };
};
module.exports = validateRole;
