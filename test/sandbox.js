var Sandbox = require('sandbox');
var testHelpers = require('../app/testHelpers');

var mongoose = require('mongoose-q')();

// connect to MongoDB
mongoose.connect('mongodb://localhost/battlejs');

var js = 'var reverseString = function (n) { console.log(n); return n;}; reverseString(["hi", 4, true, {test: 12}]);';

// var s = new Sandbox();
// s.run(js, function(output){
//   console.log(output);
// });

testHelpers.run(js).then(function(output){
  console.log("run output: " + output.result);
})
.fail(function(output){
  console.log("run failure: ", + output);
});

testHelpers.validate("reverseString", js)
.then(function(output){
  console.log("validate success: " + output);
})
.fail(function(output){
  console.log("validate failure: " +  output.result);
});


