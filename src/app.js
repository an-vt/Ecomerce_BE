require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConnect');
const app = express();
const myLogger = require('./logger/mylogger.log');
const initRedis = require('./dbs/init.redis');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); //
var cookieParser = require('cookie-parser');
const ioRedis = require('./dbs/init.ioredis');

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] || uuidv4();
  req.requestId = requestId;

  myLogger.log(`Input params ::${req.method}::`, [
    req.path,
    { requestId: req.requestId },
    req.method === 'POST' ? req.body : req.query,
  ]);

  next();
});

// test redis pub/sub
// require("./tests/inventory.test");
// const productTest = require("./tests/product.test");
// productTest.purchaseProduct("product:001", 100);

// init db
require('./dbs/init.mongodb');
// checkOverload();
// init redis
initRedis.initRedis();
ioRedis.initIORedis({
  IOREDIS_IS_ENABLED: true,
});

// init routes
app.use('/', require('./routes'));

// handling error
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const resMessage = `${statusCode} - ${
    Date.now() - error.now
  }ms - response: ${JSON.stringify(error)}`;

  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: req.message },
  ]);

  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    // stack: error.stack,
    message: error.message || 'Internal Server Error',
  });
});

module.exports = app;
