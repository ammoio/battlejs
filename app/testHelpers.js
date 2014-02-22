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
      var count = 0;
      var start = +(new Date);
      var returnObject = {success: true};
    
      challenge.inputs.forEach(function(input, index){
        var s = new Sandbox();
        
        s.run(js + "\n" + functionName + "(" + JSON.stringify(input) + ");", function(output){
          returnObject.console = output.console;
          console.log(count, challenge.inputs.length)
          if(output.result.indexOf('Error') !== -1){
            console.log("error in output");
            returnObject.success = false;
            returnObject.result = "Failed on input: " + input + ". " + "Expected " + output.result + " to equal " + challenge.outputs[index];
            d.resolve(returnObject);
            count += 1;
            return;
          }

          if(output.result.slice(1, output.result.length - 1) !== challenge.outputs[index]){
            console.log('error in comparison', output.result, JSON.stringify(challenge.outputs[index]))
            returnObject.result = "Failed on input: " + input + ". " + "Expected " + output.result + " to equal " + challenge.outputs[index];
            returnObject.success = false;
            d.resolve(returnObject);
            count += 1;
            return;
          }
          count += 1;

          if(count === challenge.inputs.length){
            if(returnObject.success){
              var timed = +(new Date) - start;
              returnObject.result = "Passed " + challenge.inputs.length + " tests!";
              returnObject.timed = timed;
              d.resolve(returnObject);
            } else {
              returnObject.result = "something went wrong"
              d.resolve(returnObject);
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