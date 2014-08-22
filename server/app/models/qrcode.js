// app/models/qrcode.js
var mongoose = require('mongoose');

// define the schema for our store owner model
var QRCode = mongoose.Schema({
	User			: mongoose.Schema.ObjectId,
	Item			: mongoose.Schema.ObjectId,
	StoreOwner		: mongoose.Schema.ObjectId,
	numOwned		: {type: Number, default: 1}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('QRCode', QRCode);

