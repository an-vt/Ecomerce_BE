require("dotenv").config();
const express = require('express');
const morgan = require("morgan");
const {default: helmet} = require("helmet");
const compression = require('compression');
const { checkOverload } = require('./helpers/checkConnect');
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet()); 
app.use(compression());   

// init db
require("./dbs/init.mongodb"); 
checkOverload();

// init routes
app.get("/", (req, res) => {
    return res.status(200).json({
        message: 'Welcome Fantipjs'
    })
})

// handling error

module.exports = app;