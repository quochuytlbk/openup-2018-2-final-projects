const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minlength: 5,
    maxlength: 256,
    required: true
  },
  email: {
    type: String,
    minlength: 9,
    maxlength: 256,
    required: true 
  },
  password: {
    type: String,
    minlength: 10,
    maxlength: 1024,
    required: true 
  },
  userStats: {
    exp: {
      type: Number,
      min: 0,
    },
    totalGame: {
      type: Number,
      min: 0,
    },
    win: {
      type: Number,
      min: 0,
    },
    draw: {
      type: Number,
      min: 0,
    },
    lose: {
      type: Number,
      min: 0,
    },
    trophy: {
      type: String,
      enum: ['common', '3rd', '2nd', '1st'],
    }
  },
  matchs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'match'
  }],
  friendList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;
}

userSchema.methods.generateUserStats = () => {
  return {
    exp: 0,
    totalGame: 0,
    win: 0,
    draw: 0,
    lose: 0,
    trophy: 'common'
  }
}

const User = mongoose.model('User', userSchema);

function validateUser(user) { 
  const schema = {
    username: Joi.string().min(5).max(256).required(),
    email: Joi.string().email().min(9).max(256).required(),
    password: Joi.string().min(8).max(50).required()
  }
  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;