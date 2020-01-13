'use strict';

var parser = require('sax').parser;

function parse(data, config) {
    var res = [],
        stack = [],
        pointer = res,
        trim = true,
        p;

    var strict = true;
    if (config && (config.strict !== undefined)) {
        strict = config.strict;
    }

    if (config !== undefined) {
        if (config.trim !== undefined) {
            trim = config.trim;
        }
    }

    p = parser(strict);

    p.ontext = function (e) {
        if ((trim === false) || (e.trim() !== '')) {
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

    p.oncdata = function (e) {
        if ((trim === false) || (e.trim() !== '')) {
            pointer.push('<![CDATA[' + e + ']]>');
        }
    };

    p.write(data).close();
    return res[0];
}

module.exports = parse;
