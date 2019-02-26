'use strict';

let fs = require('fs');
let request = require('request');


class inputManager {

    createReadStreamFromFile(path) {
        return fs.createReadStream(path);
    }

    createReadStreamFromUrl(url) {
        return request(url);
    }
}

module.exports = new inputManager();