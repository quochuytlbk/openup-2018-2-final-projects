const auth = require('../middlewares/auth')
const { User } = require('../models/user')
const express = require('express');
const router = express.Router();

router.get('/signin', async (req, res) => {
  res.render('signin');
})

router.get('/signup', async (req, res) => {
  res.render('signup');
})

router.get('/index', auth, async (req, res) => {
  res.render('index');
})

module.exports = router;
