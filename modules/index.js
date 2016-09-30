import { stringify } from 'query-string'
import byteLength from 'byte-length'

const global = (1, eval)('this')

const stringifyQuery = (query) =>
  (typeof query === 'string' ? query : stringify(query))

const stringifyJSON = (json) =>
  (typeof json === 'string' ? json : JSON.stringify(json))

const processResponse = (response, handlers) =>
  handlers.reduce(
    (promise, handler) => promise.then(handler),
    Promise.resolve(response)
  )

/**
 * Returns a new fetch function that knows how to execute
 * options.responseHandlers on the response.
 */
export const enableRecv = (fetch) =>
  (input, options = {}) =>
    fetch(input, options).then(response => {
      const responseHandlers = options.responseHandlers

      return (responseHandlers && responseHandlers.length)
        ? processResponse(response, responseHandlers)
        : response
    })

// Deprecated.
export const enhanceFetch = enableRecv

const emptyStack = (fetch, input, options) =>
  fetch(input, options)

/**
 * Creates a middleware "stack" function using all arguments.
 * A "stack" is essentially a bunch of middleware composed into
 * a single middleware function. Since all middleware share the
 * same signature, stacks may further be combined to create more
 * stacks with different characteristics.
 */
export const createStack = (...middleware) => {
  if (middleware.length === 0)
    return emptyStack

  return middleware.reduceRight(
    (inner, outer) =>
      (fetch, outerInput, outerOptions) =>
        outer(
          (innerInput, innerOptions) => inner(fetch, innerInput, innerOptions),
          outerInput,
          outerOptions
        )
  )
}

/**
 * Creates a fetch function using all arguments as middleware.
 * This function is a "stack" that uses the global fetch, so the
 * following two examples are equivalent:
 *
 *   const stack = createStack(middleware)
 *   stack(global.fetch, input, options)
 *
 *   const fetch = createFetch(middleware)
 *   fetch(input, options)
 *
 * Thus, createFetch essentially eliminates some boilerplate code
 * when you just want to use the global fetch function.
 */
export const createFetch = (...middleware) => {
  if (middleware.length === 0)
    return global.fetch

  const stack = createStack(...middleware)

  return enableRecv(
    (input, options = {}) =>
      stack(global.fetch, input, options)
  )
}

// Deprecated.
const mainFetch = enableRecv(global.fetch)
export { mainFetch as fetch }

/**
 * Sets a property name and value in the options object.
 */
export const init = (propertyName, value) =>
  (fetch, input, options = {}) => {
    options[propertyName] = value
    return fetch(input, options)
  }

/**
 * Sets the request method.
 */
export const method = (verb) =>
  init('method', verb)

const setHeader = (options, name, value) => {
  (options.headers || (options.headers = {}))[name] = value
}

/**
 * Adds a header to the request.
 */
export const header = (name, value) =>
  (fetch, input, options = {}) => {
    setHeader(options, name, value)
    return fetch(input, options)
  }

/**
 * Adds an Authorization header to the request.
 */
export const auth = (value) =>
  header('Authorization', value)

/**
 * Adds an Accept header to the request.
 */
export const accept = (value) =>
  header('Accept', value)

/**
 * Adds the given string at the front of the request URL.
 */
export const base = (baseURL) =>
  (fetch, input, options) =>
    fetch(baseURL + (input || ''), options)

/**
 * Adds the given object to the query string in the request.
 */
export const query = (object) => {
  const queryString = stringifyQuery(object)

  return (fetch, input, options) =>
    fetch(input + (input.indexOf('?') === -1 ? '?' : '&') + queryString, options)
}

/**
 * Adds the given content to the request.
 */
export const body = (content, contentType) =>
  (fetch, input, options = {}) => {
    options.body = content

    if (content.length != null)
      setHeader(options, 'Content-Length', byteLength(content))

    if (contentType)
      setHeader(options, 'Content-Type', contentType)

    return fetch(input, options)
  }

/**
 * Adds an application/json payload to the request.
 */
export const json = (object) =>
  body(stringifyJSON(object), 'application/json')

/**
 * Adds the given object to the query string of GET/HEAD requests
 * and as a application/x-www-form-urlencoded payload on all others.
 */
export const params = (object) => {
  const queryString = stringifyQuery(object)

  return (fetch, input, options = {}) => {
    const verb = (options.method || 'GET').toUpperCase()
    const middleware = (verb === 'GET' || verb === 'HEAD')
      ? query(queryString)
      : body(queryString, 'application/x-www-form-urlencoded')

    return middleware(fetch, input, options)
  }
}

/**
 * A helper for creating middleware that handles a successful response.
 */
export const recv = (handler) =>
  (fetch, input, options = {}) => {
    (options.responseHandlers || (options.responseHandlers = [])).push(handler)
    return fetch(input, options)
  }

// Deprecated.
export const handleResponse = recv
export const onResponse = recv

/**
 * Reads the response stream to completion, parses its content
 * using the given parser, and adds the result to response.body.
 */
export const parse = (parser, as = 'body') =>
  recv(response => {
    if (as in response)
      return response[as]

    return response[parser]().then(body => {
      response[as] = body
      return response
    }, error => {
      throw new Error(`parse('${parser}') error: ${error.stack}`)
    })
  })

// Deprecated.
export const parseJSON = (propertyName = 'jsonData') =>
  parse('json', propertyName)

// Deprecated.
export const parseText = (propertyName = 'textString') =>
  parse('text', propertyName)

/**
 * Adds the requestURL and requestOptions properties to the
 * response/error. Mainly useful in testing/debugging.
 */
export const requestInfo = () =>
  (fetch, input, options) =>
    fetch(input, options)
      .then(response => {
        response.requestInput = input
        response.requestOptions = options
        return response
      }, (error = new Error) => {
        error.requestInput = input
        error.requestOptions = options
        throw error
      })
