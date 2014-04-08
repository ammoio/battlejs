module.exports = function (socket, games, clients, activeSockets) {
  socket.on('addMeAsWatcher', function (data) {
    var thisGame = games[data.gameID];

    clients[socket.id].gameID = data.gameID; // set this player as a watcher
    if (thisGame && thisGame.players[0]) {
      thisGame.watchers.push({
        'socketID': socket.id,
        'socket': socket
      });

      //adds to active sockets
      activeSockets[socket.id] = data.gameID;
      thisGame.activeSockets += 1;

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
        });
      }
    } else {
      socket.emit('gameDoesNotExist');
    }
  });
};