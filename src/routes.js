const express = require('express');
const Router = express.Router();
const path = require('path');

const authRouters = require('./routers/authRouters');
const userRouters = require('./routers/userRouters');

//MODULES ROUTERS
Router.use("/auth", authRouters);
Router.use("/users", userRouters);

module.exports = Router;
