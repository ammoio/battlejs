var Sandbox = require('sandbox');
var Q = require('q');
var Models = require('./models');

var errors = [
  'SyntaxError:',
  'ReferenceError:',
  'TypeError:',
  'TimeoutError'
];

module.exports = {
  run: function(input){
    var d = Q.defer();

    var s = new Sandbox();
    s.run(input, function(output){
      d.resolve(output);
    });

    return d.promise;
  },

  validate: function(functionName, input){
    var d = Q.defer();

    Models.Challenge.findOneQ({functionName: functionName})
    .then(function(challenge){
      var success = true;

      challenge.inputs.forEach(function(input, index){
        var s = new Sandbox();
        s.run(input + "\n" + functionName + "(" + challenge.inputs[i] + ");", function(output){
          if(output.result.indexOf('Error') !== -1){
            d.reject(output);
            success = false;
            return;
          }
          if(output.result !== challenge.outputs[index]){
            d.reject("Failed on input: " + input + ". " + "Expected " + output.result + " to equal " + challenge.outputs[index]);
            success = false;
            return;
          }
        });
      });

      if(success){
        d.resolve("Passed " + challenge.inputs.length + " tests!");
      }

    })
    .fail(function(err){
      d.reject(err);
    })




    return d.promise;
  }

};