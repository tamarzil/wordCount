'use strict';

const config = {
    'server': {
        'port': 8080
    },
    'mysql': {
        'host': 'lemon-mysql',
        'user': 'root',
        'password': 'pass1234',
        'pool_max_connections': 10
    },
    'queue': {
        'host': 'lemon-redis',
        'port': 6379,
        'word_count_queue_name': 'wordCountQueue'
    },
    'misc': {
        'chunk_length': 10000
    }
};

module.exports = config;