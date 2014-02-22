var mongoose = require('mongoose-q')();


var gameSchema = mongoose.Schema({
  gameId: String,
  player1Socket: String,
  player2Socket: String,
  player1Ready: Boolean,
  player2Ready: Boolean
});

var challengeSchema = mongoose.Schema({
  name: String,
  inputs: [],
  outputs: [],
  solution: String,
  functionName: String,
  boilerplate: String
});


module.exports = {
  Game: mongoose.model('Game', gameSchema),
  Challenge: mongoose.model('Challenge', challengeSchema)
};