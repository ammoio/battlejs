module.exports = function (socket, games, clients, activeSockets) {
  socket.on('joinGame', function (data) {
    var thisGame = games[data.gameID];
    if (thisGame && thisGame.players.length === 1) { //second play joining
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
      thisGame.activeSockets += 1;

      // socket.emit('updated', thisGame.players[0].latestContent);
      socket.emit('gameReady', {
        playerName: thisGame.players[1].playerName,
        opponentName: thisGame.players[0].playerName
      });
      thisGame.players[0].socket.emit('gameReady', {
        playerName: thisGame.players[0].playerName,
        opponentName: thisGame.players[1].playerName
      });

    } else if (thisGame && thisGame.players.length > 1) { //watchers
      socket.emit('gameFull');
    } else {
      socket.emit('gameDoesNotExist'); //if game does not exist
    }
  });
};