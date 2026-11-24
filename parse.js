'use strict';

const parser = require('sax').parser;

const defaultLoc = new WeakMap();

const makeLocator = str => {
  const lines = [0];
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) === 10) {
      lines.push(i + 1);
    }
  }
  return offset => {
    let lo = 0;
    let hi = lines.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (lines[mid] <= offset) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    return {line: lo + 1, column: offset - lines[lo] + 1, offset};
  };
};

function loc(node) {
  return defaultLoc.get(node);
}

function parse(data, config) {
  const res = [];
  const stack = [];
  let pointer = res;
  let trim = true;

  let strict = true;
  if (config && (config.strict !== undefined)) {
    strict = config.strict;
  }

  let locMap;
  if (config !== undefined) {
    if (config.trim !== undefined) {
      trim = config.trim;
    }
    if (config.loc === true) {
      locMap = defaultLoc;
    } else if (config.loc && typeof config.loc.set === 'function') {
      locMap = config.loc;
    }
  }

  const posAt = locMap ? makeLocator(data) : undefined;
  const p = parser(strict);

  p.ontext = function (e) {
    if ((trim === false) || (e.trim() !== '')) {
      pointer.push(e);
    }
  };

  p.onopentag = function (e) {
    const leaf = [e.name, e.attributes];
    if (locMap) {
      locMap.set(leaf, {start: posAt(p.startTagPosition - 1)});
    }
    stack.push(pointer);
    pointer.push(leaf);
    pointer = leaf;
  };

  p.onclosetag = function () {
    if (locMap) {
      const entry = locMap.get(pointer);
      if (entry) {
        entry.end = posAt(p.position);
      }
    }
    pointer = stack.pop();
  };

  p.oncdata = function (e) {
    if ((trim === false) || (e.trim() !== '')) {
      pointer.push('<![CDATA[' + e + ']]>');
    }
  };

  p.write(data).close();
  return res[0];
}

parse.loc = loc;
module.exports = parse;
