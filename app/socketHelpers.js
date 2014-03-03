var crypto = require('crypto');
var _ = require('underscore');
module.exports = {
  getAvailableGames: function(games) {
    return _.map(games, function(game, key) {
      return [key, game.players.length, game.watchers.length];
    });
  },
  
  makeNewGame: function(games, socket) {     
    //generate new game ID
    var gameID = crypto.randomBytes(4).toString('base64').slice(0, 4).replace('/', 'a').replace('+', 'z');

    //store it into games
    games[gameID] = {
      'players': [{
        'socketID': socket.id,
        'socket': socket,
        'playerNumber': 1,
        'latestContent': "",
        'isReady': false,
        'playerName': 'JS Warrior'
      }],
      'watchers': [],
      'activeSockets': 1,
      'started': false,
      'winner': null
    }; 
    return gameID;
  }, 

  deletePlayerFromGame: function(socketID, players) {
    if (players[0] && players[0].socketID === socketID) { //was player 1
      players.shift();
    } else if (players[1] && players[1].socketID === socketID) { //was player 2
      players.pop();
    }
  },

  deleteWatcherFromGame: function(socketID, watchers) {
    console.log('in delete watcher', watchers);
    for (var i = 0; i < watchers.length; i++) {
      if (watchers[i].socketID === socketID) {
        watchers.splice(i, 1);
        return;
      }
    }
  }

};