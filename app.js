const createError = require('http-errors');
const express = require('express');
const cors = require('cors');
const path = require('path');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger-output.json');
const cookieParser = require('cookie-parser');
const morganLogger = require('morgan');
const { stream, logger } = require('./utils/winston');
const connectDB = require('./config/database');
const config = require('./config');
const usersRouter = require('./routes/users');
const organizationsRouter = require('./routes/organizations');


const app = express();

connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(morganLogger('combined', { stream }));
app.use(
  cors({
    origin: config.origin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/organizations', organizationsRouter);
app.use('/users', usersRouter);
// // Serve swagger docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  logger.error(err.message);
  res.status(err.status || 500);
  res.json({
    message: err.message || 'something went wrong',
    // Optionally include stack trace in development
    stack: req.app.get('env') === 'development' ? err.stack : {},
  });
});

module.exports = app;
