var crypto = require('crypto');

module.exports = {
  
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
  }
};