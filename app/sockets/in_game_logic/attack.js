module.exports = function (socket, games) {
  socket.on('attack', function (data) {
    var thisGame = games[data.gameID];
    if (thisGame && thisGame.players[0] && thisGame.players[0].socketID === socket.id) {
      thisGame.players[1].socket.emit('attacked', {
        weapon: data.weapon
      });
    } else if (thisGame && thisGame.players[1] && thisGame.players[1].socketID === socket.id) {
      thisGame.players[0].socket.emit('attacked', {
        weapon: data.weapon
      });
    }
  });
};