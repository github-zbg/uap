// DEPRECATED, use hapi-server.js

var api = require('./server/api');
var db = require('./server/db');

var http = require('http');
var fs = require('fs');
var urlParser = require('url');

var responseWithFile = function(filename, response) {
  fs.readFile(filename, "utf8", function(error, text) {
    var content;
    if (error) {
      content = 'Read ' + filename + ' error: ', error;
      console.log(content);
    } else {
      content = text;
      console.log('Read ' + filename + ' successfully');
    }
    response.end(content);
  });
};

var dispatcher = function(request, response) {
  console.log('Request url: ' + request.url);
  // Get the path and query parameters as well.
  var parsedRequest = urlParser.parse(request.url, true);
  var path = parsedRequest.pathname;
  console.log('path: ' + path);
  // console.log('search: ' + parsedRequest.search);
  if (path == "/api/save") {
    api.saveUser(mysqlConnect, parsedRequest.query);
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8;'});
    response.end('Saved');
  } else if (path.indexOf('.html') > 0) {
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8;'});
    responseWithFile(path.slice(1), response);  // remove the leading '/'
  } else if (path.indexOf('.js') > 0) {
    response.writeHead(200, {'Content-Type': 'text/javascript;charset=utf-8;'});
    responseWithFile(path.slice(1), response);
  } else {  // default, return the main page
    response.writeHead(200, {'Content-Type': 'text/html;charset=utf-8;'});
    responseWithFile('main.html', response);
  }
};

// Start server
var mysqlConnect = db.createConnection();
if (!mysqlConnect) {
  console.log('Failed to connect to mysql');
  return -1;
} else {
  console.log('Connected to mysql');
}
var port = 8888;
http.createServer(dispatcher).listen(port);
console.log('Sever Starting on http-' + port);
