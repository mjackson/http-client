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

http-client simplifies the process of creating flexible HTTP clients that work in both node and the browser. You create your own `fetch` function using the `createFetch` method, optionally passing [middleware](#middleware) as arguments.

```js
import { createFetch, base, accept, parseJSON } from 'http-client'

const fetch = createFetch(
  base('https://api.stripe.com/v1'),  // Prefix all request URLs
  accept('application/json'),         // Set "Accept: application/json" in the request headers
  parseJSON()                         // Read the response as JSON and put it in response.jsonData
)

fetch('/customers/5').then(response => {
  console.log(response.jsonData)
})
```

## Middleware

http-client provides a variety of middleware that may be used to extend the functionality of the client. Out of the box, http-client ships with the following middleware:

#### `method(verb)`

Sets the request method.

```js
import { createFetch, method } from 'http-client'

const fetch = createFetch(
  method('POST')
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

```js
import { createFetch, auth } from 'http-client'

const fetch = createFetch(
  auth('Bearer ' + oauth2Token)
)
```

#### `accept(contentType)`

Adds an `Accept` header to the request.

```js
import { createFetch, accept } from 'http-client'

const fetch = createFetch(
  accept('application/json')
)
```

#### `base(baseURL)`

Adds the given `baseURL` to the beginning of the request URL.

```js
import { createFetch, base } from 'http-client'

const fetch = createFetch(
  base('https://api.stripe.com/v1')
)

fetch('/customers/5') // GET https://api.stripe.com/v1/customers/5
```

#### `query(object)`

Adds the data in the given object (or string) to the query string of the request URL.

#### `body(content, contentType)`

Sets the given `content` string as the request body.

```js
import { createFetch, body } from 'http-client'

const fetch = createFetch(
  body(JSON.stringify(data), 'application/json')
)
```

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

#### `parseText()`

Reads the response body as text and puts it on `response.textString`.

```js
import { createFetch, parseText } from 'http-client'

const fetch = createFetch(
  parseText()
)

fetch(url).then(response => {
  console.log(response.textString)
})
```

#### `parseJSON()`

Reads the response body as JSON and puts it on `response.jsonData`.

```js
import { createFetch, parseJSON } from 'http-client'

const fetch = createFetch(
  parseJSON()
)

fetch(url).then(response => {
  console.log(response.jsonData)
})
```

#### `requestInfo()`

Adds `requestURL` and `requestOptions` properties to the response (or error) object so you can inspect them. Mainly useful for testing/debugging (should be put last in the list of middleware).

```js
import { createFetch, requestInfo } from 'http-client'

const fetch = createFetch(
  // ...
  requestInfo()
)

fetch(url).then(response => {
  console.log(response.requestURL, response.requestOptions)
})
```

## Stacks

Middleware may be combined together into re-usable middleware "stacks" using `createStack`. A stack is itself a middleware that is composed of one or more other pieces of middleware.

This is useful when you have a common set of functionality that you'd like to share between several different `fetch` methods, e.g.:

```js
import { createStack, createFetch, header, base, parseJSON } from 'http-client'

const commonStack = createStack(
  header('X-Auth-Key', key),
  header('X-Auth-Email', email),
  base('https://api.cloudflare.com/client/v4'),
  parseJSON()
)

// This fetch function can be used standalone...
const fetch = createFetch(commonStack)

// ...or we can add further middleware to create another fetch function!
const fetchSinceBeginningOf2015 = createFetch(
  commonStack,
  query({ since: '2015-01-01T00:00:00Z' })
)
```
