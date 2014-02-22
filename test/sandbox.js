var Sandbox = require('sandbox');

var s = new Sandbox();
s.run('function test (n) { console.log(n); return n;}; test(3);', function(output){
  console.log(output);
});