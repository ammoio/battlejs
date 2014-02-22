var mongoose = require('mongoose-q')();
var Models = require('../app/models');

// connect to MongoDB
mongoose.connect('mongodb://localhost/battlejs');

var reverseString = new Models.Challenge({
  name: "Reverse String",
  inputs: ['hello', 'a', 'get it together', '{{`12})3'],
  outputs: ["olleh","a","rehtegot ti teg","3)}21`{{"],
  solution: 'var reverseString = function (input){return input.split("").reverse().join("");};',
  functionName: "reverseString",
  boilerplate: "var reverseString = function (string) {\n  return string;\n};"
});
reverseString.saveQ()
.then(function(){
  console.log("saved Successfully");
});

Models.Challenge.findQ().then(function(model){
  console.log(model + "HERE");
});

