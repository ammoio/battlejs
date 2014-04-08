/*
  basic server using mongodb and socket.io
*/
var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//object with configurations depending on 
var config = require('./app/config/config')[env];

// set up express config
require('./app/config/express')(app, config);

// set up mongodb
require('./app/config/mongoose')(config);

// set up routes
require('./app/config/routes')(app);

//set up sockets
require('./app/sockets/sockets').listen(server);

server.listen(app.get('port'), function () {
  console.log('What happens on port ' + app.get('port') + " stays on port " + app.get('port'));
});