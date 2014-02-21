var ctrl = require('./controllers');

module.exports = function(app) {
    
    // Home route 
    app.get('/', ctrl.renderAngular);

};