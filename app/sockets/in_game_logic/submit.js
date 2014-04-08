var testHelpers = require('../../test/testHelpers');

module.exports = function (socket) {
  socket.on('submit', function (data) {
    testHelpers.validate(data.functionName, data.data)
      .then(function (output) {
        socket.emit('submitResults', output);
      })
      .fail(function (output) {
        socket.emit('submitResults', output);
      });
  });
};