var ctrl = require('../controllers/controllers');

module.exports = function (app) {
  // catch all route 
  app.get('*', ctrl.renderAngular);

};