const winston = require('winston')
const express = require('express');
const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http)


require('express-async-errors');
require('./startup/cookie-session')(app);
require('./startup/logging')();
require('./startup/config')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/views')(app);
require('./startup/resources')(app);
require('./startup/prod')(app);
require('./sockets/socket')(io);
require('./sockets/games')(io);

const port = process.env.PORT || 3000;
const server = http.listen(port, () => winston.info(`Listen on port ${port}`))

module.exports = server