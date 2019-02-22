'use strict';


class textUtils {

    removePunctuation(text) {
        return text.replace(/[^\w\s]|_/g, "");
    }

    extractWordsFromText(text) {
        return this.removePunctuation(text)
            .split(/\s+/)
            .filter(word => !word.match(/^-?[0-9]+$/g))
            .map(word => word.toLowerCase());
    }
}

module.exports = new textUtils();