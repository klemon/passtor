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
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect : '/', // redirect to the secure profile section
    failureRedirect : '/signup', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
  }));

app.post('/login', function(req, res, next) {
  passport.authenticate('local-login', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.json({err: err, user: user, info: info}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json({err: err, user: user, info: info});
    });
  })(req, res, next);
});

//app.post('/login', passport.authenticate('local-login'), function(req, res) {
    //console.log(req);
     //res.json({user: req.body.email});
    //});
};