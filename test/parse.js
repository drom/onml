'use strict';

const chai = require('chai');
const lib = require('../');

describe('parse', () => {
  it('basic', done => {
    const val = ['text', {a: '55'}, 'so me'];
    const str = '<text a="55">so me</text>';
    chai.expect(lib.parse(str)).to.deep.equal(val);
    done();
  });
  it('cdata', done => {
    const val = ['style', {type: 'text/css'}, '<![CDATA[rect {fill: red } ]]>'];
    const str = '<style type="text/css"><![CDATA[rect {fill: red } ]]></style>';
    chai.expect(lib.parse(str)).to.deep.equal(val);
    done();
  });
});

/* eslint-env mocha */
