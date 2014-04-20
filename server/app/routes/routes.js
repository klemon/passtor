var Post = require('../models/post');
var User = require('../models/user');

module.exports = function(app) {

	// api --------------------------------------------------------------------
	
	// get all post
	app.get('/posts', function(req, res) {

		// use mongoose to get all todos in the database
		Post.find(function(err, posts) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(posts); // return all todos in JSON format
		});
	});

	// get all post
	app.get('/user', function(req, res) {
		User.findOne({ 'local.email' : req.query.email }, function(err, user) {
	      // if there are any errors, return the error before anything else
	      if (err)
	      {
	        console.log("Error in logging in");
	        return res.send(err);
	      }

	      // if no user is found, return the message
	      if(!user)
	      {
	        console.log("No user is found");
	        return res.send("User does not exist.");
	      }
			return res.json(user);
	    });
	});

	// get all post
	app.get('/loadpost', function(req, res) {
		Post.findOne({ '_id' : req.query.id }, function(err, post) {
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
			return res.json(post);
	    });
	});

	// create a todo, information comes from AJAX request from Angular
	app.post('/createPost', function(req, res) {
		Post.create({
			title : req.body.title,
			description : req.body.description
		}, function(err, post) {
			if (err)
			{
				res.send(err);
			}

			// get and return all the todos after you create another
			Post.find(function(err, posts) {
				if (err)
					res.send(err)
				res.json(posts);
			});
		});
	});

	app.post('/updateProfile', function(req,res){
		// we are checking to see if the user trying to login already exists
	    User.findOne({ 'local.email' : req.body.curEmail }, function(err, user, done) {
	      // if there are any errors, return the error before anything else
	      if (err)
	      {
	        console.log("Error in logging in");
	        return done(err);
	      }

	      // if no user is found, return the message
	      if(!user)
	      {
	        console.log("No user is found");
	        return done(null, false, "User does not exist.");
	      }
	      if(req.body.username){
	      	user.local.username = req.body.username;
	      }
		  if(req.body.email){
		  user.local.email = req.body.email;
		  }
		  if(req.body.firstName){
		  	user.local.firstName = req.body.firstName;
		  }
		  if(req.body.lastName){
		  	user.local.lastName = req.body.lastName;
		  }
		  if(req.body.description){
		  	user.local.description = req.body.description;
		  }
			return user.save(function (err){
				if(!err){
					console.log("updated profile!");
				} else {
					console.log(err);
				}
				return res.json(user);
			});
	    });
	 });

}




