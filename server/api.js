var apiResult = require('./api-result');

module.exports = {
  saveUser: function(dbConnect, queryParams, callback) {
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
        // reply('Failed').code(500);
        callback(apiResult.errorResult(apiResult.INTERNAL_ERROR,
                                       'Failed to save'));
        return;
      }
      console.log('Insert successfully, ', result);
      callback(apiResult.successResult(apiResult.SUCCESS, result));
      // reply('Saved');
    });
  },
};
