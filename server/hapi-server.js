var api = require('./api');
var db = require('./db');

// hapi framework related
var Hapi = require('hapi');
var Inert = require('inert');  // to serve static files

var urlParser = require('url');


// connect to DB
var mysqlConnect = db.createConnection();
if (!mysqlConnect) {
  console.log('Failed to connect to mysql');
  return -1;
} else {
  console.log('Connected to mysql');
}

var server = new Hapi.Server();
server.connection({ port: 8888 });
// be enable to serve static files
server.register(Inert, function() {} );

// The main entry page
server.route({
  method: 'GET',
  path: '/',
  handler: {
    file: './fe/main.html'
  },
});

// All other page resources, .html, .js, .css, .jpeg, etc
server.route({
  method: 'GET',
  path: '/pages/{filename*}',
  handler: {
    directory: {
      path: './fe',
      index: './fe/main.html'
    }
  }
});

// ----- below are APIs -----
server.route({
  method: 'GET',
  path: '/api/save',
  handler: function(request, reply) {
    var parsedRequest = urlParser.parse(request.url, true);
    api.saveUser(mysqlConnect, parsedRequest.query);
    reply('Saved');
  }
});

// Start server
server.start(function() {
  console.log('Server running at:', server.info.uri);
});
