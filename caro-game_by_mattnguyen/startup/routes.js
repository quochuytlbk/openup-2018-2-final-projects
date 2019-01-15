const express = require('express')
const users = require('../routes/users')
const games = require('../routes/games')
const auth = require('../routes/auth')
const error = require('../middlewares/error')

module.exports = function (app) {
  app.use(express.json());
  app.use('/users', users);
  app.use('/games', games);
  app.use('/auth', auth);
  app.use(error);
}
