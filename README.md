# dumbjson

* Dumb json lets you be dumb with json
* Anything before the first { or [ or " are treated as a comment and ignored
* Don't use { or [ or " in your comments or they will be parsed
* Add context to a json file without adding a key
 
## Usage

In your project directory

```npm install --save dumbjson```

Then in your script

```
const djson = require('dumbjson')

djson.write('file.json', { a : 'my object'}, 'My comment').then(res => {
  console.log('wrote my object to file.json')
})

```
or

```
djson.read('file.json').then(obj => {
  console.log(obj.a)
  //Prints "my object"
})
```

or

```
djson.read('file.json').then(comment => {
  console.log(comment)
  //Prints "My comment"
})
```

## Tests

All tests are written using [jest](https://jestjs.io/) and are defined in the package.json.

```npm test```

or

```jest```
