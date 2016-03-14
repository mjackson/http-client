import { stringify } from 'query-string'

const globalFetch = typeof fetch !== 'function'
  ? (typeof window !== 'object' && require('node-fetch'))
  : fetch

const resolvePromise = (promise, callback) =>
  promise.then(value => callback(null, value), callback)

const enhanceFetch = (fetch) =>
  (input, options, callback) => {
    if (typeof options === 'function') {
      callback = options
      options = undefined
    } else if (typeof input === 'function') {
      callback = input
      input = undefined
    }

    const promise = fetch(input, options)

    return (typeof callback === 'function')
      ? resolvePromise(promise, callback)
      : promise
  }

const enhancedFetch = enhanceFetch(globalFetch)

const stringifyJSON = (json) =>
  (typeof json === 'string' ? json : JSON.stringify(json))

const stringifyQuery = (query) =>
  (typeof query === 'string' ? query : stringify(query))

const emptyStack = (fetch, input, options) =>
  fetch(input, options)

export { enhancedFetch as fetch }

/**
 * Creates a middleware "stack" function using all arguments.
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
 */
export const createFetch = (...middleware) => {
  if (middleware.length === 0)
    return enhancedFetch

  const stack = createStack(...middleware)

  return enhanceFetch(
    (input, options) =>
      stack(globalFetch, input, options)
  )
}

const setHeader = (options, name, value) => {
  (options.headers || (options.headers = {}))[name] = value
}

/**
 * Sets the request method.
 */
export const method = (verb) =>
  (fetch, input, options = {}) => {
    options.method = verb
    return fetch(input, options)
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
export const accept = (contentType) =>
  header('Accept', contentType)

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
      setHeader(options, 'Content-Length', content.length)

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

const enhanceResponse = (callback) =>
  (fetch, input, options) =>
    fetch(input, options).then(callback)

/**
 * Adds the text of the response to response[propertyName].
 */
export const parseText = (propertyName = 'textString') =>
  enhanceResponse(response =>
    response.text().then(value => {
      response[propertyName] = value
      return response
    })
  )

/**
 * Adds the JSON of the response to response[propertyName].
 */
export const parseJSON = (propertyName = 'jsonData') =>
  enhanceResponse(response =>
    response.json()
      .then(value => {
        response[propertyName] = value
        return response
      }, error => {
        throw new Error(`Error parsing JSON: ${error.stack}`)
      })
  )

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
