var _ = require('lodash');
var getAvailableGames = function (games) {
  return _.map(games, function (game, key) {
    return [key, game.players.length, game.watchers.length, game.gameName];
  });
};

module.exports = function (socket, games) {
  /*get available games*/
  socket.on('getAvailableGames', function () {
    var availableGames = getAvailableGames(games); //get the available games
    socket.emit('receivedAvailableGames', availableGames); //send back the available games
  });
};