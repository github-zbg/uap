var mysql = require('mysql');

module.exports = {
  createConnection: function() {
    return mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'gladiator',
      port: '3306',
      database: 'test',
    });
  },

  closeConnection: function(connection) {
    connection.end(function(error) {
      if (error) {
        console.log('Connection close error: ' + error);
      }
      console.log('Connection closed');
    });
  },
};
