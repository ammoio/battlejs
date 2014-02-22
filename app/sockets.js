var crypto = require('crypto');
var Sandbox = require('sandbox');

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
        'player1': {
          'socketID': socket.id,
          'socket': socket
        }
      };
      socket.emit('gameID', {'gameID': gameID});
    });
    
    socket.on('ready', function(data) {
      
     });

    socket.on('submit', function(data) {
      var s = new Sandbox();
      s.run(data, function(output){
        socket.emit('output');
      });
    });
    
  });
};