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


var balancedParens = new Models.Challenge({
  name: "Balanced Parens",
  inputs: ['[](){}', '[(]{)}', ' var hubble = function() { telescopes.awesome();', ' var wow  = { yo: thisIsAwesome() }'],
  outputs: [true, false, false, true],
  solution: '',
  functionName: "balancedParens",
  boilerplate: "// write a function that takes a string of text and returns true if\n" +
  "// the parentheses ( () {} [] ) are balanced and false otherwise.\n\n" +
  "var balancedParens = function(input) {\n\n};"
});
balancedParens.saveQ()
.then(function(){
  console.log("saved Successfully");
});

var evenOccurence = new Models.Challenge({
  name: "Even Occurances",
  inputs: ['[1,2,3,4,5,6,7,8,9,1]', '[1,1,2,3,4,3,2,1]', '[5,5,5,4,4,5]', '[]', '[1,1,3,4,1]'],
  outputs: [1,2,5,null,null],
  solution: 'var evenOccurence = function(arr) {
  var resultArray = [];
  var intArray = [];
  var objCounter = {};
  for (var i = 0; i < arr.length; i++){
    if (objCounter[arr[i]]){
      objCounter[arr[i]] += 1
    } else {
      intArray.push(arr[i]);
      objCounter[arr[i]] = 1;
    }
  }
  for (var i = 0; i < intArray.length; i++){
    if (objCounter[intArray[i]] % 2 === 0){
      resultArray.push(intArray[i])
    }
  }
  if (resultArray.length > 0){
    return resultArray[0];
  }
  return null;
};',
  functionName: "evenOccurance",
  boilerplate: "// Find the first item that occurs an even number of times in an array.\n" +
  "// Remember to handle multiple even-occurance items and return the first one.\n\n" +
  "Return null if there are no even-occurance items. {\n\n};"
});
evenOccurance.saveQ()
.then(function(){
  console.log("saved Successfully");
});

var sumArray = new Models.Challenge({
  name: "Sum Array",
  inputs: ['[1, 2, 3]', '[1, -3, 2, 3]', '[5, 2, -3, 2]', '[-5, -1, -3]'],
  outputs: [6, 5, 7, -1],
  solution: '',
  functionName: "sumArray",
  boilerplate: "// Given an array of numbers, calculate the greatest contiguous sum of numbers in it.\n"
});
sumArray.saveQ()
.then(function(){
  console.log("saved Successfully");
});


