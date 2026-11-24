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
  it('loc: default off', () => {
    const doc = lib.parse('<a/>');
    chai.expect(lib.loc(doc)).to.equal(undefined);
  });
  it('loc: true + onml.loc()', () => {
    const str = '<?xml version="1.0"?>\n<a\n  x="1">\n  <b/>\n</a>';
    const doc = lib.parse(str, {loc: true});
    chai.expect(doc).to.deep.equal(['a', {x: '1'}, ['b', {}]]);
    const aloc = lib.loc(doc);
    const bloc = lib.loc(doc[2]);
    chai.expect(aloc).to.deep.equal({
      start: {line: 2, column: 1, offset: 22},
      end: {line: 5, column: 5, offset: 45}
    });
    chai.expect(bloc).to.deep.equal({
      start: {line: 4, column: 3, offset: 36},
      end: {line: 4, column: 7, offset: 40}
    });
    chai.expect(str.slice(aloc.start.offset, aloc.end.offset)).to.equal('<a\n  x="1">\n  <b/>\n</a>');
    chai.expect(str.slice(bloc.start.offset, bloc.end.offset)).to.equal('<b/>');
  });
  it('loc: custom WeakMap', () => {
    const str = '<a\r\n  x="1"><b /></a>';
    const loc = new WeakMap();
    const doc = lib.parse(str, {loc});
    chai.expect(lib.loc(doc)).to.equal(undefined);
    const aloc = loc.get(doc);
    const bloc = loc.get(doc[2]);
    chai.expect(aloc).to.deep.equal({
      start: {line: 1, column: 1, offset: 0},
      end: {line: 2, column: 18, offset: 21}
    });
    chai.expect(bloc).to.deep.equal({
      start: {line: 2, column: 9, offset: 12},
      end: {line: 2, column: 14, offset: 17}
    });
    chai.expect(str.slice(bloc.start.offset, bloc.end.offset)).to.equal('<b />');
  });
});

/* eslint-env mocha */
