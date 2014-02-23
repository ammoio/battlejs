var crypto = require('crypto');
var Sandbox = require('sandbox');
var Models = require('../app/models');
var testHelpers = require('./testHelpers');
var Firebase = require('firebase');

//socket io logic


module.exports.listen = function(server){
  var io = require('socket.io').listen(server);
  var clients = [];
  var games = {};
  var activeSockets = {};

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
          'playerNumber': 1,
          'latestContent': "",
          'isReady': false
        }],
        'watchers': [],
        'activeSockets': 1,
        'started': false
      };
      console.log("First Player Joined");

      //add to active sockets
      activeSockets[socket.id] = gameID;

      socket.emit('gameID', {'gameID': gameID});
    });

    //other players trying to join
    socket.on('joinGame', function(data) {
      var thisGame = games[data.gameID];
      if (thisGame && thisGame.players.length === 1) { //second play joining
        console.log("Second Player Joined, gameready");
        thisGame.players.push({
          'socketID': socket.id,
          'socket': socket,
          'playerNumber': 2
        });

        //adds to active sockets
        activeSockets[socket.id] = data.gameID;
        thisGame['activeSockets'] += 1;


        socket.emit('updated', thisGame.players[0].latestContent);
        socket.emit('gameReady');
        thisGame.players[0].socket.emit('gameReady');

      } else if (thisGame && thisGame.players.length > 1) { //watchers
        socket.emit('gameFull');
      } else {
        socket.emit('gameDoesNotExist'); //if game does not exist
      }
    });

    socket.on('addMeAsWatcher', function(data) {
      var thisGame = games[data.gameID];
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

    socket.on('disconnect', function () {
    
      //removes from to active sockets
      if (games[activeSockets[socket.id]]){
        games[activeSockets[socket.id]]['activeSockets'] -= 1;
        if (games[activeSockets[socket.id]]['activeSockets'] === 0){
          var chatRef = new Firebase('https://battlejs.firebaseio.com/chat/');
          chatRef.child('' + activeSockets[socket.id]).set(null);
          delete games[activeSockets[socket.id]];
        }
        delete activeSockets[socket.id];
      }

    });

  });
};
