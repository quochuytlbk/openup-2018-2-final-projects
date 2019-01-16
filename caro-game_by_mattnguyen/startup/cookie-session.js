const cookieSession = require('cookie-session');
const config = require('config');

module.exports = function (app) {
  app.use(cookieSession({name: 'session', keys: [config.get('session')], maxAge: 24*60*60*1000}));
}