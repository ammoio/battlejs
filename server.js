
/*
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var Models = require('./app/models');
var Routes = require('./app/routes');
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


//socket io logic
var io = require('socket.io').listen(server);
var clients = [];
var games = {};
io.sockets.on('connection', function (socket) {
  //save the session id
  clients.push(socket.id, socket);

  //when newGame is clicked
  socket.on('newGame', function() {
    
    //generate new game id
    var gameID = crypto.randomBytes(4).toString('base64').slice(0, 4).replace('/', 'a').replace('+', 'z');

    //store it into games
    games[gameID] = {
      'player1': {
        'socketID': socket.id,
        'socket': socket
      }
    };
    socket.emit('gameID', {'gameID': gameID});
  });
  
  socket.on('ready', function(data) {
    
   });

  socket.on('submit', function(data) {

  });
});
