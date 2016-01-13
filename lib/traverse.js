'use strict';

function traverse(origin, callbacks) {
    var empty = function () {};
    var enter = empty;
    var leave = empty;

    function skipFn() {
        this._skip = true;
    }

    function removeFn() {
        this._remove = true;
    }

    function nameFn(name) {
        this._name = name;
    }

    function replaceFn(node) {
        this._replace = node;
    }

    function rec(tree, parent) {
        var type,
            node = { attr: {}, full: tree },
            cxt = {
                name: nameFn,
                skip: skipFn,
                // break: breakFn,
                remove: removeFn,
                replace: replaceFn,

                _name: undefined,
                _skip: false,
                // _break: false,
                _remove: false,
                _replace: undefined
            },
            e1IsNotAnObject = true,
            index,
            ilen,
            returnRes;

        if (tree === undefined) return;
        if (tree === null) return;
        if (tree === true) return;
        if (tree === false) return;

        type = Object.prototype.toString.call(tree);

        switch (type) {
        case '[object String]':
        case '[object Number]':
            return;

        case '[object Array]':
            tree.some(function (e, i) {
                if (i === 0) {
                    node.name = e;
                    return false;
                }
                if (i === 1) {
                    if (
                        Object.prototype.toString.call(e) === '[object Object]'
                    ) {
                        e1IsNotAnObject = false;
                        node.attr = e;
                    }
                    return true;
                }
            });

            enter.call(cxt, node, parent);
            if (cxt._name) {
                tree[0] = cxt._name;
            }

            if (cxt._replace) {
                return cxt._replace;
            } else
            if (cxt._remove) {
                return null;
            } else
            if (!cxt._skip) {

                index = 0;
                ilen = tree.length;
                while (index < ilen) {
                    if ((index > 1) || ((index === 1) && e1IsNotAnObject)) {
                        returnRes = rec(tree[index], node);
                        if (returnRes === null) {
                            tree.splice(index, 1);
                            ilen -= 1;
                            continue;
                        }
                        if (returnRes) {
                            tree[index] = returnRes;
                        }
                    }
                    index += 1;
                }

                leave.call(cxt, node, parent);
                if (cxt._name) {
                    tree[0] = cxt._name;
                }
                if (cxt._replace) {
                    return cxt._replace;
                } else
                if (cxt._remove) {
                    return null;
                }
            }
        }
    }

    if (callbacks) {
        if (callbacks.enter) {
            enter = callbacks.enter;
        }
        if (callbacks.leave) {
            leave = callbacks.leave;
        }
    }

    rec(origin, undefined);
}

module.exports = traverse;
