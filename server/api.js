module.exports = {
  saveUser: function(dbConnect, queryParams) {
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
  },
};
