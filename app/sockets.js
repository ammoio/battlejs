var crypto = require('crypto');
var Sandbox = require('sandbox');
var Models = require('../app/models');

//socket io logic


module.exports.listen = function(server){
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
        }],
        'numOfReady': 0,
        'watchers': []
      };
      socket.emit('gameID', {'gameID': gameID});
    });

    //other players trying to join
    socket.on('joinGame', function(data) {
      var thisGame = games[data.gameID];
      if (thisGame && thisGame.players.length === 0) { //empty chat room, should redirect
        socket.emit('gameDoesNotExist');

      } else if (thisGame && thisGame.players.length === 1) { //second play joining
        thisGame.players.push({
          'socketID': socket.id,
          'socket': socket,
          'playerNumber': 2
        });
        socket.emit('gameReady');

      } else if (thisGame && thisGame.players.length > 1) { //watchers
        thisGame.watchers.push({
          'socketID': socket.id,
          'socket': socket        
        });
        socket.emit('gameFull');
      }
    });

    socket.on('ready', function(data) {
      var gameID = data.gameID;
      games[gameID].numOfReady++;
      if (games[gameID].numOfReady === 2) {
        Models.Challenge.findQ()
        .then( function(problem) {
          var data = {
            name: problem[0].name,
            boilerplate: problem[0].boilerplate
          };
          games[gameID].players[0].socket.emit('startGame', data);
          games[gameID].players[1].socket.emit('startGame', data);
        });
      }
    });

    socket.on('update', function(data) {
      var gameID = data.gameID;
      if (games[gameID] && socket.id === (games[gameID]).players[0].socketID) {
        console.log(games[gameID].players[1].socket);
        games[gameID].players[1].socket.emit('updated', {data: data.data});
      } else if (games[gameID]) {
        games[gameID].players[0].socket.emit('updated', {data: data.data}); 
      }
    }); 

    socket.on('test', function(data) {
      var s = new Sandbox();
      s.run(data.data, function(output){
        socket.emit('testResults', output);
      });
    });

    socket.on('submit', function(data) {
      var s = new Sandbox();
      s.run(data.data, function(output){
        socket.emit('output', output);
      });
    });

  });
};
