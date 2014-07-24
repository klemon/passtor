// app/routes.js
var moment = require('moment');
var jwt = require('jwt-simple');

module.exports = function(app, passport) {

app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, message) {
    //user has authenticated correctly thus we create a JWT token
    var expires = moment().add('days', 7).valueOf();
    var token = jwt.encode({
      iss: user._id,
      exp: expires
    }, app.get('jwtTokenSecret'));
    if (err) { 
      console.log("Error in authentication for login request");
      return next(err);
    } else if (!user) {
      console.log("User not found for login request");
      return res.json({err: err, user: false, message: message}); 
    } else if(user.local.StoreOwner) {
      StoreOwner.findOne({ '_id' : user.local.StoreOwner}, function(err, storeowner) {
        if(err) {
          console.log('Error in finding store owner');
        } else if(!storeowner) {
          console.log('Could not find StoreOwner');
        } else {
          return res.json({err : err, token : token, expires : expires, // fix this 
            user : user, storeName : storeowner.storeName});    // fix this
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
    if (err) { return next(err); }
    if (!user) { 
      return res.json({err: err, user: false, message: message}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
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