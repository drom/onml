'use strict';

var expect = require('chai').expect,
    lib = require('../lib');

describe('stringify', function () {
    it('basic', function (done) {
        var val = ['text', {a: '55'}, 'so me'];
        var str = '<text a="55">\n  so me\n</text>\n';
        expect(lib.stringify(val)).to.be.equal(str);
        done();
    });
});

/* eslint-env mocha */
