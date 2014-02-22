
/*
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose-q')();
var Models = require('./app/models');
var Routes = require('./app/routes');
var Sockets = require('./app/sockets');
var io = require('socket.io');
var crypto = require('crypto');




var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// connect to MongoDB
mongoose.connect('mongodb://localhost/battlejs');

//load all routes from the routes.js
Routes(app);


var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});

Sockets.listen(server);
