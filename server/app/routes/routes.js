var Post = require('../models/post');

module.exports = function(app) {

	// api ---------------------------------------------------------------------

	// create post and send back all posts after creation
	// app.post('/createPost', function(req, res) {

	//  // create the post
 //        var newPost                 = new Post();

 //        // set the user's local credentials
 //        newPost.local.title         = 'test';
 //        newPost.local.description      = 'doesntMatter';

 //        // save the user
 //        newPost.save(function(err) {
 //          if(err)
 //            throw err;
 //          return done(null, newPost);
 //        });

	// });

	// create a todo, information comes from AJAX request from Angular
	app.post('/createPost', function(req, res) {
		Post.create({
			title : req.body.title,
			description : req.body.description
		}, function(err, post) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Post.find(function(err, posts) {
				if (err)
					res.send(err)
				res.json(posts);
			});
		});
	});

}