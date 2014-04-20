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

	app.post("/updateProfile", function(req,res){
		console.log("YOU ARE TRYING TO CHANGE PROFILE INFO");
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

	      user.local.username = req.body.username;
		  user.local.email = req.body.email;
		  user.local.firstName = req.body.firstName;
		  user.local.lastName = req.body.lastName;
		  console.log("You should have assigned everything");
			return user.save(function (err){
				if(!err){
					console.log("updated profile!");
				} else {
					console.log(err);
				}
				return res.json(user);
			});
	    });


	// 	console.log("you made it this far");
	// 	console.log(req.params.info);
	// 	return User.find({email: req.params.info}, function(err, user){
	// 		user.username = req.body.username;
	// 		user.email = req.body.email;
	// 		user.firstName = req.body.firstName;
	// 		user.lastName = req.body.lastName;
	// 		console.log("You should have assigned everything");
	// 		return user.save(function (err){
	// 			if(!err){
	// 				console.log("updated profile!");
	// 			} else {
	// 				console.log(err);
	// 			}
	// 			return res.send(user);
	// 		});
	// 	});
	 });

}




