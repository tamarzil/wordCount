'use strict';

let stream = require('stream');
let readline = require('readline');
const dal = require('./dal/wordCountDal');
const inputManager = require('./utils/inputManager');
let queue = require('./utils/queue');
const config = require('./config');

const CHUNK_LENGTH = config.misc.chunk_length;

class wordCounter {

    async countWords(params) {

        let type = params.type;
        let input = params.input;

        return new Promise((resolve, reject) => {
            let chunk = '';
            let readStream = this._getReadStream(type, input);
            let rl = readline.createInterface(readStream, new stream());
            rl.on('line', async line => {
                chunk += line;
                chunk += ' ';
                if (chunk.length > CHUNK_LENGTH) {
                    let text = chunk;
                    chunk = '';
                    this.enqueueText(text).then();
                }
            });

            readStream.on('end', () => {
                return this.enqueueText(chunk).then(() => {
                    console.log('finished reading...');
                    resolve(true);
                });
            });

            readStream.on('error', error => {
                console.log(error);
                reject(error);
            });
        });
    }

    enqueueText(text) {
        return new Promise((resolve, reject) => {
            return queue.sendMessage(text)
                .then(() => {
                    resolve(true);
                }).catch(error => {
                    reject(error);
                });
        });
    }

    async getWordCount(params) {
        let word = params.word;
        let count = await dal.getWordCount(word);
        return { result: count };
    }

    async resetCounts() {
        return new Promise((resolve, reject) => {
            return dal.resetCounts()
                .then(() => {
                    resolve(true);
                }).catch(error => {
                    reject(error);
                });
        });
    }

    _getReadStream(type, input) {
        switch(type) {
            case 'file':
                return inputManager.createReadStreamFromFile(input);
            case 'url':
                return inputManager.createReadStreamFromUrl(input);
            case 'text':
            default:
                return inputManager.createReadStreamFromText(input);
        }
    }
}

module.exports = new wordCounter();
