const crypto = require('crypto');
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');
const util = require('util');
const jwtVerify = util.promisify(jwt.verify);
const {
  accessSecret,
  refreshSecret,
  accessExpiry,
  refreshExpiry,
} = require('../config/index');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      lowercase: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      index: true,
    },
    password: String,
    salt: String,
  },
  { timestamps: true },
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });


UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

UserSchema.methods.validPassword = function (passkey) {
  const password = crypto
    .pbkdf2Sync(passkey, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.password === password;
};

UserSchema.methods.generateJWT = function (res) {
  const accessToken = jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
    },
    accessSecret,
    {
      expiresIn: accessExpiry,
    },
  );

  const refreshToken = jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
    },
    refreshSecret,
    {
      expiresIn: refreshExpiry,
    },
  );

  return {accessToken, refreshToken};
};

UserSchema.methods.toAuthJSON = function (res) {
  const { accessToken, refreshToken } = this.generateJWT(res);
  return {
    name: this.name,
    email: this.email,
    accessToken,
    refreshToken,
  };
};


UserSchema.statics.getUserFromToken = async function (token) {
  try {
    const User = this;
    const { id } = await jwtVerify(token, accessSecret);
    const user = await User.findById(id);
    return user;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = mongoose.model('User', UserSchema);
