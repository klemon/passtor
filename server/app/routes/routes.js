var Post = require('../models/post');
var Comment = require('../models/comment');
var User = require('../models/user');
var StoreOwner = require('../models/storeowner');
var Item = require('../models/item');
var Store = require('../models/store');
var mongoose = require('mongoose');
var express = require('express');
var moment = require('moment');

postInfo = function(post) {
	return {title: post.title, description: post.description, creator: post.creator,
		created: post.created, id: post._id, likes: post.likes, numComments: post.numComments};
}

userInfo = function(user) {
	return {username: user.username, email: user.email, firstName: user.firstName, lastName: user.lastName,
		coins: user.coins, likes: user.likes};
}

itemInfo = function(item) {
	return {storeName: item.storeName, name: item.name, description: item.description,
		sold: item.sold, redeemed: item.redeemed, id: item._id, cost: item.cost, created: item.created};
}

storeOwnerInfo = function(storeOwner) {
	return {storeName: storeOwner.storeName, username: storeOwner.username, email: storeOwner.email, 
		firstName: storeOwner.firstName, lastName: storeOwner.lastName};

}

commentInfo = function(comment) {
	return {text: comment.text, created: comment.created, creator: comment.creator};
}

module.exports = function(app, jwtauth) {

	// api --------------------------------------------------------------------
	
	// ======================================
	// HOME PAGE (with login links) =========
	// ======================================
	app.get('/', function(req, res) {
	  res.render('index.ejs'); // load the index.ejs file
	});

	app.post('/', function(req, res) {
	  res.render('index.ejs'); // load the index.ejs file
	});
	
	app.post('/posts', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		var count;
		var userFilter = {};
		if(req.body.username) {
			userFilter = {'creator': req.body.username};
		}
		Post.count(userFilter).exec().then(function(c) {
			count = c;
			var sort;
			if(req.body.sort == 0) { // Dated added (newest - oldest)
				sort = {"created" : "descending"};
			} else if(req.body.sort == 1) {// Date added (oldest - newest)
				sort = {"created" : "ascending"};
			} else {
				sort = {"likes" : "descending"};
			}
			var lastDateFilter = {};
			if(req.body.lastDate) {
				if(req.body.sort == 0) {
					lastDateFilter = {'created': {$lt: req.body.lastDate}};
				} else {
					lastDateFilter = {'created': {$gt: req.body.lastDate}};
				}
				return Post.find({$and: [userFilter, lastDateFilter]}).limit(3).sort(sort).exec();
			} else {
				return Post.find(userFilter).skip(req.body.page*3).limit(3).sort(sort).exec();
			}
		}).then(function(posts) {
				var postList = [];
				for (var i = 0; i < posts.length; i++) {
					postList.push(postInfo(posts[i]));
				}
				res.json({posts: postList, coins: req.user.coins, likes: req.user.likes, numPosts: count});
		}).then(null, function(err) {
			console.log(err);
			res.json({err:err});
		});
	});

	app.post('/user', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		User.findOne({'local.username' : req.body.otherUsername}).exec().then(function(user) {
			if(!user) {
				throw new Error("Did not find user");
			} else {
				res.json({user: userInfo(user.local),
					coins: req.user.coins, likes: req.user.likes});
			}
		}).then(null, function(err) {
			console.log(err);
			res.json({err:err});
		});
	});

	app.post('/storeOwner', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		StoreOwner.findOne({'storeName' : req.body.storeName}).exec().then(function(storeOwner) {
			if(!storeOwner) {
				throw new Error("Did not find store owner");
			} else {
				if(req.isSO)
					res.json({storeOwner: storeOwnerInfo(storeOwner)});
				else {
					res.json({storeOwner: storeOwnerInfo(storeOwner),
					coins: req.user.coins, likes: req.user.likes});
				}
			}
		}).then(null, function(err) {
			console.log(err);
			res.json({err: err});
		});
	});	

	app.post('/editPost', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		Post.findById(req.body.id).exec().then(function(post) {
			if(!post) {
				throw new Error("Did not find post.");
			} else {
				var text = "\nEdit: ";
				text = text + req.body.edit;
				return Post.findByIdAndUpdate(req.body.id, {$set: {description: post.description+text}}).exec();
			}
		}).then(function(editedPost) {
			res.json({post: postInfo(editedPost), coins: req.user.coins, likes: req.user.likes});
		}).then(null, function(err) {
			console.log(err);
			res.json({err:err});
		});
	});

	app.post('/createPost', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		Post.create({
			title: req.body.title,
			description: req.body.description,
			creator: req.user.username
		}).then(function(post) {
			res.json({post: postInfo(post)});
		}).then(null, function(err) {
			console.log(err);
			res.json({err:err});
		});
	});

	app.post('/updateProfile', [express.json(), express.urlencoded(), jwtauth], function(req,res){
		if(!req.body.email) {
			return res.json({err: "Please provide an email"});
		}
		User.findByIdAndUpdate(req.id, {$set: {'local.firstName': req.body.firstName, 
		'local.lastName': req.body.lastName, 'local.email': req.body.email}}, 
			{safe: true, upsert: true}).exec().then(function(user) {
			if(!user) {
				throw new Error("Did not find user.");
			} else {
				console.log("user: " + userInfo(user.local));
				res.json({user: userInfo(user.local), coins: req.user.coins, likes: req.user.likes});
			}
		}).then(null, function(err) {
			console.log(err);
			res.json({err:err});
		});
	 });

	app.post('/update', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		res.json({coins: req.user.coins, likes: req.user.likes});
	});

	app.post('/like', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		if(!req.user.likes) {
			res.json({err: "No likes left"});
		} else {
			var postId;
			var addForUserComment = 0;
			var userObj;
			var postObj;
			if(req.body.text)
				addForUserComment = 1;
			Post.findById(req.body.postId).exec().then(function(post) {
				if(!post) {
					throw new Error("Did not find post.");
				} else if(post.creator == req.user.username) {
					throw new Error("User cannot like their own post.");
				} else {
					postId = post._id;
					return User.findOneAndUpdate({'local.username' : post.creator}, {$inc: {'local.coins': 1}},
					 {safe: true, upsert: true}).exec();
				}
			}).then(function(user) {
				if(!user) {
					throw new Error("Did not find user.");
				} else {
					return User.findByIdAndUpdate(req.id, {$inc: {'local.coins': 1, 'local.likes': -1}},
						{safe: true, upsert: true}).exec();
				}
			}).then(function(user) {
				if(!user) {
					throw new Error("Did not find user.");
				} else {
					userObj = user;
					return Post.findByIdAndUpdate(postId, {$inc: {'likes': 1, 'numComments': addForUserComment}}).exec();
				}
			}).then(function(post) {
				postObj = post;
				if(req.body.text) {
					return Comment.create({
						text: req.body.text,
						Post : req.body.postId,
						creator: req.user.username
					});
				}
			}).then(function(comment) {
				if(req.body.text) {
					res.json({comment: commentInfo(comment), post: postInfo(postObj),
					coins: userObj.local.coins, likes: userObj.local.likes});
				} else {
					res.json({comment : null, post: postInfo(postObj),
						coins: userObj.local.coins, likes: userObj.local.likes});
				}
			}).then(null, function(err) {
				console.log(err);
				res.json({err:err});
			});
		}
	});

	app.post('/comments', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		var commentList = [];
		var query;
		if(req.body.lastDate) {
			query = Comment.find({$and: [{'Post':mongoose.Types.ObjectId(req.body.postId)},
			 {'created':{$lt: req.body.lastDate}}]}).limit(3).sort({"created":-1});
		} else {
			query = Comment.find({'Post':mongoose.Types.ObjectId(req.body.postId)}).limit(3).sort({"created":-1});
		}
		query.exec(function(err, comments) {
			if(err) {
				console.log("Error in finding comments");
				console.log(err);
				res.json({err: err});
			} else if(!comments) {
				console.log("Didn't find comments");
				res.json({err: "Didn't find comments"});
			} else {
				Post.findById(req.body.postId, function(err, post) {
					if(err) {
						console.log("Error in finding post for commments");
						console.log(err);
					} else if(!post) {
						console.log("Didn't find post for comments");
					} else {
						console.log("Found comments");
						for(var i = 0; i < comments.length; ++i) {
							commentList.push({text: comments[i].text, created: comments[i].created,
												creator: comments[i].creator});
						}
						res.json({comments: commentList, coins: req.user.coins, likes: req.user.likes,
							numComments: post.numComments});
					}
				});
			}
		});
	});

