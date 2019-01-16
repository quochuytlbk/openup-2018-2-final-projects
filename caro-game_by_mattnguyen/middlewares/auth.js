const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('token') || req.session.token;
  if (!token) return res.status(401).redirect('/games/signin');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.body = decoded;
    next();   
  }
  catch(ex) {
    res.status(400).send('Invalid token')
  }
}