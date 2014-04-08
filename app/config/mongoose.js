var mongoose = require('mongoose-q')();

module.exports = function (config) {
  mongoose.connect('mongodb://' + config.mongodbPath);
};