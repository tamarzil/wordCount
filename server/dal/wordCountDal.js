'use strict';

const mysql = require('../utils/mysql-pool');
const sql = require('mysql-bricks');

class wordCountDal {

    async getWordCount(word) {
        return new Promise((resolve, reject) => {
            let query = sql.select('word', 'count').from('main.word_count')
                .where('word', word).toParams({placeholder: '?'});

            return mysql.executeQuery(query.text, query.values)
                .then(result => {
                    resolve(result.length ? result[0].count : 0);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }

    async updateWordCounts(wordCounts) {
        return new Promise((resolve, reject) => {

            let values = [];
            Object.keys(wordCounts).forEach(key => {
                values.push([key, wordCounts[key]]);
            });
            let query = sql.insert('main.word_count', 'word', 'count')
                .values(values)
                .onDuplicateKeyUpdate([{ count: `count + VALUES(count)` }])
                .toParams({placeholder: '?'});

            return mysql.executeQuery(query.text, query.values)
                .then(result => {
                    resolve(true);
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });

            // let promises = Object.keys(wordCounts).map(key => {
            //     let query = sql.insert('main.word_count', 'word', 'count')
            //         .values([key, wordCounts[key]])
            //         .onDuplicateKeyUpdate([{ count: `count + VALUES(count)` }])
            //         .toParams({placeholder: '?'});
            //     return mysql.executeQuery(query.text, query.values)
            //         .then(result => {
            //             console.log('DB query completed successfully!');
            //             resolve(true);
            //         })
            //         .catch(error => {
            //             console.log(error);
            //             reject(error);
            //         });
            // });

            // return Promise.all(promises)
            //     .then(result => {
            //         resolve(true);
            //     })
            //     .catch(error => {
            //         console.log(error);
            //         reject(error);
            //     });
        });
    }

    async resetCounts() {
        return new Promise((resolve, reject) => {
            let query = sql.delete(`main.word_count`).toParams({placeholder: '?'});

            return mysql.executeQuery(query.text, query.values)
                .then(result => {
                    resolve();
                })
                .catch(error => {
                    console.log(error);
                    reject(error);
                });
        });
    }
}

module.exports = new wordCountDal();