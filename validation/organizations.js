const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
});

module.exports = schema;
