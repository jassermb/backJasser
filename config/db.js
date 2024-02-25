const mysql = require('mysql2');

const dbConnection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_pfe',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

dbConnection.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = dbConnection;
