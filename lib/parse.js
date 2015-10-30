'use strict';

var parser = require('sax').parser;

function parse(data) {
    var res = [],
        stack = [],
        pointer = res,
        p;

    p = parser(true);

    p.ontext = function (e) {
        if (e.trim() !== '') {
            pointer.push(e);
        }
    };

    p.onopentag = function (e) {
        var leaf;
        leaf = [e.name, e.attributes];
        stack.push(pointer);
        pointer.push(leaf);
        pointer = leaf;
    };

    p.onclosetag = function () {
        pointer = stack.pop();
    };

    p.write(data).close();
    return res[0];
}

module.exports = parse;
