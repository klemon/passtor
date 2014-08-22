// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');

// define the schema for our user model
// commented out local, facebook, etc. for easier programming for now
var User = mongoose.Schema({
  local                 : {
    username            : String,
    password            : String,
    email               : String,
    firstName           : String,
    lastName            : String,
    likes               : {type: Number, default: 15},
    coins               : {type: Number, default: 0},
    lastLikeRefresh     : {type: Date, default: moment().add('h', 12).startOf('day').toDate()},
    StoreOwner          : {type: mongoose.Schema.ObjectId, default: null},
    Items               : [{num: {type: Number, default: 1}, id: mongoose.Schema.ObjectId,
                             QRCode: mongoose.Schema.ObjectId, _id: false}],
    wishlist            : [mongoose.Schema.ObjectId]
  },
  facebook              : {
    id                  : String,
    token               : String,
    email               : String,
    name                : String
  },
  twitter               : {
    id                  : String,
    token               : String,
    displayName         : String,
    username            : String
  },
  google                : {
    id                  : String,
    token               : String,
    email               : String,
    name                : String
  }
});

// methods =====================
// generating a hash
User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', User);

