const createError = require('http-errors');
const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtVerify = util.promisify(jwt.verify);
const {
  userSchema,
} = require('../validation/users');
const config = require('../config/index');

exports.signup = async (req, res, next) => {
  try {
    await userSchema.validateAsync(req.body, { abortEarly: false });
    const { email, name, password } = req.body;
    const user = new User({ email, name });
    user.setPassword(password);
    await user.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err.isJoi) {
      return res
        .status(422)
        .json({ errors: err.details.map(err => err.message) });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.validPassword(password)) {
      return next(createError(401, 'Login Failed'));
    }
    const response = user.toAuthJSON(res);
    return res.status(200).json({ ...response });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return next(createError(403, 'Unauthorized'));

  try {
    const payload = await jwtVerify(refreshToken, config.refreshSecret);
    const accessToken = jwt.sign(
      {
        id: payload.id,
        name: payload.name,
        email: payload.email,
      },
      config.accessSecret,
      {
        expiresIn: config.accessExpiry,
      },
    );
    return res.status(200).json({ accessToken });
  } catch (err) {
    return next(createError(403, 'Unauthorized'));
  }
};
