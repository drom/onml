'use strict';

var expect = require('chai').expect,
    lib = require('../lib');

describe('stringify', function () {
    it('basic', function (done) {
        var val = ['text', {a: '55'}, ['tspan', 'so me']];
        var str = '<text a="55">\n  <tspan>\n    so me\n  </tspan>\n</text>\n';
        expect(lib.stringify(val)).to.be.equal(str);
        done();
    });
});

/* eslint-env mocha */
