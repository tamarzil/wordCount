'use strict';

const mysql = require('mysql');

class mysqlPool {

    constructor() {
        console.log('initializing DB...');
        this.init();
    }

    init() {
        this.pool  = mysql.createPool({
            connectionLimit : 10,
            host            : 'localhost',
            user            : 'root',
            password        : 'pass1234'
        });
        // TODO: move DB host and creds to configuration
    }

    executeQuery(query, params) {
        return new Promise((resolve, reject) => {
            this.pool.query(query, params, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = new mysqlPool();
