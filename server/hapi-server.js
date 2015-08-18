var api = require('./api');
var db = require('./db');
var apiResult = require('./api-result');

// hapi framework related
var Hapi = require('hapi');
var Inert = require('inert');  // to serve static files

var urlParser = require('url');


// connect to DB
var mysqlConnect = db.createConnection();
mysqlConnect.connect(function(error) {
  if (error) {
    console.log('Failed to connected to mysql, ' + error);
    process.exit(1);  // exit server
  }
  console.log('Connected to mysql');
});

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
    var handleApiResult = function(result) {
      if (result.code == apiResult.SUCCESS) {
        reply('Saved');
      } else if (result.code == apiResult.ARGUMENT_ERROR) {
        reply(result.error).code(400);
      } else if (result.code == apiResult.INTERNAL_ERROR) {
        reply(result.error).code(500);
      }
    }
    api.saveUser(mysqlConnect, parsedRequest.query, handleApiResult);
  }
});

// Start server
server.start(function() {
  console.log('Server running at:', server.info.uri);
});
