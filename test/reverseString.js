var string = ['hello', 'a', 'get it together', '{{`12})3'];

var reverseString = function(input){
  return input.split('').reverse().join("");
};

var results = [];
string.forEach(function(value){
  results.push(reverseString(value));
});
console.log(JSON.stringify(results));