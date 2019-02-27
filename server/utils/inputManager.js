'use strict';

const fs = require('fs');
const request = require('request');
const readableStream = require('stream').Readable;


class inputManager {

    createReadStreamFromFile(path) {
        return fs.createReadStream(path);
    }

    createReadStreamFromUrl(url) {
        return request(url);
    }

    createReadStreamFromText(text) {
        let stream = new readableStream();
        stream.push(text);
        stream.push(null);
        return stream;
    }
}

module.exports = new inputManager();