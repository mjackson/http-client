import { stringify } from 'query-string'

const globalFetch = typeof fetch !== 'function'
  ? (typeof window !== 'object' && require('node-fetch'))
  : fetch

const stringifyJSON = (json) =>
  (typeof json === 'string' ? json : JSON.stringify(json))

const stringifyQuery = (query) =>
  (typeof query === 'string' ? query : stringify(query))

const emptyStack = (fetch, url, options) =>
  fetch(url, options)

export { globalFetch as fetch }

/**
 * Creates a middleware "stack" function using all arguments.
 */
export const createStack = (...middleware) => {
  if (middleware.length === 0)
    return emptyStack

  return middleware.reduceRight(
    (inner, outer) =>
      (fetch, outerURL, outerOptions) =>
        outer(
          (innerURL, innerOptions) => inner(fetch, innerURL, innerOptions),
          outerURL,
          outerOptions
        )
  )
}

/**
 * Creates a fetch function using all arguments as middleware.
 */
export const createFetch = (...middleware) => {
  if (middleware.length === 0)
    return fetch

  const stack = createStack(...middleware)

  return (url, options) =>
    stack(globalFetch, url, options)
}

const setHeader = (options, name, value) =>
  (options.headers || (options.headers = {}))[name] = value

/**
 * Sets the request method.
 */
export const method = (verb) =>
  (fetch, url, options = {}) => {
    options.method = verb
    return fetch(url, options)
  }

/**
 * Adds a header to the request.
 */
export const header = (name, value) =>
  (fetch, url, options = {}) => {
    setHeader(options, name, value)
    return fetch(url, options)
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
  (fetch, url, options) =>
    fetch(baseURL + (url || ''), options)

/**
 * Adds the given object to the query string in the request.
 */
export const query = (object) => {
  const queryString = stringifyQuery(object)

  return (fetch, url, options) =>
    fetch(url + (url.indexOf('?') === -1 ? '?' : '&') + queryString, options)
}

/**
 * Adds the given content to the request.
 */
export const body = (content, contentType) =>
  (fetch, url, options = {}) => {
    options.body = content

    if (content.length != null)
      setHeader(options, 'Content-Length', content.length)

    if (contentType)
      setHeader(options, 'Content-Type', contentType)

    return fetch(url, options)
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

  return (fetch, url, options = {}) => {
    const verb = (options.method || 'GET').toUpperCase()
    const middleware = (verb === 'GET' || verb === 'HEAD')
      ? query(queryString)
      : body(queryString, 'application/x-www-form-urlencoded')

    return middleware(fetch, url, options)
  }
}

const enhanceResponse = (callback) =>
  (fetch, url, options) =>
    fetch(url, options).then(callback)

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
  (fetch, url, options) =>
    fetch(url, options)
      .then(response => {
        response.requestURL = url
        response.requestOptions = options
        return response
      }, (error = new Error) => {
        error.requestURL = url
        error.requestOptions = options
        throw error
      })
