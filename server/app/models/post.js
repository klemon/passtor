// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

module.exports = mongoose.model('Post', {
  title : String,
  description : String,
  creator : String,
  created : String
});