module.exports = function (socket, games) {
  socket.on('playerName', function (data) {
    var thisGame = games[data.gameID];
    if (thisGame && thisGame.players[0].socketID === socket.id && data.playerName && data.playerName.length > 0) {
      thisGame.players[0].playerName = data.playerName;
    } else if (thisGame && thisGame.players[1] && thisGame.players[1].socketID === socket.id && data.playerName && data.playerName.length > 0) {
      thisGame.players[1].playerName = data.playerName;
    }
  });
};