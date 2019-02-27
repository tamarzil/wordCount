'use strict';

const redisQueue = require('rsmq');
const rsmqWorker = require('rsmq-worker');
const config = require('../config');

const WORD_COUNT_QUEUE_NAME = config.queue.word_count_queue_name;
const REDIS_HOST = config.queue.host;
const REDIS_PORT = config.queue.port;

class wordCountQueue {

    initProducer() {
        return new Promise((resolve, reject) => {
            console.log('initializing queue...');

            this.rsmq = new redisQueue({
                host: REDIS_HOST,
                port: REDIS_PORT
            });

            let self = this;
            this.rsmq.listQueues(function (error, queues) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else if (queues.includes(WORD_COUNT_QUEUE_NAME)) {
                    console.log(`queue ${WORD_COUNT_QUEUE_NAME} already exists`);
                    resolve();
                } else {
                    return self.rsmq.createQueueAsync({qname: WORD_COUNT_QUEUE_NAME})
                        .then(response => {
                            console.log("wordCountQueue created");
                            resolve();
                        })
                        .catch(error => {
                            console.log(error);
                            reject(error);
                        });
                }
            });
        });
    }

    initConsumer(messageHandlerPromise) {
        this.consumer = new rsmqWorker(WORD_COUNT_QUEUE_NAME, {
            host: REDIS_HOST,
            port: REDIS_PORT,
            redisPrefix: 'rsmq'
        });

        this.consumer.on('message', function(msg, next, id) {
            messageHandlerPromise(msg, id)
                .then(result => {
                })
                .catch(error => {
                    console.log(error);
                });
            next();
        });

        this.consumer.on('error', function( err, msg ){
            console.log( 'ERROR', err, msg.id );
        });
        this.consumer.on('exceeded', function( msg ){
            console.log( 'EXCEEDED', msg.id );
        });
        this.consumer.on('timeout', function( msg ){
            console.log( 'TIMEOUT', msg.id, msg.rc );
        });

        this.consumer.start();
    }

    sendMessage(text) {
        return new Promise((resolve, reject) => {
            return this.rsmq.sendMessageAsync({qname: 'wordCountQueue', message: text})
                .then(response => {
                    resolve();
                })
                .catch(error => {
                    console.log(`Failed to send message: ${JSON.stringify(error)}`);
                    reject();
                });
        });
    }
}

module.exports = new wordCountQueue();
