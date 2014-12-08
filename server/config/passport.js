// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var moment = require('moment');
var validator = require('validator');


// load up the user model
var AllUsers = require('../app/models/allusers'),
    User = AllUsers.User,
    LockedUser = AllUsers.LockedUser;

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
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    // we are checking to see if the user trying to login already exists
    User.findOne({'username' : username}, function(err, user) {
      // if there are any errors, return the error before anything else
      if(err){
        console.log("Error in logging in");
        return done(err);
      }
      // if no user is found, return the message
      if(!user) {
        console.log("No user is found");
        return done(null, false, "User does not exist."); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is found but the password is wrong
      if(!AllUsers.validPassword(password, user.password)) {
        console.log("User found but wrong password");
        return done(null, false, "Invalid password."); // create the loginMessage and save it to session as flashdata
      }
      console.log("Successful user");
      var lastRefresh = moment(user.local.lastLikeRefresh);
      var currRefresh = moment();
      var days = currRefresh.diff(lastRefresh, 'days');
      if(days) {
        console.log("Refreshing likes");
        currRefresh = currRefresh.add('day', days);
        user.lastLikeRefresh = currRefresh.toDate();
        console.log("new refresh date: " + user.local.lastLikeRefresh);
        user.likes = 15;
      }
      user.save(function(err, user2){
        // all is well, return successful user
        return done(null, user2);
      });
    });
  }));


  // ========================================================================
  // LOCAL SIGNUP ===========================================================
  // ========================================================================
  // we are using named strategies since we have one for login and one for signup
  // by default, if there was no name, it would just be called 'local'

  passport.use('local-signup', new LocalStrategy({
    // by default, local strategy uses username and password
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    // asynchronous
    // User.findOne won't fire unless data is sent back
    process.nextTick(function() {
      if(username == "") {
        return done(null, false, "Username cannot be blank.");
      }
      var re = /^\w+$/;
      if(!re.test(username)) {
        return done(null, false, "Username must contain only letters, numbers, and underscores.");
      }
      if(password != "") {
        if(password.length < 6) {
          return done(null, false, "Password must contain at least six characters.");
        }
        if(password == username) {
          return done(null, false, "Password must be different from Username.");
        }
        re = /[0-9]/;
        if(!re.test(password)) {
          return done(null, false, "Password must contain at least one number (0-9).");
        }
        re = /[a-z]/;
        if(!re.test(password)) {
          return done(null, false, "Password must contain at least one lowercase letter (a-z).");
        }
        re = /[A-Z]/;
        if(!re.test(password)) {
          return done(null, false, "Password must contain at least one uppercase letter (A-Z).");
        }
      } else {
        return done(null, false, "Please provide a password.");
      }
      if(!req.body.email) {
        return done(null, false, "Please provide an email.");
      }
      if(!validator.isEmail(req.body.email)) {
        return done(null, false, "Please provide a valid email.");
      }
      // find a user whose username is the same as the forms username
      // we are checking to see if the user trying to login already exists
       User.findOne({'username' : username.toLowerCase()}, function(err, user) {
         // if there are any errors, return the error
         
         if (err) {
           console.log("Error in signing up user.")
           return done(err);
         }

         // check to see if theres already a user with that username
         if (user) {
           console.log("User already exists.");
           return done(null, false, "That username is already taken.");
         } else {
           User.findOne({'local.email' : req.body.email}, function(err, user) {
             // if there are any errors, return the error before anything else
             if (err) {
               console.log("Error in finding if email exists.");
               throw err;
             }
             if (user) {
               console.log("Email is already in use. :)");
               return done(null, false, "That email is already being used.");
             } else {
               //var newUser                 = new LockedUser();
               var newUser                 = new User();
               // set the user's local credentials
               newUser.username            = username.toLowerCase();
               newUser.username_display    = username;
               newUser.password            = AllUsers.generateHash(password);
               newUser.local.email         = req.body.email;
               newUser.local.firstName     = req.body.firstName;
               newUser.local.lastName      = req.body.lastName;
               // save the user
               newUser.save(function(err, newUser2) {
                 if(err)
                   throw err;
                 console.log("Created a new user.");
                 return done(null, newUser2);
               });
             }
           });
         }
       });
    });
  }));
};
