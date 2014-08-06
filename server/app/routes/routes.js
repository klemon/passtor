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
		var postList = [];
		var sort;
		var query;
		var userFilter = {};
		if(!req.body.all) {
				userFilter = {'creator': req.body.username};
		}
		Post.count(userFilter, function(err, c) {
			if(err) {
				console.log("error in determing posts count");
				console.log(err);
				res.json({err: err});
			}
			var lastDateFilter = {};
			if(req.body.sort == 0) { // Dated added (newest - oldest)
				sort = {"created" : "descending"};
			} else if(req.body.sort == 1) {// Date added (oldest - newest)
				sort = {"created" : "ascending"};
			} else {
				sort = {"likes" : "descending"};
			}
			if(req.body.lastDate) {
				if(req.body.sort == 0) {
					lastDateFilter = {'created': {$lt: req.body.lastDate}};
				} else {
					lastDateFilter = {'created': {$gt: req.body.lastDate}};
				}
				query = Post.find({$and: [userFilter, lastDateFilter]}).limit(3).sort(sort);
			} else {
				query = Post.find(userFilter).skip(req.body.page*3).limit(3).sort(sort);
			}
			query.exec(function (err, posts){
				for (var i = 0; i < posts.length; i++) {
					postList.push(postInfo(posts[i]));
				}
				res.json({posts: postList, coins: req.user.coins, likes: req.user.likes, numPosts: c});
			});
		});
	});

	app.post('/user', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		User.findOne({'local.username' : req.body.otherUsername}, function(err, user) {
			if (err) {
				console.log("Error in finding user");
				return res.json({err: "Error in finding user"});
			} else if(!user) {
				console.log("No user is found.");
				return res.json({err: "Couldn't find user."});
			} else {
				return res.json({user: userInfo(user.local),
					coins: req.user.coins, likes: req.user.likes});
			}
	    });
	});

	// not currently being used, A post is chosen from a list of posts currently so there
	// is no need to load a single post
	app.post('/loadpost', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		Post.findOne({ '_id' : req.id }, function(err, post) {
	      // if there are any errors, return the error before anything else
	      if (err)
	      {
	        console.log("Error in logging in");
	        return res.send(err);
	      }

	      // if no user is found, return the message
	      if(!post)
	      {
	        console.log("No post is found");
	        return res.send("Post does not exist.");
	      }
			return res.json({post: {title: post.title, description: post.description, created: post.created,
				creator: post.creator, likes: post.likes, id: post._id, numComments: post.numComments}});
	    });
	});

	app.post('/editPost', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		Post.findById(req.body.id, function(err, post) {
			var text = "\nEdit: ";
			text = text + req.body.edit;
			console.log(text);
			post.description = post.description + text;
			post.save(function(err, editedPost, numberAffected) {
				if(err) {
					console.log("Error in editing post.");
					console.log(err);
					res.json({err: err});
				} else {
					res.json({post: postInfo(editedPost),
						 coins: req.user.coins, likes: req.user.likes});
				}
			});
		});
	});

	// create a todo, information comes from AJAX request from Angular
	app.post('/createPost', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		Post.create({
			title: req.body.title,
			description: req.body.description,
			creator: req.user.username
		}, function(err, post) {
			if (err) {
				console.log(err);
				res.json({err:"Error when creating post."});
			} else {
				console.log("created post");
				res.json({post: postInfo(post)});
			}
		});
	});

	app.post('/updateProfile', [express.json(), express.urlencoded(), jwtauth], function(req,res){
		if(!req.body.email) {
			return res.json({err: "Please provide an email"});
		}
		User.findByIdAndUpdate(req.id, {$set: {'local.firstName': req.body.firstName, 
		'local.lastName': req.body.lastName, 'local.email': req.body.email}}, 
			{safe: true, upsert: true}, function(err, user) {
			if(err) {
				console.log(err);
				res.json({err: "Error in updating user info"});
			} else if(!user) {
				console.log("Couldn't find user when updating info");
				res.json({err: "Couldn't find user when updating info"});
			} else {
				console.log("updated user info");
				res.json({user: userInfo(user.local), coins: req.user.coins, likes: req.user.likes});
			}
		});
	 });

	app.post('/update', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		res.json({coins: req.user.coins, likes: req.user.likes});
	});

	app.post('/like', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		if(!req.user.likes) {
			res.json({err: "No likes left"});
		} else {
			Post.findById(req.body.postId, function(err, post) {
				if(err) {
					console.log(err);
					console.log("Error in finding post for commment");
					res.json({err : err});
				} else if(!post) {
					console.log("Post not found for comment");
					res.json({err : "Post does not exist"});
				} else if(post.creator == req.user.username) {
					console.log("User cannot like their own post");
					res.json({err : "User cannot like thier own post"});
				} else {
					User.findOneAndUpdate({'local.username' : post.creator}, {$inc: {'local.coins': 1}},
					 {safe: true, upsert: true}, function(err, user) {
						if(err) {
							console.log("Error in incrementing coins for a like");
							console.log(err);
							res.json({err: err});
						} else if(!user) {
							console.log("user not found for a like");
							res.json({err: "user not found"});
						} else {
							console.log("updated post creator");
							User.findByIdAndUpdate(req.id, {$inc: {'local.coins': 1, 'local.likes': -1}},
								{safe: true, upsert: true}, function(err, user2) {
								if(err) {
									console.log("Error in updating user for a like");
									console.log(err);
									res.json({err: err});
								} else if(!user2) {
									console.log("User not found for a like");
									res.json({err: "user not found"});
								} else {
									console.log("updated liker");
									post.likes = post.likes+1;
									post.numComments = post.numComments+1;
									post.save(function(err, post2) {
										if(err) {
											console.log("Error in incrementing likes for post");
											console.log(err);
											res.json({err:err});
										} else {
											if(req.body.text) {
												Comment.create({
													text: req.body.text,
													Post : req.body.postId,
													creator: req.user.username
												}, function(err, comment) {
													if(err) {
														console.log(err);
														console.log("Error in creating comment");
														res.json({err: err});
													} else {
														console.log("Succesfully created comment");
														res.json({comment: {text: comment.text, created: comment.created, creator:
															comment.creator}, post: {title: post2.title, description: post2.description,
																created: post2.created, creator: post2.creator, likes: post2.likes,
																id: post2._id, numComments: post2.numComments},
																 coins: user2.coins, likes: user2.likes});
													}
												});
											} else {
												res.json({comment : null, post: {title: post2.title, description: post2.description,
																created: post2.created, creator: post2.creator, likes: post2.likes,
																id: post2._id, numComments: post2.numComments},
																 coins: user2.coins, likes: user2.likes});
											}
										}
									})
								}
							});
						}
					});
				}
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
				res.json({item : itemInfo(item)});
			}
		});
	}
});

app.post('/items', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
	var itemList = [];
	var sort;
	var query;
	var userFilter = {StoreOwner: req.id};
	Item.count(userFilter, function(err, c) {
		if(err) {
			console.log("error in determing item count");
			console.log(err);
			res.json({err: err});
		}
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
			query = Item.find({$and: [userFilter, lastDateFilter]}).limit(3).sort(sort);
		} else {
			query = Item.find(userFilter).skip(req.body.page*3).limit(3).sort(sort);
		}
		query.exec(function (err, items){
			for (var i = 0; i < items.length; i++) {
				itemList.push(itemInfo(items[i]));
			}
			res.json({items: itemList, numItems: c});
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
					res.json({});
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
						res.json({item: itemInfo(item2)});
					}
			});
		}
	})
});

}




