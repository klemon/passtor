// app/models/post.js
// load the things we need
var mongoose = require('mongoose');

var Post = mongoose.Schema({
  title : String,
  description : String,
  created : {year: Number, month: Number, day: Number},
  creator : String,
  likes : {type : Number, default : 0}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Post', Post);