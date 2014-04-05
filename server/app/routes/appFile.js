// app/routes.js
module.exports = function(app, path) {
  app.all('/*', function(req, res) {
    // Just send the index.ejs for other files to support HTML5Mode
    res.sendfile('index.ejs', { root: path });
  });
};