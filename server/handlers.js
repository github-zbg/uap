var apiResult = require('./api-result');

var urlParser = require('url');
var Inert = require('inert');  // to serve static files
var auth = require('hapi-auth-cookie');  // authentication

function RouteHandlers(server, apiModule) {
  this.server = server;
  this.apiModule = apiModule;
}

RouteHandlers.prototype.registerHandler = function(request, reply) {
  var user = {
    userid: request.payload.userid,
    nickname: request.payload.nickname,
    password: request.payload.password,
  };
  if (!user.userid || !user.password || !user.nickname) {
    return reply('Missing userid or password to login').code(400);
  }

  var handleApiResult = function(result, userInfo) {
    if (result.code == apiResult.SUCCESS) {
      // Set the user token in cookie
      request.auth.session.set(userInfo);
      reply(userInfo).type('application/json');
    } else if (result.code == apiResult.ARGUMENT_ERROR) {
      reply(result.error).code(400);
    } else if (result.code == apiResult.INTERNAL_ERROR) {
      reply(result.error).code(500);
    }
  }
  this.apiModule.registerUser(user, handleApiResult);
}

RouteHandlers.prototype.loginHandler = function(request, reply) {
  if (request.auth.isAuthenticated) {
    return reply.redirect('/');
  }
  var userid = request.payload.userid;
  var password = request.payload.password;
  if (!userid || !password) {
    return reply('Missing userid or password to login').code(400);
  }

  var handleApiResult = function(result, userInfo) {
    if (result.code == apiResult.SUCCESS) {
      // Set the user token in cookie
      request.auth.session.set(userInfo);
      reply(userInfo).type('application/json');
    } else if (result.code == apiResult.ARGUMENT_ERROR) {
      reply(result.error).code(400);
    } else if (result.code == apiResult.INTERNAL_ERROR) {
      reply(result.error).code(500);
    }
  }
  this.apiModule.loginUser(userid, password, handleApiResult);
}

RouteHandlers.prototype.saveTemplateHandler = function(request, reply) {
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
  this.apiModule.saveUser(parsedRequest.query, handleApiResult);
}

RouteHandlers.prototype.setupRoutes = function() {
  server = this.server;
  apiModule = this.apiModule;

  // be enable to serve static files
  server.register(Inert, function() {} );
  // authentication plugin
  server.register(auth, function (err) {
    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-uap',
        redirectTo: '/login',
        isSecure: false,  // allow on http instead of https
        ttl: 10 * 60 * 1000,  // 10 minutes
    });
  });

  // The login page
  server.route({
    method: ['GET', 'POST'],
    path: '/login',
    handler: {
      file: './fe/login.html'
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
    },
  });

  // The main entry page
  server.route({
    method: 'GET',
    path: '/',
    config: {
      auth: 'session',
      handler: {
        file: './fe/main.html'
      },
    }
  });

  // ----- below are APIs -----
  server.route({
    method: 'GET',
    path: '/api/save',
    handler: this.saveTemplateHandler,
  });

  server.route({
    method: 'POST',
    path: '/api/register',
    handler: this.registerHandler,
  });

  server.route({
    method: 'POST',
    path: '/api/login',
    config: {
      auth: {
        mode: 'try',
        strategy: 'session',
      },
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false,
        }
      },
      handler: this.loginHandler,
    }
  });
}  // setupRoutes

module.exports = RouteHandlers;
