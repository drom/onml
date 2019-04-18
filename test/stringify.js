'use strict';

var expect = require('chai').expect,
    lib = require('../lib');

var dat = {
    t0: {
        src: ['text', {a: 55}, ['tspan', 'so me']],
        dst: '<text a="55">\n  <tspan>so me</tspan>\n</text>\n'
    },
    t1: {
        src: ['A',
            'aaa',
            ['B',
                ['C', true],
                777,
                ['D',
                    ['E']
                ]
            ]
        ],
        dst: '<A>\n  aaa\n  <B>\n    <C>true</C>\n    777\n    <D>\n      <E/>\n    </D>\n  </B>\n</A>\n'
    }
};

describe('stringify', function () {
    Object.keys(dat).forEach(function (name) {
        it(name, function (done) {
            var src = dat[name].src;
            var dst = dat[name].dst;
            expect(lib.stringify(src, 2)).to.be.equal(dst);
            done();
        });
    });
});

/* eslint-env mocha */
