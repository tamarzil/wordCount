'use strict';

const config = {
    'server': {
        'port': 3000
    },
    'mysql': {
        'host': 'localhost',
        'user': 'root',
        'password': 'pass1234',
        'pool_max_connections': 10
    },
    'queue': {
        'host': 'localhost',
        'port': 6379,
        'word_count_queue_name': 'wordCountQueue'
    },
    'misc': {
        'chunk_length': 10000
    }
};

module.exports = config;