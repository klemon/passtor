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

  // process login form
  app.post('/login', passport.authenticate('local-login'), function(req, res) {
    res.send(req)
  });
};



