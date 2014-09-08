// server.js

// set up
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3319;
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');
var path     = require('path');
var configDB = require('./config/database.js');

var jwt = require('jwt-simple');
app.set('jwtTokenSecret', 'klemon_devauld');
var AllUsers = require('./app/models/allusers'),
	User = AllUsers.User,
	StoreOwner = AllUsers.StoreOwner;
var moment = require('moment');

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
	req.nonUser = false;
	req.isSO = false;
	req.isUser = false;
	if((req.url == "/items" || req.url == "/posts" || req.url == "/comments") && !req.body.token) {
		req.nonUser = true;
		next();
		return;
	}
	var token = req.body.token;
	if(token) {
    console.log("found possible token, decoding...");
		try {
			var decoded = jwt.decode(token, app.get('jwtTokenSecret'));
			req.isSO = decoded.isSO;
			req.isUser = decoded.isUser;
			req.isRedeemer = decoded.isRedeemer;
			if(decoded.exp <= Date.now()) {
        		console.log("decoded token is expired");
				res.json({err: "Access token has expired", exp: true});
			} else {
        		console.log("decoded token is still good");
        		User.findById(decoded.iss, function(err, user) {
					if(err) {
						console.log("Error in finding user in jwtauth");
						res.json({err: "Error in token auth"});
					} else if(!user) {
						console.log("Did not find user in jwtauth");
						res.json({err: "Error in token auth"});
					} else {
						console.log("found user in jwtauth");
						if(req.isUser) {
							var lastRefresh = moment(user.local.lastLikeRefresh);
							var currRefresh = moment();
							var days = currRefresh.diff(lastRefresh, 'days');
							if(days) {
								console.log("Refreshing likes");
								currRefresh = currRefresh.add('day', days);
								user.local.lastLikeRefresh = currRefresh.toDate();
								console.log("new refresh date: " + user.local.lastLikeRefresh);
								user.local.likes = 15;
							}
						}
						user.save(function(err, user2){
							if(err) {
								console.log("error in saving user in jwtauth");
								console.log(err);
							}
							req.user = user2;
							req.id = user2._id;
							next();
						});
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

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3319');

    // Request methods you wish to allow
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    //res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

//app.use(express.static(path.join(__dirname, 'views')));
require('./app/routes/security.js')(app, passport, jwtauth); // load our routes and pass in our app and fully configure passport
require('./app/routes/routes.js')(app, jwtauth);
require('./app/routes/appFile.js')(app, distFolder);


// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