app.post('/createItem', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	if(req.user.storeName) {
		Item.create({
			StoreOwner : req.id,
			storeName : req.user.storeName,
			name : req.body.name,
			description : req.body.description,
			cost : req.body.cost
		}, function(err, item) {
			if(err) {
				console.log("error in creating item");
				console.log(err);
				res.json({err: err});
			} else {
				res.json({item : itemInfo(item), coins: req.user.coins, likes: req.user.likes});
			}
		});
	}
});

app.post('/items', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	var itemList = [];
	var sort;
	var query;
	var lastDateFilter = {};
	if(req.body.sort == 0) { // Dated added (newest - oldest)
		sort = {"created" : "descending"};
	} else if(req.body.sort == 1) {// Date added (oldest - newest)
		sort = {"created" : "ascending"};
	} else if(req.body.sort == 2) { // Most sold
		sort = {"sold" : "descending"};
	} else { // Most redeemed
		sort = {"redeemed" : "descending"};
	}
	if(req.body.lastDate) {
		if(req.body.sort == 0) {
			lastDateFilter = {'created': {$lt: req.body.lastDate}};
		} else {
			lastDateFilter = {'created': {$gt: req.body.lastDate}};
		}
	}		
	if(!req.body.all && !req.body.isSO) {
		// Return items belonging to a user
		var itemIds = [];
		for(var j = 0; j < req.user.Items.length; ++j) {
			itemIds.push(req.user.Items[j].id);
		}
		if(req.body.lastDate) {
			query = Item.find({$and: [{"_id": {$in: itemIds}}, lastDateFilter]}).limit(3).sort(sort);
		} else {
			query = Item.find({"_id": {$in: itemIds}}).skip(req.body.page*3).limit(3).sort(sort);
		}
		query.exec(function(err, items) {
			for(var i = 0; i < items.length; ++i) {
				itemList.push(itemInfo(items[i]));
			}
			console.log("returning items of a user");
			res.json({items: itemList, itemNums: req.user.Items,
				coins: req.user.coins, likes: req.user.likes, numItems: itemIds.length});
		});
	} else {
		userFilter = {};
		if(!req.body.all && req.body.isSO) {
			// Return item belonging to an SO
			userFilter = {StoreOwner: req.id};
		}
		Item.count(userFilter, function(err, c) {
			if(err) {
				console.log("error in determing item count");
				console.log(err);
				res.json({err: err});
			}
			if(req.body.lastDate) {
				query = Item.find({$and: [userFilter, lastDateFilter]}).limit(3).sort(sort);
			} else {
				query = Item.find(userFilter).skip(req.body.page*3).limit(3).sort(sort);
			}
			query.exec(function (err, items){
				for (var i = 0; i < items.length; i++) {
					itemList.push(itemInfo(items[i]));
				}
				console.log("returning items");
				var returnObject = {items: itemList, numItems: c};
				if(req.body.all || !req.body.isSO)  {
					returnObject.itemNums = req.user.Items;
					returnObject.likes = req.user.likes;
					returnObject.coins = req.user.coins;
				}
				res.json(returnObject);
			});
		});
	}
});

