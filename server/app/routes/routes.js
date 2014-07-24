var Post = require('../models/post');
var Comment = require('../models/comment');
var User = require('../models/user');
var Store = require('../models/store');
var mongoose = require('mongoose');
var express = require('express');
var moment = require('moment');


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
		var filter = {}
		if(req.body.all) {
			filter = {}
		} else {
			filter = {'creator': req.body.username};
		}
		Post.find(filter, function (err, posts){
			for (var i = 0; i < posts.length; i++) {
				postList.push({title: posts[i].title, description: posts[i].description,
						creator: posts[i].creator, created: posts[i].created,
						id: posts[i]._id, likes: posts[i].likes});
			}
			res.json({posts: postList, coins: req.user.coins, likes: req.user.likes});
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
				return res.json({user: {username: user.local.username, email: user.local.username,
					firstName: user.local.firstName, lastName: user.local.lastName, 
					coins: user.local.coins, likes: user.local.likes},
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
				creator: post.creator, likes: post.likes, id: post._id}});
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
					res.json({post: {title: editedPost.title, description: editedPost.description,
						creator: editedPost.creator, created: editedPost.created, likes: editedPost.likes,
						id: editedPost._id}, coins: req.user.coins, likes: req.user.likes});
				}
			});
		});
	});

	// create a todo, information comes from AJAX request from Angular
	app.post('/createPost', [express.json(), express.urlencoded(), jwtauth], function(req, res) {
		var today = new Date();
		var day = today.getDate();
		var month = today.getMonth()+1; //January is 0!
		var year = today.getFullYear();
		Post.create({
			title: req.body.title,
			description: req.body.description,
			creator: req.user.username,
			created: {year: year, month: month, day: day}
		}, function(err, post) {
			if (err) {
				console.log(err);
				res.json({err:"Error when creating post."});
			} else {
				console.log("created post");
				res.json({post: {title: post.title, description: post.description, created: post.created,
					creator: post.creator, likes: post.likes, id: post._id}, coins: req.user.coins,
					 likes: req.user.likes});
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
				res.json({user: user, coins: req.user.coins, likes: req.user.likes});
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
									console.log("user2: " + user2);
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
									post.save(function(err, pst) {
										if(err) {
											console.log("Error in incrementing likes for post");
											console.log(err);
											res.json({err:err});
										} else {
											if(req.body.text) {
												var today = new Date();
												var day = today.getDate();
												var month = today.getMonth()+1; //January is 0
												var year = today.getFullYear();
												Comment.create({
													text: req.body.text,
													Post : req.body.postId,
													creator: req.user.username,
													created: {year: year, month: month, day: day}
												}, function(err, comment) {
													if(err) {
														console.log(err);
														console.log("Error in creating comment");
														res.json({err: err});
													} else {
														console.log("Succesfully created comment");
														res.json({comment: {text: comment.text, created: comment.created, creator:
															comment.creator}, post: {title: post.title, description: post.description,
																created: post.created, creator: post.creator, likes: post.likes,
																id: post._id}, coins: req.user.coins+1, likes: req.user.likes-1});
													}
												});
											} else {
												res.json({comment : null, post: {title: post.title, description: post.description,
																created: post.created, creator: post.creator, likes: post.likes,
																id: post._id}, coins: user2.coins, likes: user2.likes});
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
		Comment.find({'Post': mongoose.Types.ObjectId(req.body.postId)}, function(err, comments) {
			if(err) {
				console.log("Error in finding comments");
				console.log(err);
			} else if(!comments) {
				console.log("Didn't find comments");
				res.json({err: "Didn't find comments"});
			} else {
				console.log("Found comments");
				for(var i = 0; i < comments.length; ++i) {
					commentList.push({text: comments[i].text, created: comments[i].created,
										creator: comments[i].creator});
				}
				res.json({comments: commentList, coins: req.user.coins, likes: req.user.likes});
			}
		});
	});

	app.post('/inventory', [express.json(), express.urlencoded(), jwtauth], function(req, res, next) {
		// Check to see if user exists
	    User.findOne({ 'local.username' : req.body.username }, function(err, user) {
	      // if there are any errors, return the error before anything else
	      if (err)
	      {
	        console.log("Error in finding user");
	        return next(err);
	      }

	      // if no user is found, return the message
	      if(!user)
	      {
	        console.log("No user is found");
	        return res.json({err: null, store: false, message: "User does not exist."});
	      }

	      // if user does not have a store then they have no inventory
	      if(!user.local.storeName)
	      {
	      	console.log("User does not have a store");
	      	return res.json({err: null, store: false, message: "User does not have a store"});
	      }

		  console.log("User has a store");
		  Store.findOne({'_id' : user.local.storeName}, function(err, store) {
		  	if(err)
		  	{
		  		console.log("Error in finding store");
		  		return next(err);
		  	}
		  	if(!store)
		  	{
		  		console.log("User's store is undefined (no data)");
		  		return res.json({err: null, store: false, message: "No store found"});
		  	}
		  	console.log("Found store");
		  	return res.json({err: null, store: store.items});
		  })
	    });
	 });

app.post('/createItem', [express.json(), express.urlencoded(), jwtauth], function(req, res, next) {
		// Check to see if user exists
	    User.findOne({ 'local.username' : req.body.username }, function(err, user) {
	      // if there are any errors, return the error before anything else
	      if (err)
	      {
	        console.log("Error in finding user");
	        return next(err);
	      }

	      // if no user is found, return the message
	      if(!user)
	      {
	        console.log("No user is found");
	        return res.json({err: null, items: false, message: "User does not exist."});
	      }

	      // if user does not have a store then they can't create items
	      if(!user.local.storeName)
	      {
	      	console.log("User does not have a store");
	      	return res.json({err: null, items: false, message: "User does not have a store"});
	      }

		  console.log("User has a store");
		  Store.find(user.local.storeName, function(err, store) {
		  	if(err)
		  	{
		  		console.log("Error in finding store");
		  		return next(err);
		  	}
		  	if(!store)
		  	{
		  		console.log("User's store is undefined (no data)");
		  		return res.json({err: null, items: false, message: "No store found"});
		  	}
		  	console.log("Found store");
		  	// TODO: Probably should make sure item is valid eg name, desc are nonempty, coins is positive, date is valid
		  	Store.update({name: user.local.storeName},{$push:{items:req.body.item}},{safe: true, upsert:true}, function(err, model) {
		  		if(err){
		  			console.log(err);
		  			return res.json({err:err});
		  		}
		  		else{
		  			if(!model){
		  				console.log("Failed to add item");
		  				return res.json({err:null, items: model.items});
		  			}
		  			console.log("Succesfully added item");
		  			return res.json({err:null, items:model.items})
		  		}
		  	});
		  })
	    });
	 });

// The same as /inventory right now but might change
app.post('/getItems', [express.json(), express.urlencoded(), jwtauth], function(req, res, next) {
		// Check to see if user exists
	    User.findOne({ 'local.username' : req.body.username }, function(err, user) {
	      // if there are any errors, return the error before anything else
	      if (err)
	      {
	        console.log("Error in finding user");
	        return next(err);
	      }

	      // if no user is found, return the message
	      if(!user)
	      {
	        console.log("No user is found");
	        return res.json({err: null, items: false, message: "User does not exist."});
	      }

	      // if user does not have a store then they can't get items
	      if(!user.local.storeName)
	      {
	      	console.log("User does not have a store");
	      	return res.json({err: null, items: false, message: "User does not have a store"});
	      }

		  console.log("User has a store");
		  console.log("Store: ", user.local.storeName);
		  Store.findOne({name : user.local.storeName}, function(err, store) {
		  	if(err)
		  	{
		  		console.log("Error in finding store");
		  		return next(err);
		  	}
		  	if(!store)
		  	{
		  		console.log("User's store is undefined (no data)");
		  		return res.json({err: null, items: false, message: "No store found"});
		  	}
		  	else
		  	{
		  		console.log("Found store.");
		  		return res.json({err : null, items : store.items});
		  	}
		  });
	    });
	 });

app.post('/deleteItem', [express.json(), express.urlencoded(), jwtauth], function(req, res, next) {
		// Check to see if user exists
	    User.findOne({ 'local.username' : req.body.username }, function(err, user) {
	      // if there are any errors, return the error before anything else
	      if (err)
	      {
	        console.log("Error in finding user");
	        return next(err);
	      }

	      // if no user is found, return the message
	      if(!user)
	      {
	        console.log("No user is found");
	        return res.json({err: null, items: false, message: "User does not exist."});
	      }

	      // if user does not have a store then they can't create items
	      if(!user.local.storeName)
	      {
	      	console.log("User does not have a store");
	      	return res.json({err: null, items: false, message: "User does not have a store"});
	      }

		  console.log("User has a store");
		  Store.find(user.local.storeName, function(err, store) {
		  	if(err)
		  	{
		  		console.log("Error in finding store");
		  		return next(err);
		  	}
		  	if(!store)
		  	{
		  		console.log("User's store is undefined (no data)");
		  		return res.json({err: null, items: false, message: "No store found"});
		  	}
		  	console.log("Found store");
		  	// TODO: Probably should make sure item is valid eg name, desc are nonempty, coins is positive, date is valid
		  	Store.update({name: user.local.storeName},{$pull:{items:req.body.item}}, function(err, model) {
		  		if(err){
		  			console.log(err);
		  			return res.json({err:err});
		  		}
		  		else{
		  			if(!model){
		  				console.log("Failed to delete item");
		  				return res.json({err:null, items: model.items});
		  			}
		  			Store.findOne({name: user.local.storeName}, function(err, model) {
				  		if(err){
				  			console.log(err);
				  			return res.json({err:err});
				  		}
				  		else{
				  			console.log("Succesfully retrieved item");
				  			return res.json({err:null, items:model.items})
				  		}
				  	});
		  		}
		  	});
		  })
	    });
	 });

app.post('/editItem', [express.json(), express.urlencoded(), jwtauth], function(req, res, next) {
		// Check to see if user exists
	    User.findOne({ 'local.username' : req.body.username }, function(err, user) {
			// if there are any errors, return the error before anything else
			if (err) {
				console.log("Error in finding user");
				return next(err);
			}

			// if no user is found, return the message
			if(!user) {
				console.log("No user is found");
				return res.json({err: null, items: false, message: "User does not exist."});
			}

			// if user does not have a store then they can't create items
			if(!user.local.storeName) {
				console.log("User does not have a store");
				return res.json({err: null, items: false, message: "User does not have a store"});
			}

			console.log("User has a store");
		  	
			var id = mongoose.Types.ObjectId(req.body.item.id);
			Store.update(
				{name: req.body.item.storeName, "items.name" : id}, // Might be an error here
				{$set:{"items.$.name":req.body.item.name}}, // Just trying to at least update the name
				{upsert: true},
				function(err){
					if(err) {
						console.log("err: ", err);
						return res.json({err : err});
					} else {
						console.log("Succesfully updated item");
						return res.json({err : null});
					}
			});
	    });
	 });
}




