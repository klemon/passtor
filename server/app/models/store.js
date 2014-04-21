// app/models/store.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var storeSchema = mongoose.Schema({

    name     : String, // TODO: Probably should make sure names are unique
    coins    : Number,
    items    : [{
                 name : String,
                 description : String,
                 cost : Number//,
                 //expires: Date
                }]
});

// methods =====================
// create the model for users and expose it to our app
module.exports = mongoose.model('Store', storeSchema);

