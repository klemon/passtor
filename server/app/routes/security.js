// app/routes.js
var moment = require('moment');
var jwt = require('jwt-simple');
var express = require('express');
var AllUsers = require('../models/allusers'),
    StoreOwner = AllUsers.StoreOwner;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(app, passport) {

userInfo = function(user) {
  return {username: user.username_display, email: user.local.email, firstName: user.local.firstName, lastName: user.local.lastName,
    coins: user.coins, likes: user.likes};
}

sOInfo = function(SO) {
  return {username: SO.username_display, email: SO.local.email, 
    firstName: SO.local.firstName, lastName: SO.local.lastName, storeName: SO.storeName};
}

app.post('/login', function(req, res, next) {
  // We are given an Id and access_token from user. 
  // We send access_token to FB to get info on the FB user of that token.
  // We need to make sure the Id from user == Id from FB.
  function toQueryString(obj) {
        var parts = [];
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
            }
        }
        return parts.join("&");
  }
  var xhr = new XMLHttpRequest();
  var params = {}
  params['access_token'] = req.body.access_token;
  var url = 'https://graph.facebook.com' + '/me' + '?' + toQueryString(params);
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            console.log("successful");
            var fbRes = JSON.parse(xhr.responseText);
            req.body.username = fbRes.id;
            req.body.password = "noPassword";
            req.body.FBdata = fbRes;
            console.log("fbRes.id: " + fbRes.id);
            console.log("req.body.id: " + req.body.id);
            if(fbRes.id == req.body.id) {
              passport.authenticate('local-login', function(err, user, message) {
                console.log("user in sec: " + JSON.stringify(user, undefined, 2));
                if(err) {
                  console.log(err);
                  return next(err);
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
                console.log("successful login");
                console.log("type: " + user._type);
                if(user._type == "StoreOwner") {
                  res.json({token : token, expires : expires, storeOwner: sOInfo(user)});
                } else if(user._type == "User") {
                  res.json({token : token, expires : expires, user: userInfo(user), coins: user.coins, likes: user.likes});
                }
              })(req, res, next);
            } else {
              console.log("Given Facebook Id does not match id returned by facebook.");
              return res.json({err: null, user: false, message: "Sorry, your Facebook credentials don't match the ones in our database. Please try again or contact our support team."});
            }
          } else {
              var error = xhr.responseText ? JSON.parse(xhr.responseText).error : {message: 'An error has occurred'};
              console.log("error");
              console.log(error);
              return next(error);
          }
      }
  };
  xhr.open('GET', url, true);
  xhr.send();
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
        res.json({err: false, user: user.username});
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