module.exports = function (socket, games) {
  socket.on('update', function (data) {
    var thisGame = games[data.gameID];
    if (!thisGame) {
      return;
    }
    if (socket.id === thisGame.players[0].socketID) {
      thisGame.players[0].latestContent = data.data;
      thisGame.players[1] && thisGame.players[1].socket.emit('updated', {
        data: data.data
      });

      //show the watchers
      thisGame.watchers.forEach(function (watcher) {
        watcher.socket.emit('viewerUpdate', {
          player: 1,
          data: data.data
        });
      });
    } else if (socket.id === thisGame.players[1].socketID) {
      thisGame.players[1].latestContent = data.data;
      thisGame.players[0].socket.emit('updated', {
        data: data.data
      });

      //show the watchers
      thisGame.watchers.forEach(function (watcher) {
        watcher.socket.emit('viewerUpdate', {
          player: 2,
          data: data.data
        });
      });
    }
  });
};