'use strict';

const mysql = require('mysql');
const config = require('../config');


class mysqlPool {

    constructor() {
        console.log('initializing DB...');
        this.init();
    }

    init() {
        this.pool  = mysql.createPool({
            host            : config.mysql.host,
            user            : config.mysql.user,
            password        : config.mysql.password,
            connectionLimit : config.mysql.pool_max_connections
        });
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
