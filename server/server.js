// server.js

// set up
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');
var path     = require('path');
var configDB = require('./config/database.js');

var jwt = require('jwt-simple');
app.set('jwtTokenSecret', 'klemon_devauld');
var User = require('./app/models/user');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
var distFolder = path.resolve(__dirname, '../client');
app.configure(function() {
	
	// set up our express application
	app.use(express.static(path.resolve(__dirname, '../client')));
	app.use(express.logger('dev')); // log every request to the console
	//app.use(express.cookieParser()); // read cookies (needed for auth)
	//app.use(express.bodyParser()); // get information from html forms
  app.use(express.json());
  app.use(express.urlencoded());
	app.use(express.methodOverride()); // simulate DELETE and PUT
  app.use(express.favicon());

	//app.set('view engine', 'ejs'); // set up ejs for templating
	app.set('views', distFolder);

	// required for passport
	//app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(passport.initialize());
	//app.use(passport.session()); // persistent login  sessions
  	//app.use(flash()); // use connect-flash for flash messages stored in session
});

jwtauth = function(req, res, next) {
  console.log("jwtauth");
	var token = req.body.token;
	if(token) {
    console.log("found possible token, decoding...");
		try {
			var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
			if(decoded.exp <= Date.now()) {
        console.log("decoded token is expired");
				res.json({err: "Access token has expired", exp: true});
			} else {
        console.log("decoded token is still good");
				User.findOne({_id : decoded.iss}, function(err, user) {
          if(err) {
            console.log("Error in finding user in jwtauth");
            res.json({err: "Error in token auth"});
          } else if(!user) {
            console.log("Did not find user in jwtauth");
            res.json({err: "Error in token auth"});
          } else {
            console.log("found user in jwtauth");
            req.user = user.local;
            req._id = user.id;
            next();
          }
				});
			}
		} catch (err) {
      console.log(err);
      console.log("Error in try in jwtauth");
      res.json({err: "Error in token authentication"});
		}
	} else {
    console.log("no token");
    res.json({err: "No token"});
	}
  return;
};

// routes ======================================================================

//app.use(express.static(path.join(__dirname, 'views')));
require('./app/routes/security.js')(app, passport); // load our routes and pass in our app and fully configure passport
require('./app/routes/routes.js')(app, jwtauth);
require('./app/routes/appFile.js')(app, distFolder);


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
