// app/models/item.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our store owner model
var Item = mongoose.Schema({
	StoreOwner			: {type: mongoose.Schema.ObjectId, required: true}
    storename           : {type: String, required: true},
    name				: {type: String, required: true},
    description			: String,
    /* qrcode, later, look at node-qrcode
	barcode
	website
	expiration date
	*/
	sold				: Number,
	redeemed			: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Item', Item);

