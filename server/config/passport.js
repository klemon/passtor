// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');
var validator = require('validator');

// load up the user model
var AllUsers = require('../app/models/allusers'),
    User = AllUsers.User;

// expose this function to our app using module.exports
module.exports = function(passport) {

  // ========================================================================
  // passport session setup =================================================
  // ========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser(function(user, done) {
    console.log("serialize user");
    done(null, user.id);
  });

  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      console.log("deserialize user");
      done(err, user);
    });
  });

  // ========================================================================
  // LOCAL LOGIN ============================================================
  // ========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password
    usernameField : 'username',
    passwordFeild: 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    // we are checking to see if the user trying to login already exists
    console.log("username: " + username);
    User.findOne({'username' : username}, function(err, user) {
      console.log("user: " + user);
      console.log(JSON.stringify(user, undefined, 2));
      // if there are any errors, return the error before anything else
      if(err){
        console.log("Error in logging in");
        return done(err);
      }
      // if no user is found then we create an account for the user
      if(!user) {
        console.log("No user is found, making them an account.");
        var newUser                 = new User();
        newUser.username            = req.body.username;
        newUser.facebook.id         = req.body.FBdata.id;
        newUser.facebook.token      = req.body.FBdata.token;
        newUser.facebook.email      = req.body.FBdata.email;
        newUser.facebook.name       = req.body.FBdata.name;
        newUser.facebook.firstName  = req.body.FBdata.first_name;
        newUser.facebook.lastName   = req.body.FBdata.last_name;
        newUser.facebook.gender     = req.body.FBdata.gender;
        // save the user
        newUser.save(function(err, newUser2) {
          if(err) { 
            console.log(err);
            return done(err, false);
          }
          console.log("Created a new user.");
          return done(null, newUser2);
        });
      } else {
        var lastRefresh = moment(user.lastLikeRefresh);
        var currRefresh = moment();
        var days = currRefresh.diff(lastRefresh, 'days');
        if(days) {
          console.log("Refreshing likes");
          currRefresh = currRefresh.add('day', days);
          user.lastLikeRefresh = currRefresh.toDate();
          console.log("new refresh date: " + user.lastLikeRefresh);
          user.likes = 15;
        }
        user.save(function(err, user2){
          // all is well, return successful user
          return done(null, user2);
        });
      }
    });
  }));
}