var testHelpers = require('../../test/testHelpers');

module.exports = function (socket) {
  socket.on('test', function (data) {
    testHelpers.run(data.data)
      .then(function (output) {
        socket.emit('testResults', output);
      })
      .fail(function (err) {
        socket.emit('testResults', err);
      });
  });
};