const validator = require('../middlewares/validator')
const auth = require('../middlewares/auth')
const {User, validate} = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.body._id)
  res.send(_.pick(user, ['_id', 'username', 'userStats.exp', 'userStats.win', 'userStats.draw', 'userStats.lose']))
})

router.get('/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id);
  res.send(_.pick(user, ['_id', 'username', 'userStats.exp', 'userStats.win', 'userStats.draw', 'userStats.lose']))
})

router.get('/win/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id)
  user.userStats.win = user.userStats.win + 1;
  user.userStats.exp = user.userStats.exp + 100;

  await user.save();
  res.send({redirect: '/games/index'})
})

router.get('/lose/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return;

  user.userStats.lose = user.userStats.lose + 1;
  user.userStats.exp = user.userStats.exp + 50;

  await user.save();
  res.send({redirect: '/games/index'})
})

router.get('/draw/:id', auth, async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return;

  user.userStats.draw = user.userStats.draw + 1;
  user.userStats.exp = user.userStats.exp + 75;

  await user.save();
  res.send({redirect: '/games/index'})
})
router.post('/', validator(validate), async (req, res) => {
  let user = await User.findOne({email: req.body.email});
  if (user) res.status(400).send('User already registered');

  user = new User(_.pick(req.body, ['username', 'email', 'password']));

  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  user.userStats = user.generateUserStats();

  await user.save();
  
  res.send(_.pick(user, ['_id', 'username', 'email']))
  // res.send(user);
})

module.exports = router;