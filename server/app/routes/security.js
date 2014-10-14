// app/routes.js
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var AllUsers = require('../models/allusers'),
    StoreOwner = AllUsers.StoreOwner;
var nodemailer = require("nodemailer");

module.exports = function(app, passport, smtpTransport) {

userInfo = function(user) {
  return {username: user.username_display, email: user.local.email, firstName: user.local.firstName, lastName: user.local.lastName,
    coins: user.coins, likes: user.likes};
}

sOInfo = function(SO) {
  return {username: SO.username_display, email: SO.local.email, 
    firstName: SO.local.firstName, lastName: SO.local.lastName, storeName: SO.storeName};
}

app.post('/login', function(req, res, next) {
  req.body.username = req.body.username.toLowerCase();
  passport.authenticate('local-login', function(err, user, message) {
    if(err) {
      console.log(err);
      return next(err);
    }
    else if(!user) {
      console.log("User not found for login request");
      return res.json({err: err, user: false, message: message}); 
    }
    if(user._type == "LockedUser")
    {
      console.log("A LockedUser");
      return res.json({user: {username: user.username_display, email: user.local.email, firstName: user.local.firstName,
        lastName: user.local.lastName}, LockedUser: true, expires: user.createdAt.expires});
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
          return res.json({token : token, expires : expires, storeOwner: sOInfo(user), LockedUser: false});
    } else if(user._type == "User") {
      return res.json({token : token, expires : expires, user: userInfo(user), coins: user.coins, 
        likes: user.likes, LockedUser: false});
    }
  })(req, res, next);
});

  // process signup form
 app.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, message) {
    if (err) { 
      return next(err);
    } else if(!user) { 
      res.json({err: err, user: false, message: message});
    }
      req.logIn(user, function(err) {
        if (err) { 
          console.log("error in req.logIn");
          console.log(err);
          return next(err);
        }
        var link="http://"+req.get('host')+"/verify?id="+user._id;
        var mailOptions = {
          to : user.local.email,
          subject : "Please confirm your Email account",
          html : "This email is addressed to the user <b>" + user.username_display + "</b> of ProjectPasstor.<br>Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
        }
        smtpTransport.sendMail(mailOptions, function(err, res){
          if(err){
            console.log(err);
            res.json({err: err});
          } else {
            console.log("Message sent: " + res.message);
            res.json({err: false, user: user.username}); 
          }
        });
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