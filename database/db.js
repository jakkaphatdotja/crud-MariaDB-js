const mariadb = require("mariadb");

const db = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    connectionLimit: 5
});

db.getConnection((err, conn)=>{
    if (err) throw err;
    if (conn) conn.release();
    return;
});

module.exports = db;