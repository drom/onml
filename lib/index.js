'use strict';

var parse = require('./parse'),
    stringify = require('./stringify'),
    traverse = require('./traverse');

module.exports = {
    parse: parse,
    stringify: stringify,
    traverse: traverse,
    p: parse,
    s: stringify,
    t: traverse
};
