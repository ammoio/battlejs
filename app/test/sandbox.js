var Sandbox = require('sandbox');
var testHelpers = require('./testHelpers');

var mongoose = require('mongoose-q')();

// connect to MongoDB
mongoose.connect('mongodb://localhost/battlejs');

var js = 'var reverseString = function (n) { console.log(n); return n;};';

// var s = new Sandbox();
// s.run(js, function(output){
//   console.log(output);
// });

// testHelpers.run(js).then(function(output){
//   console.log("run output: " + output.result);
// })
// .fail(function(output){
//   console.log("run failure: ", + output);
// });

testHelpers.validate("reverseString", js)
  .then(function (output) {
    console.log("validate success: ");
    console.dir(output);
  })
  .fail(function (output) {
    console.log("validate failure: " + output.result);
  });
testHelpers.validate("reverseString", js)
  .then(function (output) {
    console.log("validate success: ");
    console.dir(output);
  })
  .fail(function (output) {
    console.log("validate failure: " + output.result);
  });
testHelpers.validate("reverseString", js)
  .then(function (output) {
    console.log("validate success: ");
    console.dir(output);
  })
  .fail(function (output) {
    console.log("validate failure: " + output.result);
  });
testHelpers.validate("reverseString", js)
  .then(function (output) {
    console.log("validate success: ");
    console.dir(output);
  })
  .fail(function (output) {
    console.log("validate failure: " + output.result);
  });

setTimeout(function () {
  testHelpers.validate("reverseString", js)
    .then(function (output) {
      console.log("validate success: ");
      console.dir(output);
    })
    .fail(function (output) {
      console.log("validate failure: " + output.result);
    });
}, 2000);