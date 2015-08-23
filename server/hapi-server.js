var api = require('./api');
var RouteHandlers = require('./handlers');

// hapi framework related
var Hapi = require('hapi');

// Initialize API module
api.init(function(error) {
  if (error) {
    console.log('Failed to initialize API module: ' + error);
    process.exit(1);  // exit server
  }
  console.log('API module initialized');
});

var server = new Hapi.Server();
server.connection({ port: 8888 });
handlers = new RouteHandlers(server, api);
handlers.setupRoutes();

// Start server
server.start(function() {
  console.log('Server running at:', server.info.uri);
});
