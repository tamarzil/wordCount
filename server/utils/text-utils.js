'use strict';


class textUtils {

    removePunctuation(text) {
        return text.replace(/[^\w\s]|_/g, "");
    }

    extractWordsFromText(text) {
        return this.removePunctuation(text)
            .split(/\s+/)
            .filter(word => !word.match(/^-?[0-9][0-9,\.]+$/));
    }
}

module.exports = new textUtils();