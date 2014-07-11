// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
// commented out local, facebook, etc. for easier programming for now
var User = mongoose.Schema({
  local                 : {
    username            : String,
    password            : String,
    email               : String,
    firstName           : String,
    lastName            : String,
    likes               : Number,
    coins               : Number,
    StoreOwner          : mongoose.Schema.ObjectId,
    Posts               : [{type : mongoose.Schema.ObjectId}]
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

