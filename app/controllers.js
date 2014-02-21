var Models = require('./models');

module.exports = {
    renderAngular: function(req, res)
      res.sendfile(__dirname + '../public/index.html');
};