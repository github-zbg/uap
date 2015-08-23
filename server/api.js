// APIs for business logics.

var apiResult = require('./api-result');
var db = require('./db');

var dbConnect = null;
// This function must be invoked before any other APIs.
exports.init = function(callback) {
  // Init by connecting to DB
  dbConnect = db.createConnection();
  dbConnect.connect(function(error) {
    if (error) {
      console.log('Failed to connect to DB: ' + error);
    } else {
      console.log('Connected to DB');
    }
    callback(error);
  });
}

exports.saveUser = function(queryParams, callback) {
  var name = queryParams.name;
  var email = queryParams.email;
  console.log('Saving ' + name + ' with email ' + email);
  if (!name) {
    callback(apiResult.errorResult(apiResult.ARGUMENT_ERROR,
                                   'Name is not specified'));
    return;
  }
  if (!email) {
    email = '';
  }
  var sql = 'insert into uap_test values(?, ?)';
  var params = [name, email];
  dbConnect.query(sql, params, function(error, result) {
    if (error) {
      console.log('Insert error: ', error.message);
      callback(apiResult.errorResult(apiResult.INTERNAL_ERROR,
                                     'Failed to save'));
      return;
    }
    console.log('Insert successfully, ', result);
    callback(apiResult.successResult(apiResult.SUCCESS, result));
  });
};

exports.registerUser = function(user, callback) {
  console.log('Register ' + user.nickname + ' with userid ' + user.userid);
  if (!user.nickname || !user.userid || !user.password) {
    callback(apiResult.errorResult(apiResult.ARGUMENT_ERROR,
                                   'Missing required fields to register'));
    return;
  }

  var sql = 'insert into UapUsers values(?, ?, ?)';
  var params = [user.userid, user.nickname, user.password];
  dbConnect.query(sql, params, function(error, result) {
    if (error) {
      console.log('Register error: ', error.message);
      callback(apiResult.errorResult(apiResult.INTERNAL_ERROR,
                                     'Failed to register'));
      return;
    }
    console.log('Register successfully, ', result);
    callback(apiResult.successResult(apiResult.SUCCESS, result),
             {userid: user.userid, nickname: user.nickname});
  });
};

exports.loginUser = function(userid, password, callback) {
  console.log('Login for ' + userid);
  if (!userid || !password) {
    callback(apiResult.errorResult(apiResult.ARGUMENT_ERROR,
                                   'Missing userid or password to login'));
    return;
  }

  var sql = 'select NickName, Password from UapUsers where UserId in (?)';
  var params = [userid];
  dbConnect.query(sql, params, function(error, result) {
    if (error) {
      console.log('Verify password error: ', error.message);
      callback(apiResult.errorResult(apiResult.INTERNAL_ERROR,
                                     'Verify password error'));
      return;
    }
    console.log('Get user, ', result);
    if (result.length == 0) {
      callback(apiResult.errorResult(apiResult.ARGUMENT_ERROR,
                                     'UserId or Password error'));
      return;
    }
    // result is the row in DB.
    var nickname = result[0].NickName;
    if (password !== result[0].Password) {
      callback(apiResult.errorResult(apiResult.ARGUMENT_ERROR,
                                     'UserId or Password error'));
      return;
    }
    callback(apiResult.successResult(apiResult.SUCCESS, result),
             {userid: userid, nickname: nickname});
  });
};
