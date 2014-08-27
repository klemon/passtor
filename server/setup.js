var mongoose = require('mongoose');
var configDB = require('./config/database.js');
var moment	 = require('moment');
var extend	 = require('mongoose-schema-extend');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

//var User = require('./app/models/user').User;
//var StoreOwner = require('./app/models/storeowner');
//var StoreOwner = require('./allusers');
var AllUsers = require('./app/models/allusers'),
	AbstractUser = AllUsers.AbstractUser,
	GeneralUser = AllUsers.GeneralUser,
	StoreOwner = AllUsers.StoreOwner,
	User = AllUsers.User;
var Item = require('./app/models/item');
var Post = require('./app/models/post');
var Comment = require('./app/models/comment');
var QRCode = require('./app/models/qrcode');

createJoeUser = function(SO, done) {
	var joeUser = new User();
	joeUser.username = "joe";
	joeUser.password = AllUsers.generateHash("password");
	joeUser.local.firstName = "Joseph";
	joeUser.local.lastName = "DeWilde";
	joeUser.local.email = "jzdewilde@alaska.edu";
	joeUser.coins = 27;
	joeUser.likes = 12;
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

/*
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
}*/

createJoesPosts = function(joeUser, done) {
	Post.create({
		title: "I created my first post!",
		description: "well... here it is.",
		creator: joeUser.username,
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
			creator: joeUser.username
		}, function(c) {});
	}
	console.log("created joes comments");
	done();
}

createBobUser = function(SO, done) {
	var bobUser = new User();
	bobUser.username = "bob";
	bobUser.password = AllUsers.generateHash("password");
	bobUser.local.firstName = "Robert";
	bobUser.local.lastName = "Smith";
	bobUser.local.email = "devauld@gmail.com";
	bobUser.coins = 39;
	bobUser.likes = 1;
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
		creator: bobUser.username
	}, function(err, p1) {
		Post.create({
			title: "Ran a long time",
			description: "Been running for over 6 months w/ no breaks",
			created: moment().subtract('months', 9).subtract('days', 13).subtract('hours', 6).subtract('minutes', 1).toDate(),
			creator: bobUser.username
		}, function(err, p2) {
			Post.create({
				title: "Ran a half marathon",
				description: "I ran a half marathon in 1:24:30 which a personal record",
				created: moment().subtract('months', 6).subtract('minutes', 8).toDate(),
				creator: bobUser.username
			}, function(err, p3) {
				Post.create({
					title: "Ran a marathon",
					description: "Ran my first marathon at 3:45:33!",
					created: moment().subtract('months', 1).subtract('h', 2).subtract('m', 28).toDate(),
					creator: bobUser.username,
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
		creator: bobUser.username
	}, function(err, c1) {
		Comment.create({
			text: "Liking this again!",
			Post: post._id,
			created: moment().subtract('h', 4).toDate(),
			creator: bobUser.username
		}, function(err, c2) {
			console.log("created bobs comments");
			done();
		});
	});
}

createDavesItems = function(daveSO, done) {
	var items = [];
	Item.create({
		StoreOwner: daveSO._id,
		storeName: daveSO.storeName,
		name: "Fries Discount",
		description: "Small fries are 50% off",
		cost: 2,
		sold: 2
	}).then(function(item){
		daveSO.Items.push(item);
		return Item.create({
			StoreOwner: daveSO._id,
					storeName: daveSO.storeName,
					name: "Burger Discount",
					description: "Cheeseburger is 50% off",
					cost: 4,
					sold: 1
		});
	}).then(function(item){
		daveSO.Items.push(item);
		return Item.create({
			StoreOwner: daveSO._id,
			storeName: daveSO.storeName,
			name: "Milkshake Discount",
			description: "Medium shake is 50% off",
			cost: 3
		});
	}).then(function(item){
		daveSO.Items.push(item);
		return Item.create({
			StoreOwner: daveSO._id,
			storeName: daveSO.storeName,
			name: "Happier Happy Meal",
			description: "Happy meal comes with 2 extra nuggets or extra cheese in cheeseburger.",
			cost: 1
		});
	}).then(function(item) {
		daveSO.Items.push(item);
		return StoreOwner.findByIdAndUpdate(daveSO._id, {$set: {'Items': daveSO.Items}},
				 {safe: true, upsert: true}).exec();
	}).then(function(user) {
		done(user);
	}).then(null, function(err) {
		console.log(err);
	});
}
/*
var daveSO = new StoreOwner();
daveSO.username = "Dave";
daveSO.password = AllUsers.generateHash("password");
daveSO.local.firstName = "David";
daveSO.local.lastName = "Davidson";
daveSO.local.email = "davey@yahoo.com";
daveSO.storeName = "McDankey";
daveSO.likes = 2;
daveSO.save(function(err, SO) {
	if(err) console.log(err);
	console.log("created daveSO");
	createDavesItems(SO, function(daveUser2) {
		createJoeUser(daveUser2, function(joeUser) {
			QRCode.create({
				User: joeUser._id,
				Item: daveUser2.Items[0],
				StoreOwner: daveUser2._id,
				numOwned: 2
			}).then(function(qrcode) {
				joeUser.Items.push({num: 2, id: daveUser2.Items[0],
					QRCode: qrcode._id});
				return QRCode.create({
					User: joeUser._id,
					Item: daveUser2.Items[1],
					StoreOwner: daveUser2._id,
					numOwned: 1
				});
			}).then(function(qrcode) {
				joeUser.Items.push({num: 1, id: daveUser2.Items[1],
					QRCode: qrcode._id});
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
			}).then(null, function(err) {
				console.log(err);
			});
		});
	});
});
*/
/*
var daveUser;
var daveSO;
User.create({
	local: {username: "Dave"}
}).then(function(user) {
	return User.findByIdAndUpdate(user._id, {$set: 
		{'local.password': user.generateHash('password')}}).exec();
}).then(function(user) {
	daveUser = user;
	console.log("created daveUser");
	return StoreOwner.create({
		User: daveUser._id,
		email: "Dave@yahoo.com",
		firstName: "David",
		lastName: "Davidson",
		storeName: "McDankey",
		username: daveUser.local.username
	});
}).then(function(SO) {
	console.log("created daveSO");
	daveSO = SO;
	return User.findByIdAndUpdate(daveUser._id, {$set: {'local.StoreOwner': SO._id}}).exec();
}).then(function(user) {
	createDavesItems(daveSO, function(daveUser2) {
		createJoeUser(daveUser2, function(joeUser) {
			QRCode.create({
				User: joeUser._id,
				Item: daveUser2.Items[0],
				StoreOwner: daveUser2._id,
				numOwned: 2
			}).then(function(qrcode) {
				joeUser.local.Items.push({num: 2, id: daveUser2.Items[0],
					QRCode: qrcode._id});
				return QRCode.create({
					User: joeUser._id,
					Item: daveUser2.Items[1],
					StoreOwner: daveUser2._id,
					numOwned: 1
				});
			}).then(function(qrcode) {
				joeUser.local.Items.push({num: 1, id: daveUser2.Items[1],
					QRCode: qrcode._id});
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
			}).then(null, function(err) {
				console.log(err);
			});
		});
	});
}).then(null, function(err) {
	console.log(err);
});*/

AbstractUser.findOne({"username":"joe"}, function(err, user) {
		++user.likes;
		console.log("u1: " + user);
		user.save(function(err, user2) {
			console.log("u2: " + user2);
			User.findOne({"username":"joe"}, function(err, user3) {
				++user3.coins;
				user3.save(function(err, user4) {
					console.log("u3: " + user4);
				})
			})
		});
});