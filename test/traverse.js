'use strict';

var traverse = require('../lib/traverse'),
    expect = require('chai').expect;

describe('#traverse', function () {
    var data =
        ['b',
            ['div', {a: true},
                ['span',
                    'div',
                    ['div',
                        ['div', {},
                            ['div', {a: true}]
                        ]
                    ],
                    ['div', {},
                        ['div']
                    ]
                ]
            ]
        ];

    it('count divs on enter', function (done) {
        var count = 0;
        traverse(data, {
            enter: function (node) {
                if (node.name === 'div') {
                    count++;
                }
            }
        });
        expect(count).to.be.equal(6);
        done();
    });

    it('count divs on leave', function (done) {
        var count = 0;
        traverse(data, {
            leave: function (node) {
                if (node.name === 'div') {
                    count++;
                }
            }
        });
        expect(count).to.be.equal(6);
        done();
    });

    it('count divs with attr.a', function (done) {
        var count = 0;
        traverse(data, {
            enter: function (node) {
                if (
                    node.name === 'div' &&
                    node.attr.a
                ) {
                    count++;
                }
            }
        });
        expect(count).to.be.equal(2);
        done();
    });

    it('count divs in spans', function (done) {
        var count = 0;
        traverse(data, {
            enter: function (node, parent) {
                if (
                    parent &&
                    parent.name === 'span' &&
                    node.name === 'div'
                ) {
                    count++;
                }
            }
        });
        expect(count).to.be.equal(2);
        done();
    });

    it('count node.full.length === 1', function (done) {
        var count = 0;
        traverse(data, {
            enter: function (node) {
                if (node.full.length === 1) {
                    count++;
                }
            }
        });
        expect(count).to.be.equal(1);
        done();
    });

    it('gen XML skeleton', function (done) {
        var res = '';
        traverse(data, {
            enter: function (node) {
                res += '<' + node.name;
                Object.keys(node.attr).forEach(function (key) {
                    res += ' ' + key + '="' + node.attr[key] + '"';
                });
                res += '>';
            },
            leave: function (node) {
                res += '</' + node.name + '>';
            }
        });
        expect(res).to.be.equal('<b><div a="true"><span><div><div><div a="true"></div></div></div><div><div></div></div></span></div></b>');
        done();
    });

    it('count divs but skip spans', function (done) {
        var count = 0;
        traverse(data, {
            enter: function (node) {
                if (node.name === 'div') {
                    count++;
                } else
                if (node.name === 'span') {
                    this.skip();
                }
            }
        });
        expect(count).to.be.equal(1);
        done();
    });

    it('replace divs with briks', function (done) {
        traverse(data, {
            leave: function (node) {
                if (node.name === 'div') {
                    this.name('brick');
                }
            }
        });
        expect(data).to.deep.equal(
            ['b',
                ['brick', {a: true},
                    ['span',
                        'div',
                        ['brick',
                            ['brick', {},
                                ['brick', {a: true}]
                            ]
                        ],
                        ['brick', {},
                            ['brick']
                        ]
                    ]
                ]
            ]
        );
        done();
    });

    it('replace span with wood', function (done) {
        traverse(data, {
            leave: function (node) {
                if (node.name === 'span') {
                    this.replace(['wood']);
                }
            }
        });
        expect(data).to.deep.equal(
            ['b',
                ['brick', {a: true},
                    ['wood']
                ]
            ]
        );
        done();
    });

    it('remove wood', function (done) {
        traverse(data, {
            leave: function (node) {
                if (node.name === 'wood') {
                    this.remove();
                }
            }
        });
        expect(data).to.deep.equal(
            ['b',
                ['brick', {a: true}]
            ]
        );
        done();
    });

});

/* eslint-env mocha */
