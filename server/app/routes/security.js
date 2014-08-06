// app/routes.js
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var StoreOwner = require('../models/storeowner');

module.exports = function(app, passport) {

app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, message) {
    //user has authenticated correctly thus we create a JWT token
    var expires = moment().add('days', 7).valueOf();
    var id;
    var isSO = false;
    if(user.local.StoreOwner) {
      id = user.local.StoreOwner;
      isSO = true;
    }
    else
      id = user._id;
    console.log("id: " + id);
    console.log("isSO: " + isSO);
    var token = jwt.encode({
      iss: id,
      exp: expires,
      isSO: isSO
    }, app.get('jwtTokenSecret'));
    if (err) { 
      console.log("Error in authentication for login request");
      return next(err);
    } else if (!user) {
      console.log("User not found for login request");
      return res.json({err: err, user: false, message: message}); 
    } else if(user.local.StoreOwner) {
      StoreOwner.findById(id, function(err, SO) {
        if(err) {
          console.log('Error in finding store owner');
          console.log(err);
          res.json({err: err});
        } else if(!SO) {
          console.log('Could not find StoreOwner');
          res.json({message: "Could not find StoreOwner"});
        } else {
          return res.json({err : err, token : token, expires : expires, storeOwner: {username: user.local.username,
            password: req.body.password, email: SO.email, firstName: SO.firstName, lastName: SO.lastName,
            storeName: SO.storeName}});
        }
      });
    } else {
      return res.json({err : err, token : token, expires : expires, user: {username: user.local.username,
        password: req.body.password, coins : user.local.coins, likes : user.local.likes, email: user.local.email,
        firstName: user.local.firstName, lastName: user.local.lastName}, coins: user.local.coins, 
        likes: user.local.likes});
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
        return res.json({err: err, user: user.local.username});
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