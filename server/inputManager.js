'use strict';

let fs = require('fs');
let http = require('http');
let https = require('https');
let request = require('request');


class inputManager {

    readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', function(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data.toString());
                }
            });
        });
    }

    readFromUrl(url) {
        return new Promise((resolve, reject) => {
            let client = url.match(/^https/) ? https : http;
            client.get(url, (response) => {
                let data = '';

                response.on('data', function (chunk) {
                    data += chunk;
                });

                response.on('end', () => {
                    resolve(data);
                });

            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    createReadStreamFromFile(path) {
        return fs.createReadStream(path);
    }

    createReadStreamFromUrl(url) {
        return request(url);
    }
}

module.exports = new inputManager();