'use strict';

const express = require('express');
const wordCounter = require('./wordCounter');
const bodyParser = require('body-parser');

const app = express();

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/wordcount', async (req, res, next) => {
    let params = req.body;

    try {
        let persisted = await wordCounter.countWords(params);
        res.sendStatus(persisted ? 202 : 500);  // TODO: handle better?
    } catch (error) {
        next(error);
    }
});

app.get('/wordstats', async (req, res, next) => {
    let params = req.query;

    try {
        let result = await wordCounter.getWordCount(params);
        res.send(result);
    } catch (error) {
        next(error);
    }
});

app.post('/resetCounts', async (req, res, next) => {
    try {
        let success = await wordCounter.resetCounts();
        res.sendStatus(success ? 202 : 500);  // TODO: handle better?
    } catch (error) {
        next(error);
    }
});

// 404
app.use(function(req, res, next) {
    return res.status(404).send({ message: 'Not found.' });
});

// 500
app.use(function(err, req, res, next) {
    console.log(err);
    return res.status(500).send({ error: err });
});

app.listen(port, () => {
    console.log(`listening on port ${port}...`);
});