app.post('/wishlistIds', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	res.json({wishlistIds: req.user.wishlist, coins: req.user.coins, likes: req.user.likes});
});

app.post('/wishlist', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	var itemList = [];
	var sort;
	var query;
	var lastDateFilter = {};
	if(req.body.sort == 0) { // Dated added (newest - oldest)
		sort = {"created" : "descending"};
	} else if(req.body.sort == 1) {// Date added (oldest - newest)
		sort = {"created" : "ascending"};
	} else if(req.body.sort == 2) { // Most sold
		sort = {"sold" : "descending"};
	} else { // Most redeemed
		sort = {"redeemed" : "descending"};
	}
	if(req.body.lastDate) {
		if(req.body.sort == 0) {
			lastDateFilter = {'created': {$lt: req.body.lastDate}};
		} else {
			lastDateFilter = {'created': {$gt: req.body.lastDate}};
		}
	}		
	if(req.body.lastDate) {
		query = Item.find({$and: [{"_id": {$in: req.user.wishlist}}, lastDateFilter]}).limit(3).sort(sort);
	} else {
		query = Item.find({"_id": {$in: req.user.wishlist}}).skip(req.body.page*3).limit(3).sort(sort);
	}
	query.exec(function(err, items) {
		for(var i = 0; i < items.length; ++i) {
			itemList.push(itemInfo(items[i]));
		}
		console.log("returning wishlist of a user");
		res.json({items: itemList, numItems: items.length, itemNums: req.user.Items,
		 coins: req.user.coins, likes: req.user.likes});
	});
});

