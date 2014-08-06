// app/models/item.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our store owner model
var Item = mongoose.Schema({
	StoreOwner			: mongoose.Schema.ObjectId,
    storeName           : String,
    name				: String,
    description			: String,
    cost				: Number,
    created				: {type: Date, default: Date.now},
    /* qrcode, later, look at node-qrcode
	barcode
	website
	expiration date
	*/
	sold				: {type: Number, default: 0},
	redeemed			: {type: Number, default: 0}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Item', Item);

