const bcrypt = require('bcrypt');
const validator = require('../middlewares/validator')
const Joi = require('joi');
const { User } = require('../models/user')
const express = require('express');
const router = express.Router();

router.post('/', validator(validate), async (req, res) => {
  let user = await User.findOne({username: req.body.user})
  if (!user) {
    user = await User.findOne({email: req.body.user})
    if (!user) return res.status(400).send('Invalid username/email or password')
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username/email or password')
  
  const token = user.generateAuthToken();
  req.session.token = token

  res.send({token: token, redirect: '/games/index'})
})

function validate(req) {
  const schema = {
    user: Joi.string().min(5).max(256).required(),
    password: Joi.string().min(8).max(50).required()
  }

  return Joi.validate(req, schema)
}

module.exports = router