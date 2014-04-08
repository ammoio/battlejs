var Firebase = require('firebase');

var deletePlayerFromGame = function (socketID, players) {
  if (players[0] && players[0].socketID === socketID) { //was player 1
    players.shift();
  } else if (players[1] && players[1].socketID === socketID) { //was player 2
    players.pop();
  }
};

var deleteWatcherFromGame = function (socketID, watchers) {
  for (var i = 0; i < watchers.length; i++) {
    if (watchers[i].socketID === socketID) {
      watchers.splice(i, 1);
      return;
    }
  }
};

module.exports = function (socket, games, clients) {
  socket.on('disconnect', function () {
    var client = clients[socket.id];
    if (client && client.gameID) { //was in a game when disconnected
      var game = games[client.gameID];
      if (game && client.isPlaying) {
        deletePlayerFromGame(socket.id, game.players); //delete player from game
      } else if (game) {
        deleteWatcherFromGame(socket.id, game.watchers); //delete watcher from game
      }

      if (game && game.watchers.length + game.players.length === 0) {
        delete games[client.gameID]; //delete game
        //remove chat data of this game
        var chatRef = new Firebase('https://battlejs.firebaseio.com/chat/' + client.gameID);
        chatRef.remove();
      }
    }
    delete clients[socket.id];
  });
};