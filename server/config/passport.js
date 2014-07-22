// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var User          = require('../app/models/user');

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
    User.findOne({ 'local.username' : username }, function(err, user) {
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
        return done(null, false, "User does not exist."); // req.flash is the way to set flashdata using connect-flash
      }

      // if the user is found but the password is wrong
      if(!user.validPassword(password))
      {
        console.log("User found but wrong password");
        return done(null, false, "Invalid password."); // create the loginMessage and save it to session as flashdata
      }
      console.log("Successful user");
      // all is well, return successful user
      return done(null, user);
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
    if(!req.body.email) {
      console.log("User must provide an email.");
      return done(null, false, "Please provide an email.");
    }


   // find a user whose username is the same as the forms username
   // we are checking to see if the user trying to login already exists
    User.findOne({ 'local.username' : username }, function(err, user) {
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
        User.findOne({ 'local.email' : req.body.email }, function(err, user) {
          // if there are any errors, return the error before anything else
          if (err) {
            console.log("Error in finding if email exists.");
            throw err;
          }
          if (user) {
            console.log("Email is already in use. :)");
            return done(null, false, "That email is already being used.");
          } else {
            // if there is no user with that username
            // create the user
            var newUser                 = new User();
            // set the user's local credentials
            newUser.local.username      = username;
            newUser.local.email         = req.body.email;
            newUser.local.firstName     = req.body.firstName;
            newUser.local.lastName      = req.body.lastName;
            newUser.local.password      = newUser.generateHash(password);
            newUser.local.likes        = 15;
            newUser.local.coins         = 0;
            // save the user
            newUser.save(function(err) {
              if(err)
                throw err;
              console.log("Created a new user.");
              return done(null, newUser);
            });
          }
        });
      }
    });

    

    

    });

  }));

};
