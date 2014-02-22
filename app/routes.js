var ctrl = require('./controllers');

module.exports = function(app) {
    
    // catch all route 
    app.get('*', ctrl.renderAngular);

};