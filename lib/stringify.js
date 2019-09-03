'use strict';

function isObject (o) {
    return o && Object.prototype.toString.call(o) === '[object Object]';
}

function indenter (indentation) {
    var space = ' '.repeat(indentation);
    return function (txt) {
        var arr, res = [];

        if (typeof txt !== 'string') {
            return txt;
        }

        arr = txt.split('\n');

        if (arr.length === 1) {
            return space + txt;
        }

        arr.forEach(function (e) {
            if (e.trim() === '') {
                res.push(e);
                return;
            }
            res.push(space + e);
        });

        return res.join('\n');
    };
}

function clean (txt) {
    var arr = txt.split('\n');
    var res = [];
    arr.forEach(function (e) {
        if (e.trim() === '') {
            return;
        }
        res.push(e);
    });
    return res.join('\n');
}

function stringify (a, indentation) {

    var cr = '';
    var indent = function (t) { return t; };

    if (indentation > 0) {
        cr = '\n';
        indent = indenter(indentation);
    }

    function rec (a) {
        var res, body, isEmpty, isFlat;

        body = '';
        isFlat = true;
        isEmpty = a.some(function (e, i, arr) {
            if (i === 0) {
                res = '<' + e;
                if (arr.length === 1) {
                    return true;
                }
                return;
            }

            if (i === 1) {
                if (isObject(e)) {
                    Object.keys(e).forEach(function (key) {
                        res += ' ' + key + '="' + e[key] + '"';
                    });
                    if (arr.length === 2) {
                        return true;
                    }
                    res += '>';
                    return;
                } else {
                    res += '>';
                }
            }

            switch (typeof e) {
            case 'string':
            case 'number':
            case 'boolean':
            case 'undefined':
                body += e + cr;
                return;
            }

            isFlat = false;
            body += rec(e);
        });

        if (isEmpty) {
            return res + '/>' + cr; // short form
        } else {
            if (isFlat) {
                return res + clean(body) + '</' + a[0] + '>' + cr;
            } else {
                return res + cr + indent(body) + '</' + a[0] + '>' + cr;
            }
        }
    }

    return rec(a);
}

module.exports = stringify;
