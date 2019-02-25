'use strict';


class textUtils {

    removePunctuation(text) {
        return text.replace(/[^\w\s]|_/g, "");
    }

    extractWordsFromText(text) {
        return this.removePunctuation(text)
            .split(/\s+/)
            .filter(word => !word.match(/^-?[0-9]+$/g))
            .map(word => word.toLowerCase())
            .sort();    // sorting to avoid deadlock on parallel DB updates
    }
}

module.exports = new textUtils();