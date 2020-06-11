const mysql = require('mysql');

class ConnectDB {

    Query(sqlQry, callback) {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });

        connection.query(sqlQry, function(error, results, fields) {
            let dataset = '';

            if (error)
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

module.exports = ConnectDB;