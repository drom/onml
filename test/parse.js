'use strict';

var expect = require('chai').expect,
    lib = require('../lib');

describe('parse', function () {
    it('basic', function (done) {
        var val = ['text', {a: '55'}, 'so me'];
        var str = '<text a="55">so me</text>';
        expect(lib.parse(str)).to.deep.equal(val);
        done();
    });
});

/* eslint-env mocha */
