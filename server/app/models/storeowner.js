// app/models/storeowner.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our store owner model
var StoreOwner = mongoose.Schema({
    storename           : {type: String, required: true, unique: true},
    password            : {type: String, required: true},
    email               : {type: String, required: true, unique: true},
    Items               : [{type: mongoose.Schema.ObjectId}],
    User                : {type: mongoose.Schema.ObjectId, required: true, unique: true}
});

// methods =====================
// generating a hash
StoreOwner.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
StoreOwner.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('StoreOwner', StoreOwner);

