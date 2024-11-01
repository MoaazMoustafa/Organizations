const Joi = require('joi');
const User = require('../models/User');

const userSchema = Joi.object({
  email: Joi.string().min(5)
    .email({ tlds: { allow: false } })
    .required()
    .external(async value => {
      const user = await User.findOne({ email: value });
      if (user) {
        const err = new Error('Email already in use');
        err.status = 422;
        throw err;
      }
    }),
  name: Joi.string().min(5)
    .required(),
  password: Joi.string().min(5).required(),
  passwordConfirmation: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'Passwords do not match' }),
});


module.exports = { userSchema };
