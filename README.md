# http-client

[http-client](https://github.com/mjackson/http-client) is a composable HTTP client that uses JavaScript's [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).

## Goals

  - Preserve the full capabilities of the fetch API
  - Composable middleware API
  - Use the same API on both client and server

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

  - `header(name, value)`
  - `auth(value)`
  - `bearerToken(token)`
  - `accept(contentType)`
  - `acceptText()`
  - `acceptJSON()`
  - `acceptHTML()`
  - `query(object)`
  - `content(body, type)`
  - `json(object)`
  - `params(object)`
  - `getText(propertyName='textString')`
  - `getJSON(propertyName='jsonString')`
  - `requestInfo()`
