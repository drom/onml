# ONML

[![NPM version](https://img.shields.io/npm/v/onml.svg)](https://www.npmjs.org/package/onml)
[![Actions Status](https://github.com/drom/onml/workflows/Tests/badge.svg)](https://github.com/drom/onml/actions)

[jsonml.org](http://www.jsonml.org/) compatible tool set.

## Use
### Node.js

```
npm i onml --save
```

```js
var onml = require('onml');
```

### Browser
Via [unpkg](https://unpkg.com/onml):

```html
<script src="https://unpkg.com/onml"></script>
<script>
  // library exposed as the global `onml`
  var str = onml.stringify(['text', {a: 55}, 'so me']);
</script>
```

## API
### onml.parse() --- onml.p()
The `onml.parse(data, [config])` method parses a XML/HTML/SVG string and returns a JavaScript value.

```js
var obj = onml.parse('<text a="5">so me</text>');
console.log(obj);
-->
["text", {a: "5"}, "so me"]
```

The optional `config` object accepts:
  * `strict` (default `true`) -- parse in [sax](https://www.npmjs.com/package/sax) strict mode; set `false` for lenient HTML.
  * `trim` (default `true`) -- drop whitespace-only text nodes; set `false` to keep them.

```js
onml.parse('<p>  keep  </p>', {trim: false});
-->
["p", {}, "  keep  "]
```

### onml.stringify() --- onml.s()
The `onml.stringify(array, [indentation])` method converts a JavaScript value to a XML/HTML/SVG string.

```js
var str = onml.stringify(['text', {a: 55}, 'so me'], 2);
console.log(str);
-->
<text a="55">
  so me
</text>
```

### onml.traverse() --- onml.t()
JSONML object traversal tool. See [test/traverse.js](test/traverse.js) for more details.

```js
onml.traverse(obj, {
    enter: function (node, parent) {
        ...
    },
    leave: function (node, parent) {
        ...
    }
});
```
Inside `enter` and `leave` functions:

`node` and `parent` objects have the following attributes:
  * `.name` -- tag name
  * `.attr` -- attributes object
  * `.full` -- full node array

`this` will hold additional methods:
  * `this.name(string)` -- to change the node tag
  * `this.skip()` -- to skip subtree based on the current node
  * `this.remove()` -- to remove current node
  * `this.replace(array)` -- to replace current node

```js
// count divs on enter
var count = 0;
onml.traverse(
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
    ],
    {
        enter: function (node) {
            if (node.name === 'div') {
                count++;
            }
        }
    }
);
console.log(count);
-->
6
```

### onml.renderer()
Browser helper. `onml.renderer(target)` takes a DOM element or an element `id` string and returns a render function. Calling that function with a JSONML value stringifies it and writes the result into the target's `innerHTML`.

```js
var render = onml.renderer('root'); // or onml.renderer(document.body)
render(['h1', 'Hello']);            // <h1>Hello</h1> injected into #root
```

### onml.tt()
SVG attribute helper. `onml.tt(x, y, [obj])` returns an attributes object with a `transform: translate(x, y)` and merges any extra attributes from `obj`. Omit `y` for a single-axis translate; when both `x` and `y` are falsy no transform is added.

```js
onml.tt(10, 20, {fill: 'red'});
-->
{transform: "translate(10,20)", fill: "red"}
```

### onml.gen.svg()
Generates a root `svg` JSONML node with the standard namespaces and a `viewBox`. `onml.gen.svg(width, height)`.

```js
onml.gen.svg(100, 50);
-->
["svg", {
  xmlns: "http://www.w3.org/2000/svg",
  "xmlns:xlink": "http://www.w3.org/1999/xlink",
  width: 100, height: 50,
  viewBox: "0 0 100 50"
}]
```

## Testing
`npm test`

## License
MIT [LICENSE](https://github.com/drom/onml/blob/master/LICENSE).
