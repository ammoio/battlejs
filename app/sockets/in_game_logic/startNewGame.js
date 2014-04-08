module.exports = function (socket, games) {
  socket.on('startNewGame', function (data) {
    var thisGame = games[data.gameID];
    if (!thisGame) {
      return;
    }

    thisGame.started = false;
    if (thisGame.players[0].socketID === socket.id) {
      thisGame.players[0].isReady = false;
    } else {
      thisGame.players[1].isReady = false;
    }
  });
};