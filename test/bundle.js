'use strict';

const fs = require('fs');
const path = require('path');
const chai = require('chai');

const expect = chai.expect;

describe('bundle', () => {
  const bundlePath = path.resolve(__dirname, '../build/onml.js');
  let code;

  before(() => {
    expect(fs.existsSync(bundlePath), 'build/onml.js exists').to.be.true;
    code = fs.readFileSync(bundlePath, 'utf8');
  });

  it('AMD / Observable d3-require', () => {
    let factory;
    function define(name, deps, fn) {
      if (typeof name === 'function') {
        factory = name;
      } else if (typeof deps === 'function') {
        factory = deps;
      } else {
        factory = fn;
      }
    }
    define.amd = {};
    const runner = new Function('define', 'window', 'exports', 'module', code);
    runner(define, { define }, undefined, undefined);
    expect(factory).to.be.a('function');
    const mod = factory();
    expect(mod.parse).to.be.a('function');
    expect(mod.stringify).to.be.a('function');
  });

  it('CommonJS', () => {
    const m = { exports: {} };
    const runner = new Function('define', 'window', 'exports', 'module', code);
    runner(undefined, {}, m.exports, m);
    expect(m.exports.parse).to.be.a('function');
    expect(m.exports.stringify).to.be.a('function');
  });

  it('Global / script tag', () => {
    const win = {};
    const runner = new Function('define', 'window', 'self', 'exports', 'module', code);
    runner(undefined, win, win, undefined, undefined);
    expect(win.onml).to.be.an('object');
    expect(win.onml.parse).to.be.a('function');
    expect(win.onml.stringify).to.be.a('function');
  });
});

/* global describe, before, it */
/* eslint no-new-func: 0 */

