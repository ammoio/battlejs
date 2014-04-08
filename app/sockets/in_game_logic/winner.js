module.exports = function (socket, games) {
  socket.on('winner', function (data) {
    var thisGame = games[data.gameID];
    if (!thisGame) {
      return;
    }
    if (thisGame.players[0] && thisGame.players[0].socketID === socket.id) {
      thisGame.winner = 0;
      thisGame.players[1].socket.emit('loser');
    } else {
      thisGame.winner = 1;
      thisGame.players[0] && thisGame.players[0].socket.emit('loser');
    }
  });
};