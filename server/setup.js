var mongoose = require('mongoose');
var passport = require('passport');
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

var User = require('./app/models/user');
var StoreOwner = require('./app/models/storeowner');

var newUser = new User();
newUser.local.username      = "Dave";
newUser.local.password      = newUser.generateHash("password");
newUser.save(function(err, user) {
    if(err) {
    	console.log("error in creating user");
    	console.log(err);
    } else {
		console.log("Created a new user.");
		var newSO = new StoreOwner();
		newSO.User = user._id;
		newSO.email         = "Dave@yahoo.com";
		newSO.firstName     = "David";
		newSO.lastName      = "Davidson";
		newSO.storeName		= "McDankey";
		newSO.save(function(err, SO) {
			if(err) {
				console.log("error in creating SO");
				console.log(err);
			} else {
				console.log("created a new SO");
				user.local.StoreOwner = SO._id;
				user.save(function(err, user2) {
					if(err) {
						console.log("error in saving user");
						console.log(err);
					} else {
						console.log("Done with creating SO Dave");
					}
				})
			}
		});
	}
});