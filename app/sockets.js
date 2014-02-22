var crypto = require('crypto');

//socket io logic


module.exports.listen = function(server){
  var io = require('socket.io').listen(server);
  var clients = [];
  var games = {};
  io.sockets.on('connection', function (socket) {
    //save the session id
    clients.push(socket.id, socket);

    //when newGame is clicked
    socket.on('newGame', function() {
      
      //generate new game id
      var gameID = crypto.randomBytes(4).toString('base64').slice(0, 4).replace('/', 'a').replace('+', 'z');

      //store it into games
      games[gameID] = {
        'players': [{
          'socketID': socket.id,
          'socket': socket,
          'playerNumber': 1
        }]
      };
      socket.emit('gameID', {'gameID': gameID});
    });

    //other players trying to join
    socket.on('joinGame', function(data) {
      var gameID = data.gameID;
      if (games[gameID].players.length === 1) {
        games[gameID].players.push({
          'socketID': socket.id,
          'socket': socket,
          'playerNumber': 2
        });

        //start the game
        socket.emit('startGame', 'problem');
      }
    });
    
    socket.on('ready', function(data) {
      
    });

    socket.on('submit', function(data) {

    });
  });
};
