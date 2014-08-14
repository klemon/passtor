var mongoose = require('mongoose');
var passport = require('passport');
var configDB = require('./config/database.js');
var moment	 = require('moment');
// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require('./config/passport')(passport); // pass passport for configuration

var User = require('./app/models/user');
var StoreOwner = require('./app/models/storeowner');
var Item = require('./app/models/item');
var Post = require('./app/models/post');
var Comment = require('./app/models/comment');

createJoeUser = function(SO, done) {
	var joeUser = new User();
	joeUser.local.username = "joe";
	joeUser.local.firstName = "Joseph";
	joeUser.local.lastName = "DeWilde";
	joeUser.local.email = "jzdewilde@alaska.edu";
	joeUser.local.password = joeUser.generateHash("password");
	joeUser.local.coins = 27;
	joeUser.local.likes = 12;
	joeUser.save(function(err, user) {
		if(err) {
			console.log("error in saving joeUser");
			console.log(err);
		} else {
			console.log("created joeUser");
			done(user);
		}
	});
}

createJoesPosts = function(joeUser, done) {
	Post.create({
		title: "I created my first post!",
		description: "well... here it is.",
		creator: joeUser.local.username,
		likes: 8,
		numComments: 2
	}, function(err, p1) {
		console.log("created joes posts");
		done(p1);
	});
}

createJoesComments = function(joeUser, post, done) {
	for(var i = 1; i <= 14; ++i) {
		Comment.create({
			text: i,
			Post: post._id,
			created: moment().subtract('h', i),
			creator: joeUser.local.username
		}, function(c) {});
	}
	console.log("created joes comments");
	done();
}

createBobUser = function(SO, done) {
	var bobUser = new User();
	bobUser.local.username = "bob";
	bobUser.local.firstName = "Robert";
	bobUser.local.lastName = "Smith";
	bobUser.local.email = "devauld@gmail.com";
	bobUser.local.password = bobUser.generateHash("password");
	bobUser.local.coins = 39;
	bobUser.local.likes = 1;
	bobUser.save(function(err, user) {
		if(err) {
			console.log("error in saving bobUser");
			console.log(err);
		} else {
			console.log("created bobUser");
			done(user);
		}
	});
}

createBobsPosts = function(bobUser, done) {
	Post.create({
		title: "started working out",
		description: "i ran 3  miles, woo!",
		created: moment().subtract('months', 13).subtract('days', 4).subtract('hours', 3).subtract('minutes', 13).toDate(),
		creator: bobUser.local.username
	}, function(err, p1) {
		Post.create({
			title: "Ran a long time",
			description: "Been running for over 6 months w/ no breaks",
			created: moment().subtract('months', 9).subtract('days', 13).subtract('hours', 6).subtract('minutes', 1).toDate(),
			creator: bobUser.local.username
		}, function(err, p2) {
			Post.create({
				title: "Ran a half marathon",
				description: "I ran a half marathon in 1:24:30 which a personal record",
				created: moment().subtract('months', 6).subtract('minutes', 8).toDate(),
				creator: bobUser.local.username
			}, function(err, p3) {
				Post.create({
					title: "Ran a marathon",
					description: "Ran my first marathon at 3:45:33!",
					created: moment().subtract('months', 1).subtract('h', 2).subtract('m', 28).toDate(),
					creator: bobUser.local.username,
					numComments: 14,
					likes: 14
				}, function(err, p4){
					console.log("created bobs posts");
					done(p1, p2, p3, p4);
				});
			});
		});
	});
}

createBobsComments = function(bobUser, post, done) {
	Comment.create({
		text: "Nice!",
		Post: post._id,
		created: moment().subtract('h', 48).subtract('minutes', 48).toDate(),
		creator: bobUser.local.username
	}, function(err, c1) {
		Comment.create({
			text: "Liking this again!",
			Post: post._id,
			created: moment().subtract('h', 4).toDate(),
			creator: bobUser.local.username
		}, function(err, c2) {
			console.log("created bobs comments");
			done();
		});
	});
}

createDavesItems = function(daveSO, done) {
	Item.create({
			StoreOwner: daveSO._id,
			storeName: daveSO.storeName,
			name: "Fries Discount",
			description: "Small fries are 50% off",
			cost: 2,
			sold: 2
		}, function(err, item1){
			if(err) {
				console.log(err);
			} else {
				console.log("created fries discount item");
				daveSO.Items.push(item1._id);
				Item.create({
					StoreOwner: daveSO._id,
					storeName: daveSO.storeName,
					name: "Burger Discount",
					description: "Cheeseburger is 50% off",
					cost: 4,
					sold: 1
				}, function(err, item2){
					if(err) {
						console.log(err);
					} else {
						console.log("created burger discount item");
						daveSO.Items.push(item2._id);
						Item.create({
							StoreOwner: daveSO._id,
							storeName: daveSO.storeName,
							name: "Milkshake Discount",
							description: "Medium shake is 50% off",
							cost: 3
						}, function(err, item3){
							if(err) {
								console.log(err);
							} else {
								console.log("created Milkshake discount item");
								daveSO.Items.push(item3);
								Item.create({
									StoreOwner: daveSO._id,
									storeName: daveSO.storeName,
									name: "Happier Happy Meal",
									description: "Happy meal comes with 2 extra nuggets or extra cheese in cheeseburger.",
									cost: 1
								}, function(err, item4){
									if(err) {
										console.log(err);
									} else {
										console.log("created happier Happy meal item");
										daveSO.Items.push(item4);
										daveSO.save(function(err, SO) {
											if(err) {
												console.log("error in creating daveSO");
												console.log(err);
											} else {
												done(SO, item1, item2, item3, item4);
											}
										});
									}
								});
							}
						});
					}
				});
			}
		});
}

var daveUser = new User();
daveUser.local.username      = "Dave";
daveUser.local.password      = daveUser.generateHash("password");
daveUser.save(function(err, user) {
    if(err) {
    	console.log("error in creating daveUser");
    	console.log(err);
    } else {
		console.log("created daveUser");
		var daveSO = new StoreOwner();
		daveSO.User 			= user._id;
		daveSO.email         = "Dave@yahoo.com";
		daveSO.firstName     = "David";
		daveSO.lastName      = "Davidson";
		daveSO.storeName		= "McDankey";
		daveSO.username		= daveUser.local.username;
		daveSO.Items 		= [];
		createDavesItems(daveSO, function(daveUser2, item1, item2, item3, item4) {
			user.local.StoreOwner = daveUser2._id;
			user.save(function(err, user2) {
				if(err) {
					console.log("error in saving daveUser");
					console.log(err);
				} else {
					console.log("created daveSO");
					createJoeUser(daveUser2, function(joeUser) {
						joeUser.local.Items.push({num: 2, id: item1._id});
						joeUser.local.Items.push({num: 1, id: item2._id});
						joeUser.save(function(err, joeUser2) {
							createJoesPosts(joeUser, function(jp1) {
								createBobUser(daveUser2, function(bobUser) {
									createBobsPosts(bobUser, function(bp1, bp2, bp3, bp4) {
										createBobsComments(bobUser, jp1, function() {
											createJoesComments(joeUser, bp4, function() {
												console.log("all done");
											});
										});
									});
								});	
							});
						});
					});
				}
			});
		});
	}
});