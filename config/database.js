const mongoose = require('mongoose');
const { mongoUrl } = require('./index');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // eslint-disable-next-line no-console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
