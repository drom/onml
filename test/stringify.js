'use strict';

const chai = require('chai');
const lib = require('../lib');

const dat = {
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

describe('stringify', () => {
  Object.keys(dat).map(name => {
    it(name, done => {
      var src = dat[name].src;
      var dst = dat[name].dst;
      chai.expect(lib.stringify(src, 2)).to.be.equal(dst);
      done();
    });
  });
});

/* eslint-env mocha */
