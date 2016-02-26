# http-client

[http-client](https://github.com/mjackson/http-client) is a composable HTTP client that uses JavaScript's [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API). This library has the following goals:

  - Preserve the full capabilities of the fetch API
  - Provide an extendable  middleware API
  - Use the same API on both client and server

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save mjackson/http-client

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using an ES6 transpiler, like babel
import { createFetch } from 'http-client'

// not using an ES6 transpiler
var createFetch = require('http-client').createFetch
```

## Usage

http-client simplifies the process of creating flexible HTTP clients that work in both node and the browser. You create your own `fetch` function using the `createFetch` method, optionally passing middleware as arguments.

```js
import { createFetch, query, requestInfo } from 'http-client'

const fetch = createFetch(
  query({ hello: 'world' }),  // Append a query string to the request URL
  requestInfo()               // Add requestURL & requestOptions properties to the response
)

fetch('http://www.google.com/').then(response => {
  console.log(response.requestURL) // http://www.google.com/?hello=world
})
```

http-client provides a variety of middleware that may be used to extend the functionality of the client. Out of the box, http-client ships with the following middleware:

#### `method(verb)`

Sets the request method.

```js
import { createFetch, method } from 'http-client'

const fetch = createFetch(
  method('GET')
)
```

#### `header(name, value)`

Adds a header to the request.

```js
import { createFetch, header } from 'http-client'

const fetch = createFetch(
  header('Content-Type', 'application/json')
)
```

#### `auth(value)`

Adds an `Authorization` header to the request.

#### `bearerToken(token)`

Adds an OAuth2 bearer token to the request in the `Authorization` header.

#### `accept(contentType)`

Adds an `Accept` header to the request.

```js
import { createFetch, accept } from 'http-client'

const fetch = createFetch(
  accept('application/json')
)
```

#### `acceptText()`

Shorthand for `accept('text/plain')`.

#### `acceptJSON()`

Shorthand for `accept('application/json')`.

#### `acceptHTML()`

Shorthand for `accept('text/html')`.

#### `query(object)`

Adds the data in the given object (or string) to the query string of the request URL.

#### `content(body, type)`

Adds the given body to the request.

#### `json(object)`

Adds the data in the given object as JSON to the request body.

#### `params(object)`

Adds the given object to the query string of `GET`/`HEAD` requests and as a `x-www-form-urlencoded` payload on all others.

```js
import { createFetch, method, params } from 'http-client'

// Create a client that will append hello=world to the URL in the query string
const fetch = createFetch(
  params({ hello: 'world' })
)

// Create a client that will send hello=world as POST data
const fetch = createFetch(
  method('POST'),
  params({ hello: 'world' })
)
```

#### `getText(propertyName='textString')`

Reads the response body as text and puts it on `response.textString`.

#### `getJSON(propertyName='jsonString')`

Reads the response body as JSON and puts it on `response.jsonString`.

```js
import { createFetch, getJSON } from 'http-client'

const fetch = createFetch(
  getJSON()
)

fetch(url).then(response => {
  console.log(response.jsonString)
})
```

#### `requestInfo()`

Adds `requestURL` and `requestOptions` properties to the response (or error) object so you can inspect them. Mainly useful for testing/debugging.

```js
import { createFetch, requestInfo } from 'http-client'

const fetch = createFetch(
  requestInfo()
)

fetch(url).then(response => {
  console.log(response.requestURL, response.requestOptions)
})
```
