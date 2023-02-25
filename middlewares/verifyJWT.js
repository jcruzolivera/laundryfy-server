const jwt = require('jsonwebtoken');

const verifyJWT = async (req, res, next) => {
  const token = req.headers.auth_token;

  if (!token) {
    return res.status(401).json({
      error: true,
      msg: 'Token is required for authentication'
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRETORPUBLICKEY);

    req.user = decoded.uid;
  } catch (error) {
    return res.status(500).json({
      error: true,
      msg: error.message
    });
  }
  next();
};

module.exports = verifyJWT;
