// server.js

// set up
// get all the tools we need
var express = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');
var path = require('path');
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration
var distFolder = path.resolve(__dirname, '../client');
app.configure(function() {
	
	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('view engine', 'ejs'); // set up ejs for templating
	app.set('views', distFolder);
	// required for passport
	app.use(express.session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
	app.use(express.static(path.resolve(__dirname, '../client')));
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login  sessions
  	app.use(flash()); // use connect-flash for flash messages stored in session
});

// routes ======================================================================
//app.use(express.static(path.join(__dirname, 'views')));
require('./app/routes/security.js')(app, passport); // load our routes and pass in our app and fully configure passport
//require('./app/routes/appFile.js')(app, distFolder);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
