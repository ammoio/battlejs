var express = require('express');
var path = require('path');

module.exports = function (app, config) {
  // all environments
  app.set('port', config.port);
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.static(config.rootPath + '/public'));
  app.use(app.router);

  // development only
  if ('development' === app.get('env')) {
    app.use(express.errorHandler());
  }
};