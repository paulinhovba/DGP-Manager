// Node.js MySQL Result Object Example
// include mysql module
var mysql = require('mysql');
// create a connection variable with the required details
var con = mysql.createConnection({
  host: 'mysql942.umbler.com',
  port: '41890',
  user: 'prmpoker',
  password: 'stuunga1980',
  database: 'nodejsbd'
});
// make to connection to the database.
con.connect(function(err) {
  if (err) throw err;
  // if connection is successful
  con.query("SELECT * FROM clientes", function (err, result, fields) {
    // if any error while executing above query, throw error
    if (err) throw err;
    // if there is no error, you have the result
    // iterate for all the rows in result
    Object.keys(result).forEach(function(key) {
      var row = result[key];
      console.log(row.Nome)
    });
  });
});