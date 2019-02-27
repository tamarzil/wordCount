'use strict';

const wordCountQueue = require('./utils/queue');
const textUtils = require('./utils/text-utils');
const dal = require('./dal/wordCountDal');

function persistWords(text, id) {
    return new Promise((resolve, reject) => {
        console.log(`processing message ID: ${id}. Length: ${text.length}`);
        let words = textUtils.extractWordsFromText(text);
        let wordCounts = words.reduce((wordCounts, word) => {
            if (!wordCounts[word]) {
                wordCounts[word] = 0;
            }
            wordCounts[word]++;
            return wordCounts;
        }, {});
        return dal.updateWordCounts(wordCounts)
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}


wordCountQueue.initConsumer(persistWords);