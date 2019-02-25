'use strict';

const dal = require('./dal/wordCountDal');
const textUtils = require('./utils/text-utils');
const inputManager = require('./inputManager');

let stream = require('stream');
let readline = require('readline');

class wordCounter {

    async countWords(params) {
        return new Promise((resolve, reject) => {

            let type = params.type;
            let input = params.input;

            console.log('reading file...');
            return this._getProcessPromise(type, input)
                .then(text => {
                    console.log(`got text of length ${text.length}. Extracting words...`);
                    let words = textUtils.extractWordsFromText(text);
                    console.log(`got word array of length ${words.length}. Making object...`);

                    let wordCounts = words.reduce((wordCounts, word) => {
                        if (!wordCounts[word]) {
                            wordCounts[word] = 0;
                        }
                        wordCounts[word]++;
                        return wordCounts;
                    }, {});
                    console.log(`updating DB...`);
                    return dal.updateWordCounts(wordCounts)
                        .then(result => {
                            console.log(`finished updating DB...`);
                            resolve(result);
                        })
                        .catch(error => {
                            reject(error);
                        });
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    async countWordsStream(params) {

        let type = params.type;
        let input = params.input;

        if (type === 'text') {
            return this.countWords(params);
        }

        return new Promise((resolve, reject) => {

            console.log('reading file / url as stream...');

            let readStream = this._getReadStream(type, input);
            let rl = readline.createInterface(readStream, new stream());
            rl.on('line', async line => {
                console.log(`processing line ${line}...`);
                let words = textUtils.extractWordsFromText(line);
                console.log(`got ${words.length} words...`);
                let wordCounts = words.reduce((wordCounts, word) => {
                    if (!wordCounts[word]) {
                        wordCounts[word] = 0;
                    }
                    wordCounts[word]++;
                    return wordCounts;
                }, {});
                console.log(`got ${Object.keys(wordCounts).length} unique words...`);
                console.log(`updating DB...`);
                await dal.updateWordCounts(wordCounts);
                console.log(`finished updating DB...`);
            });

            readStream.on('end', () => {
                console.log('finished reading...');
                resolve(true);
            });

            readStream.on('error', error => {
                console.log(error);
                reject(error);
            });

            // return this._getProcessPromise(type, input)
            //     .then(text => {
            //         console.log(`got text of length ${text.length}. Extracting words...`);
            //         let words = textUtils.extractWordsFromText(text);
            //         let wordCounts = words.reduce((wordCounts, word) => {
            //             if (!wordCounts[word]) {
            //                 wordCounts[word] = 0;
            //             }
            //             wordCounts[word]++;
            //             return wordCounts;
            //         }, {});
            //         console.log(`updating DB...`);
            //         return dal.updateWordCounts(wordCounts)
            //             .then(result => {
            //                 console.log(`finished updating DB...`);
            //                 resolve(result);
            //             })
            //             .catch(error => {
            //                 reject(error);
            //             });
            //     })
            //     .catch(error => {
            //         reject(error);
            //     });
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

    _getProcessPromise(type, input) {
        switch(type) {
            case 'file':
                return inputManager.readFile(input);
            case 'url':
                return inputManager.readFromUrl(input);
            case 'text':
            default:
                return Promise.resolve(input);
        }
    }

    _getReadStream(type, input) {
        switch(type) {
            case 'file':
                return inputManager.createReadStreamFromFile(input);
            case 'url':
                return inputManager.createReadStreamFromUrl(input);
        }
    }
}

module.exports = new wordCounter();
