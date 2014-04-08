var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    rootPath: rootPath,
    port: 3000,
    mongodbPath: 'localhost/battlejs'
  },
  production: {
    rootPath: rootPath,
    port: 80,
    mongodbPath: 'localhost/battlejs'
  }
};