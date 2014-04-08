var Models = require('../models/models');
var path = require('path');

module.exports = {
  renderAngular: function (req, res) {
    console.log(__dirname);
    res.sendfile(path.resolve() + '/public/index.html');
  }
};