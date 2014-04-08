var crypto = require('crypto');

var makeNewGame = function (games, socket, gameName) {
  //generate new game ID
  var gameID = crypto.randomBytes(4).toString('base64').slice(0, 4).replace('/', 'a').replace('+', 'z');

  //store it into games
  games[gameID] = {
    'gameName': gameName,
    'players': [{
      'socketID': socket.id,
      'socket': socket,
      'playerNumber': 1,
      'latestContent': "",
      'isReady': false,
      'playerName': 'JS Warrior'
    }],
    'watchers': [],
    'activeSockets': 1,
    'started': false,
    'winner': null
  };
  return gameID;
};

module.exports = function (socket, games, clients, activeSockets) {
  //when newGame is clicked
  socket.on('newGame', function (data) {
    //make new game
    var gameID = makeNewGame(games, socket, data.gameName);

    //add player to game
    if (clients[socket.id]) {
      clients[socket.id].gameID = gameID;

      clients[socket.id].isPlaying = true;
    }

    //add to active sockets
    activeSockets[socket.id] = gameID;

    if (!data.newGame) {
      gameWaiting = gameID;
    }

    socket.emit('gameID', {
      'gameID': gameID,
      'name': 'JS Warrior'
    });
  });
};