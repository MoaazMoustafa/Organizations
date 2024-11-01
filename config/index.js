module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'secret',
  accessSecret: process.env.JWT_ACCESS_SECRET || 'ACCESS_SECRET',
  accessExpiry: process.env.JWT_ACCESS_EXPIRY || '10m',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'REFRESH_SECRET',
  refreshExpiry: process.env.JWT_REFRESH_EXPIRY || '1d',
  port: process.env.PORT || 3000,
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/organizations',
  safeLimit: 100
};