app.post('/addToWishlist', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	Item.findById(mongoose.Types.ObjectId(req.body.id), function(err, item) {
		if(err) {
			console.log("error in /addToWishlist");
			res.json({err:err});
		} else if(!item) {
			console.log("item not found in /addToWishlist");
			res.json({err: "item not found"});
		} else {
			User.findByIdAndUpdate(req.id, {$push: {"local.wishlist": item._id}}, {safe: true, upsert: true}, function(err, user) {
				if(err) {
					console.log("error in /addToWishlist");
					console.log(err);
					res.json({err: err});
				} else {
					res.json({coins: req.user.coins, likes: req.user.likes});
				}
			});
		}
	});
});

app.post('/removeFromWishlist', [express.json(), express.urlencoded(), jwtauth], function(req, res, next) {
	User.findById(req.id, function(err, user) {
		for(var i = 0; i < user.local.wishlist.length; ++i) {
			if(user.local.wishlist[i].equals(mongoose.Types.ObjectId(req.body.id))) {
				user.local.wishlist.splice(i, 1);
				console.log("removed item from wishlist");
				break;
			}
		}
		user.save(function(err, user2) {
			if(err) {
				console.log(err);
				res.json({err: err});
			} else {
				res.json({coins: user2.local.coins, likes: user2.local.likes});
			}
		});
	});
});

app.post('/deleteItem', [express.json(), express.urlencoded(), jwtauth], function(req, res, next) {
	Item.findById(req.body.id, function(err, item) {
		if(item.StoreOwner == mongoose.Types.ObjectId(req.body.id))
			res.json({message:"Can't delete item"});
		else {
			Item.remove({'_id': mongoose.Types.ObjectId(req.body.id)}, function(err, result) {
				if(err) {
					console.log("error in deleting item");
					console.log(err);
					res.json({err: err});
				} else if(!result) {
					console.log("failed to delete item");
					res.json({err: "failed to delete item"});
				} else {
					console.log("deleted item");
					res.json({coins: req.user.coins, likes: req.user.likes});
				}
			});
		}
	});
 });

app.post('/editItem', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	Item.findById(req.body.id, function(err, item) {
		if(item.StoreOwner == req.id) {
			Item.findByIdAndUpdate(req.body.id, {$set: {name: req.body.name, 
				description: req.body.description}}, {safe: true, upsert: true}, function(err, item2) {
				if(err) {
					console.log("error in editing item");
					console.log(err);
					res.json({err: err});
				} else if(!item2) {
					console.log("didn't find item");
					res.json({err: "didn't find item"});
				} else {
					console.log("edited item");
					res.json({item: itemInfo(item2), coins: req.user.coins, likes: req.user.likes});
				}
			});
		}
	})
});

app.post('/buyItem', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	Item.findById(req.body.id, function(err, item) {
		if(err) {
			console.log("error in buying item");
			console.log(err);
			res.json({err: err});
		} else if(!item) {
			console.log("couldn't find item for buying");
			res.json({err: "couldn't find item for buyting"});
		} else if(req.user.coins < item.cost) {
			console.log("user coins: " + req.user.coins);
			console.log("item cost: " + item.cost);
			console.log("user doesn't have enough to buy item");
			res.json({err: "not enough coins to buy"});
		} else {
			User.findById(req.id, function(err, user) {
				if(err) {
			 		console.log("error in finding user for /buyItem");
			 		console.log(err);
			 		res.json({err: err});
			 	} else if(!user) {
			 		console.log("didn't find user for /buyItem");
			 		res.json({err: "no user found"});
			 	} else {
					var hasItem = false;
					for(var i = 0; i < user.local.Items.length; ++i) {
						if(user.local.Items[i].id.equals(item._id)) {
							hasItem = true;
							++user.local.Items[i].num;
							break;
						}
					}
					user.local.coins -= item.cost;
					if(!hasItem) {
						user.local.Items.push({num: 1, id: item._id});
					}
					user.save(function(err, user2) {
						if(err) {
							console.log("error in saving for /buyItem");
							console.log(err);
							res.json({err: err});
						} else {
							console.log("User bought item");
							res.json({coins: user2.local.coins, likes: user2.local.likes});
						}
					})
				}
			});
		}
	});
});
}




