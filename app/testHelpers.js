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

  validate: function(functionName, js){
    var d = Q.defer();
    console.log(functionName);

    Models.Challenge.findOneQ({functionName: functionName})
    .then(function(challenge){
      console.log("challenge", challenge);
      var success = true;
      var count = 0;
    
      console.log("Inputs: ", challenge.inputs);
      challenge.inputs.forEach(function(input, index){
        var s = new Sandbox();
        
        s.run(js + "\n" + functionName + "(" + JSON.stringify(input) + ");", function(output){
          if(output.result.indexOf('Error') !== -1){
            // console.log("error in output");
            d.reject(output);
            success = false;
            count += 1;
            return;
          }

          if(output.result !== challenge.outputs[index]){
            d.reject("Failed on input: " + input + ". " + "Expected " + output.result + " to equal " + challenge.outputs[index]);
            success = false;
            count += 1;
            return;
          }

          if(count === challenge.inputs.length){
            if(success){
              d.resolve("Passed " + challenge.inputs.length + " tests!");
            } else {
              d.reject("something went wrong");
            }
          }

        });
      });

    })
    .fail(function(err){
      console.log("failed" + err);
      d.reject(err);
    });

    return d.promise;
  }

};