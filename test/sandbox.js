var Sandbox = require('sandbox');

var s = new Sandbox();
s.run('function test (n) { console.log(n); return n;}; test(3); console.log("hello");', function(output){
  console.log(output);
});