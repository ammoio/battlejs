
/*
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var Models = require('./app/models');
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

app.get('/', function() {
   res.sendfile(__dirname + '/public/index.html'); 
});


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
      'players': [{
        'socketID': socket.id,
        'socket': socket,
        'playerNumber': 1
      }]
    };
    socket.emit('gameID', {'gameID': gameID});
  });

  //other players trying to join
  socket.on('joinGame', function(data) {
    var gameID = data.gameID;
    if (games[gameID].players.length === 1) {
      games[gameID].players.push({
        'socketID': socket.id,
        'socket': socket,
        'playerNumber': 2
      });

      //start the game
      socket.emit('startGame');
    }
  });
  
  socket.on('ready', function(data) {
    
  });

  socket.on('submit', function(data) {

  });
});
