const mysql = require('mysql');

class GenModels {

  execSQLQuery(sqlQry, callback){
    const connection = mysql.createConnection({
      host: 'mysql942.umbler.com',
      port: '41890',
      user: 'prmpoker',
      password: 'stuunga1980',
      database: 'nodejsbd'
    });
  
    connection.query(sqlQry, function(error, results, fields){
      let dataset = '';
      
      if(error) 
        console.log(error);
      else
        dataset = results;
        //console.log(dataset);
        connection.end();
        //console.log('Executou conexão com DB:');
        return callback(dataset);
    });
  }

}

module.exports = GenModels;
