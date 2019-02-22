'use strict';

const dal = require('./dal/wordCountDal');
const textUtils = require('./utils/text-utils');
const inputManager = require('./inputManager');

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
}

module.exports = new wordCounter();
