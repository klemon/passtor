// app/routes.js
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var AllUsers = require('../models/allusers'),
    StoreOwner = AllUsers.StoreOwner;

module.exports = function(app, passport) {

// Takes a username and capitalizes the first letter and makes the rest
// of the string lowercase.
toUsernameFormat = function(username) {
  return username.charAt(0).toUpperCase() + username.slice(1);
}

app.post('/login', function(req, res, next) {
  console.log("pre Username: "+ req.body.username);
  req.body.username = toUsernameFormat(req.body.username);
console.log("post Username: "+ req.body.username);
  passport.authenticate('local-login', function(err, user, message) {
    if(err) {
      console.log(err);
      return next(err);
    }
    else if(!user) {
      console.log("User not found for login request");
      return res.json({err: err, user: false, message: message}); 
    }
    //user has authenticated correctly thus we create a JWT token
    var expires = moment().add('days', 7).valueOf();
    var token = jwt.encode({
      iss: user._id,
      exp: expires,
      isSO: (user._type == "StoreOwner"),
      isUser: (user._type == "User"),
      isRedeemer: (user._type == "Redeemer") 
    }, app.get('jwtTokenSecret'));
    if(user._type == "StoreOwner") {
          return res.json({token : token, expires : expires, storeOwner: {username: user.username,
            password: req.body.password, email: user.local.email, firstName: user.local.firstName, lastName: user.local.lastName,
            storeName: user.storeName}});
    } else if(user._type == "User") {
      return res.json({token : token, expires : expires, user: {username: user.username,
        password: req.body.password, coins : user.coins, likes : user.likes, email: user.local.email,
        firstName: user.local.firstName, lastName: user.local.lastName}, coins: user.coins, 
        likes: user.likes});
    }
  })(req, res, next);
});

  // process signup form
 app.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, message) {
    if (err) { 
      return next(err);
    } else if(!user) { 
      return res.json({err: err, user: false, message: message});
    }
      req.logIn(user, function(err) {
        if (err) { 
          console.log("error in req.logIn");
          console.log(err);
          return next(err);
        }
        console.log("successful login");
        return res.json({err: err, user: user.username});
    });
  })(req, res, next);
});

  // ======================================
  // LOGOUT ===============================
  // ======================================
  app.post('/logout', function(req, res) {
    //req.logout();
    //res.redirect('/');
  });
};