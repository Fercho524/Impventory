const mysql = require('mysql');

const { promisify } = require('util');

const { database } = require('./keys');

const db = mysql.createPool(database);

// Se conecta a la base de datos
db.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('DATABASE CONNECTION WAS CLOSED');
            return;
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('DATABASE HAS TOO MANY CONNECTIONS');
            return;
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('DATABASE CONNECTION WAS REFUSED');
            return;
        }
    }

    if (connection) {
        connection.release();
        console.log('DB is Connected');
    }
});

// Promisify Pool Querys, estamos convirtiendo a promesas lo que antes era con call-backs
db.query = promisify(db.query);

module.exports = db; 