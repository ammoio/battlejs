var Models = require('../../models/models');

module.exports = function (socket, games) {
  socket.on('ready', function (data) {
    var thisGame = games[data.gameID];
    if (!thisGame) {
      return;
    }
    //player 1 sending ready signal
    if (thisGame.players[0].socket === socket) {
      thisGame.players[0].isReady = true;
    } else if (thisGame.players[1] && thisGame.players[1].socket === socket) {
      thisGame.players[1].isReady = true;
    }
    if (thisGame.started === false && thisGame.players.length === 2 && thisGame.players[0].isReady && thisGame.players[1].isReady) {
      Models.Challenge.findQ()
        .then(function (problem) {
          var randomPick = Math.random() * problem.length | 0;
          var data = {
            name: problem[randomPick].name,
            functionName: problem[randomPick].functionName,
            boilerplate: problem[randomPick].boilerplate
          };
          thisGame.started = true;
          thisGame.players[0].socket.emit('startGame', data);
          thisGame.players[1].socket.emit('startGame', data);
          thisGame.players[0].isReady = false;
          thisGame.players[1].isReady = false;
        });
    }
  });
};