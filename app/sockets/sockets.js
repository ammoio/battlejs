module.exports.listen = function (server) {
  var io = require('socket.io').listen(server);
  //join game logic
  var newGame = require('./join_game_logic/newGame');
  var availableGames = require('./join_game_logic/availableGames');
  var joinGame = require('./join_game_logic/joinGame');
  var disconnect = require('./join_game_logic/disconnect');
  var addMeAsWatcher = require('./join_game_logic/addMeAsWatcher');

  //in game logic
  var attack = require('./in_game_logic/attack');
  var submit = require('./in_game_logic/submit');
  var test = require('./in_game_logic/test');
  var update = require('./in_game_logic/update');
  var ready = require('./in_game_logic/ready');
  var winner = require('./in_game_logic/winner');
  var gameOver = require('./in_game_logic/gameOver');
  var startNewGame = require('./in_game_logic/startNewGame');
  playerName = require('./in_game_logic/playerName');


  var clients = {};
  var games = {};
  var activeSockets = {};
  var gameWaiting = null;

  //when a new client connects
  io.sockets.on('connection', function (socket) {
    //save the session id
    clients[socket.id] = {
      socket: socket,
      gameID: null,
      isPlaying: false
    };

    //join game logic
    newGame(socket, games, clients, activeSockets);
    availableGames(socket, games);
    joinGame(socket, games, clients, activeSockets);
    addMeAsWatcher(socket, games, clients, activeSockets);
    disconnect(socket, games, clients);

    //in game logic
    playerName(socket, games);
    ready(socket, games);
    update(socket, games);
    test(socket);
    submit(socket);
    attack(socket, games);
    startNewGame(socket, games);
    winner(socket, games);
    gameOver(socket, games);
  });
};