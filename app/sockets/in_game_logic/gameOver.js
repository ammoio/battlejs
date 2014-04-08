module.exports = function (socket, games) {
  socket.on('gameOver', function (data) {
    var thisGame = games[data.gameID];
    if (thisGame) {
      thisGame.players[1].socket.emit('show');
      thisGame.players[0].socket.emit('show');
    }
  });
};