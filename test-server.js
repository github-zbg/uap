var http = require('http');
var fs = require('fs');
var urlParser = require('url');
var mysql = require('mysql');

var createConnection = function() {
  return mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'gladiator',
    port: '3306',
    database: 'test',
  });
};

var closeConnection = function(connection) {
  connection.end(function(error) {
    if (error) {
      console.log('Connection close error: ' + error);
    }
    console.log('Connection closed');
  });
};

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

var saveUser = function(dbConnect, queryParams) {
  var name = queryParams.name;
  var email = queryParams.email;
  console.log('Saving ' + name + ' with email ' + email);
  if (!name) return;
  if (!email) {
    email = '';
  }
  var sql = 'insert into uap_test values(?, ?)';
  var params = [name, email];
  dbConnect.query(sql, params, function(error, result) {
    if (error) {
      console.log('Insert error: ', error.message);
      return;
    }
    console.log('Insert successfully, ', result);
  });
};

var dispatcher = function(request, response) {
  console.log('Request url: ' + request.url);
  // Get the path and query parameters as well.
  var parsedRequest = urlParser.parse(request.url, true);
  var path = parsedRequest.pathname;
  console.log('path: ' + path);
  // console.log('search: ' + parsedRequest.search);
  if (path == "/save") {
    saveUser(mysqlConnect, parsedRequest.query);
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
var mysqlConnect = createConnection();
if (!mysqlConnect) {
  console.log('Failed to connect to mysql');
  return -1;
} else {
  console.log('Connected to mysql');
}
var port = 8888;
http.createServer(dispatcher).listen(port);
console.log('Sever Starting on http-' + port);
