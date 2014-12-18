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
  username            : Number // We could encrypt this for safety?
}, {
	collection : 'users', // everything will get saved in the same collection
	discriminatorKey : '_type'
});

var GeneralUserSchema = AbstractUserSchema.extend({
  facebook              : {
    id                  : String, // Do we need this?
    token               : String, // Do we need this?
    email               : String,
    name                : String,
    firstName           : String,
    lastName            : String,
    gender              : String
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

module.exports.GeneralUser = mongoose.model('GeneralUser', GeneralUserSchema);

module.exports.User = mongoose.model('User', UserSchema);

module.exports.StoreOwner = mongoose.model('StoreOwner', StoreOwnerSchema);

module.exports.Redeemer = mongoose.model('Redeemer', RedeemerSchema);