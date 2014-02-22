var crypto = require('crypto');
var Sandbox = require('sandbox');
var Models = require('../app/models');
var testHelpers = require('./testHelpers');

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
        'numOfReady': 0
      };
      socket.emit('gameID', {'gameID': gameID});
    });

    //other players trying to join
    socket.on('joinGame', function(data) {
      var gameID = data.gameID;
      if (games[gameID] && games[gameID].players.length === 1) {
        games[gameID].players.push({
          'socketID': socket.id,
          'socket': socket,
          'playerNumber': 2
        });

        //start the game
        socket.emit('gameReady', 'problem');
      } else if (games[gameID] && games[gameID].players.length > 1) {
        socket.emit('gameFull');
      } else {
        socket.emit('gameDoesNotExist');
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
      testHelpers.run(data.data)
      .then(function(output){
        socket.emit('testResults', output);
      })
      .fail(function(err){
        socket.emit('testResults', err);
      });
    });

    socket.on('submit', function(data) {
      testHelpers.validate(data.data)
      .then(function(output){
        socket.emit('submitResults', {success: true, result: output});
      })
      .fail(function(output){
        socket.emit('submitResults', {success: false, result: output});
      });
    });

  });
};
