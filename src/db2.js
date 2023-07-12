const mysql = require("mysql2");

const db2 = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'test',
})

module.exports = db2