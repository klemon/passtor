// app/models/comment.js
var mongoose = require('mongoose');

var Comment = mongoose.Schema({
  text: String,
  Post: mongoose.Schema.ObjectId,
  created: {type: Date, default: Date.now},
//  created : {year: Number, month: Number, day: Number},
  creator : String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Comment', Comment);