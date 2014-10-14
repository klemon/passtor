// app/models/abstractuser.js
/*
	You can use any type of user: User, AbstractUser, GeneralUser, StoreOwner,
	for querying and updating User or StoreOwner. 
	To only look through either User or StoreOwner, apply the filter {"_type": "User"}
	or {"_type": "StoreOwner"}, respectively.
*/
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');
var Schema = mongoose.Schema;
var extend = require('mongoose-schema-extend');

// define the schema for our abstract user model
// commented out local, facebook, etc. for easier programming for now
var AbstractUserSchema = new Schema({
  username            : {type: String, lowercase: true},
  username_display    : String,
  password            : String
}, {
	collection : 'users', // everything will get saved in the same collection
	discriminatorKey : '_type'
});

// This useer needs to verify the email address they gave in order
// to become a regular User. Once they verify their email then
// the "_type" field can be changed from "LockedUser" to "User".
var LockedUserSchema = AbstractUserSchema.extend({
  local                 : {
    email               : String,
    firstName           : String,
    lastName            : String
  },
  createdAt: {type: Date, expires: 60*60*24*3, default: Date.now }
});

var GeneralUserSchema = AbstractUserSchema.extend({
  local                 : {
    email               : String,
    firstName           : String,
    lastName            : String
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

var UserSchema = GeneralUserSchema.extend({
    likes               : {type: Number, default: 15},
    coins               : {type: Number, default: 0},
    lastLikeRefresh     : {type: Date, default: moment().add('h', 12).startOf('day').toDate()},
    Items               : [{num: {type: Number, default: 1}, id: mongoose.Schema.ObjectId,
                             QRCode: mongoose.Schema.ObjectId, _id: false}],
    wishlist            : [mongoose.Schema.ObjectId]
});

var StoreOwnerSchema = GeneralUserSchema.extend({
    storeName           : String,
    Items               : [{type: mongoose.Schema.ObjectId}]
});

var RedeemerSchema = AbstractUserSchema.extend({
	StoreOwner: mongoose.Schema.ObjectId
});

// methods =====================
// generating a hash
module.exports.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
module.exports.validPassword = function(password, bpassword) {
  return bcrypt.compareSync(password, bpassword);
};

// create the model for users and expose it to our app

module.exports.AbstractUser = mongoose.model('AbstractUser', AbstractUserSchema);

module.exports.LockedUser = mongoose.model('LockedUser', LockedUserSchema);

module.exports.GeneralUser = mongoose.model('GeneralUser', GeneralUserSchema);

module.exports.User = mongoose.model('User', UserSchema);

module.exports.StoreOwner = mongoose.model('StoreOwner', StoreOwnerSchema);

module.exports.Redeemer = mongoose.model('Redeemer', RedeemerSchema);