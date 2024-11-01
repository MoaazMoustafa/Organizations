const User = require('../models/User');
const createError = require('http-errors');

exports.auth = async (req, res, next) => {
  const { authorization } = req.headers;
  
  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return next(createError(401, 'Authorization required'));
    }

    const token = authorization.split(' ')[1];

    const user = await User.getUserFromToken(token);
    if (!user) {
      return next(createError(401, 'Authorization required'));
    }
    
    req.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};
