var Sandbox = require('sandbox');
var Models = require('../app/models');
var testHelpers = require('./testHelpers');
var Firebase = require('firebase');
var SocketHelpers = require('./socketHelpers');

//socket io logic


module.exports.listen = function(server){
  var io = require('socket.io').listen(server);
  var clients = {};
  var games = {};
  var activeSockets = {};
  var gameWaiting = null;

  io.sockets.on('connection', function (socket) {
    //save the session id
    clients[socket.id] = {
      socket: socket,
      gameID: null,
      isPlaying: false
    };

    //when newGame is clicked
    socket.on('newGame', function(data) {

      // if (!data.newGame && gameWaiting){
      //   socket.emit('gameID', {'gameID': gameWaiting, 'second': true});
      //   gameWaiting = null;
      //   return;
      // }
      
      //make new game
      var gameID = SocketHelpers.makeNewGame(games, socket);

      //add player to game
      clients[socket.id].gameID = gameID;
      clients[socket.id].isPlaying = true;

      //add to active sockets
      activeSockets[socket.id] = gameID;

      if (!data.newGame){
        gameWaiting = gameID;
        console.log(gameWaiting)
      }

      socket.emit('gameID', {'gameID': gameID, 'name': 'JS Warrior'});
    });


    /*get available games*/
    socket.on('getAvailableGames', function() {
      var availableGames = SocketHelpers.getAvailableGames(games); //get the available games
      socket.emit('receivedAvailableGames', availableGames); //send back the available games
    });

    socket.on('playerName', function(data) {
      var thisGame = games[data.gameID];
      if (thisGame && thisGame.players[0].socketID === socket.id && data.playerName && data.playerName.length > 0) {
        thisGame.players[0].playerName = data.playerName;
      } else if (thisGame && thisGame.players[1] && thisGame.players[1].socketID === socket.id && data.playerName && data.playerName.length > 0) {
        thisGame.players[1].playerName = data.playerName;
      }
    });
    //other players trying to join
    socket.on('joinGame', function(data) {
      var thisGame = games[data.gameID];
      console.log(thisGame)
      if (thisGame && thisGame.players.length === 1) { //second play joining
        console.log("Second Player Joined, gameready");
        thisGame.players.push({
          'socketID': socket.id,
          'socket': socket,
          'playerNumber': 2,
          'playerName': 'JS Ninja'
        });

        clients[socket.id].gameID = data.gameID;
        clients[socket.id].isPlaying = true;

        //adds to active sockets
        activeSockets[socket.id] = data.gameID;
        thisGame['activeSockets'] += 1;


        socket.emit('updated', thisGame.players[0].latestContent);
        setTimeout(function() {
          socket.emit('gameReady', {
            playerName: thisGame.players[1].playerName,
            opponentName: thisGame.players[0].playerName
          });
          thisGame.players[0].socket.emit('gameReady', {
            playerName: thisGame.players[0].playerName,
            opponentName: thisGame.players[1].playerName
          });
        }, 0);

      } else if (thisGame && thisGame.players.length > 1) { //watchers
        socket.emit('gameFull');
      } else {
        socket.emit('gameDoesNotExist'); //if game does not exist
      }
      console.log(thisGame)
    });

    socket.on('addMeAsWatcher', function(data) {
      var thisGame = games[data.gameID];
      clients[socket.id].gameID = data.gameID; // set this player as a watcher
      if (thisGame && thisGame.players[0]) {
        thisGame.watchers.push({
          'socketID': socket.id,
          'socket': socket
        });

        //adds to active sockets
        activeSockets[socket.id] = data.gameID;
        thisGame['activeSockets'] += 1;

        //update view for player 1
        socket.emit('viewerUpdate', {
          player: 1,
          data: thisGame.players[0].latestContent
        });
        //update view for player 2
        if (thisGame.players[1]) {
          socket.emit('viewerUpdate', {
            player: 2,
            data: thisGame.players[1].latestContent
          })
        }
      } else {
        console.log('not exist', data);
        socket.emit('gameDoesNotExist');
      }
    });

    socket.on('ready', function(data) {
      var thisGame = games[data.gameID];
      console.log(thisGame);
      //player 1 sending ready signal
      if (thisGame.players[0].socket === socket) {
        thisGame.players[0].isReady = true;
      } else if (thisGame.players[1] && thisGame.players[1].socket === socket) {
        thisGame.players[1].isReady = true;
      }
      if (thisGame.started === false && thisGame.players.length === 2 && thisGame.players[0].isReady && thisGame.players[1].isReady) {
        Models.Challenge.findQ()
        .then( function(problem) {
          var randomPick = Math.random() * problem.length | 0;
          var data = {
            name: problem[randomPick].name,
            functionName: problem[randomPick].functionName,
            boilerplate: problem[randomPick].boilerplate
          };
          thisGame.started = true;
          thisGame.players[0].socket.emit('startGame', data);
          thisGame.players[1].socket.emit('startGame', data);
          thisGame.players[0].isReady = false;
          thisGame.players[1].isReady = false;
        });
      }
    });

    socket.on('update', function(data) {
      var thisGame = games[data.gameID];
      if (thisGame && socket.id === thisGame.players[0].socketID) {
        thisGame.players[0].latestContent = data.data;
        thisGame.players[1] && thisGame.players[1].socket.emit('updated', {data: data.data});
        
        //show the watchers
        thisGame.watchers.forEach(function(watcher) {
          watcher.socket.emit('viewerUpdate', {
            player: 1,
            data: data.data
          });
        });
      } else if (thisGame && socket.id === thisGame.players[1].socketID) {
        thisGame.players[1].latestContent = data.data;
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
      testHelpers.validate(data.functionName, data.data)
      .then(function(output){
        socket.emit('submitResults', output);
      })
      .fail(function(output){
        socket.emit('submitResults', output);
      });
    });

    /********** attacks ************/
    socket.on('attack', function(data){
      var thisGame = games[data.gameID];
      console.log(data.weapon);
      if (thisGame.players[0] && thisGame.players[0].socketID === socket.id) {
        thisGame.players[1].socket.emit('attacked', {weapon: data.weapon});
      } else if (thisGame.players[1] && thisGame.players[1].socketID === socket.id) {
        thisGame.players[0].socket.emit('attacked', {weapon: data.weapon});
      }
    });

    socket.on('disconnect', function () {
      var client = clients[socket.id];
      if (client && client.gameID) { //was in a game when disconnected
        var game = games[client.gameID];
        if (game && client.isPlaying) {
          SocketHelpers.deletePlayerFromGame(socket.id, game.players); //delete player from game
        } else if (game) {
          SocketHelpers.deleteWatcherFromGame(socket.id, game.watchers); //delete watcher from game
        }

        if (game.watchers.length + game.players.length === 0) {
          delete games[client.gameID]; //delete game
          //remove chat data of this game
          var chatRef = new Firebase('https://battlejs.firebaseio.com/chat/' + client.gameID);
          chatRef.remove();
        }
      }
      delete clients[socket.id];

      // //removes from to active sockets
      // if (games[activeSockets[socket.id]]){
      //   games[activeSockets[socket.id]]['activeSockets'] -= 1;
      //   if (games[activeSockets[socket.id]]['activeSockets'] === 0){
      //     var chatRef = new Firebase('https://battlejs.firebaseio.com/chat/');
      //     chatRef.child('' + activeSockets[socket.id]).set(null);
      //     delete games[activeSockets[socket.id]];
      //   }
      //   delete activeSockets[socket.id];
      // }

    });

    socket.on('startNewGame', function(data) {
      var thisGame = games[data.gameID];
      thisGame.started = false;
    });

    socket.on('winner', function(data){
      var thisGame = games[data.gameID];
      if (thisGame.players[0].socketID === socket.id){
        thisGame.winner = 0;
        thisGame.players[1].socket.emit('loser');
      } else {
        thisGame.winner = 1;
        thisGame.players[0].socket.emit('loser');
      }
    });

    socket.on('gameOver', function(data){
      var thisGame = games[data.gameID];
      thisGame.players[1].socket.emit('show');
      thisGame.players[0].socket.emit('show');
    });

  });
};
