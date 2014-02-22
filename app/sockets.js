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
        'numOfReady': 0,
        'watchers': []
      };
      console.log("First Player Joined");
      socket.emit('gameID', {'gameID': gameID});
    });

    //other players trying to join
    socket.on('joinGame', function(data) {
      var thisGame = games[data.gameID];
      if (thisGame && thisGame.players.length === 0) { //empty chat room, should redirect
        socket.emit('gameDoesNotExist');

      } else if (thisGame && thisGame.players.length === 1) { //second play joining
        console.log("Second Player Joined, gameready");
        thisGame.players.push({
          'socketID': socket.id,
          'socket': socket,
          'playerNumber': 2
        });
        socket.emit('gameReady');

      } else if (thisGame && thisGame.players.length > 1) { //watchers
        console.log("gameFull");
        thisGame.watchers.push({
          'socketID': socket.id,
          'socket': socket        
        });
        socket.emit('gameFull');
      }
    });

    socket.on('ready', function(data) {
      var thisGame = games[data.gameID];
      thisGame.numOfReady++;
      if (thisGame.numOfReady === 2) {
        Models.Challenge.findQ()
        .then( function(problem) {
          var data = {
            name: problem[0].name,
            boilerplate: problem[0].boilerplate
          };
          thisGame.players[0].socket.emit('startGame', data);
          thisGame.players[1].socket.emit('startGame', data);
        });
      }
    });

    socket.on('update', function(data) {
      var thisGame = games[data.gameID];
      if (thisGame && socket.id === thisGame.players[0].socketID) {
        thisGame.players[1].socket.emit('updated', {data: data.data});
        
        //show the watchers
        thisGame.watchers.forEach(function(watcher) {
          watcher.socket.emit('viewerUpdate', {
            player: 1,
            data: data.data
          });
        });
      } else if (thisGame && socket.id === thisGame.players[1].socketID) {
        thisGame.players[0].socket.emit('updated', {data: data.data}); 

        //show the watchers
        thisGame.watchers.forEach(function(watcher) {
          watcher.socket.emit('viewerUpdate', {
            player: 2,
            data: data.data
          });
        });
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
