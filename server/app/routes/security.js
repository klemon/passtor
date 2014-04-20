// app/routes.js
module.exports = function(app, passport) {

  // ======================================
  // HOME PAGE (with login links) =========
  // ======================================
  app.get('/', function(req, res) {
    res.render('index.ejs'); // load the index.ejs file
  });

  // ======================================
  // LOGOUT ===============================
  // ======================================
  app.get('./logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // process signup form
 app.post('/signup', function(req, res, next) {
  passport.authenticate('local-signup', function(err, user, message) {
    if (err) { return next(err); }
    if (!user) { return res.json({err: err, user: false, message: message}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({err: err, user: user.local.email});
    });
  })(req, res, next);
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, message) {
    if (err) { return next(err); }
    if (!user) { return res.json({err: err, user: false, message: message}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({err: err, user: user.local.email, storeName: user.local.storeName,
                        points: user.local.points, coins: user.local.coins});
    });
  })(req, res, next);
});

//app.post('/login', passport.authenticate('local-login'), function(req, res) {
    //console.log(req);
     //res.json({user: req.body.email});
    //});
};