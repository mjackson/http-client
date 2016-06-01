import { stringify } from 'query-string'

const stringifyQuery = (query) =>
  (typeof query === 'string' ? query : stringify(query))

const stringifyJSON = (json) =>
  (typeof json === 'string' ? json : JSON.stringify(json))

const enhanceResponse = (response, handlers) =>
  handlers.reduce(
    (promise, handler) => promise.then(handler),
    Promise.resolve(response)
  )

/**
 * Returns a new fetch function that knows how to execute
 * options.responseHandlers on the response.
 */
export const enhanceFetch = (fetch) =>
  (input, options = {}) =>
    fetch(input, options).then(response => {
      const responseHandlers = options.responseHandlers

      return (responseHandlers && responseHandlers.length)
        ? enhanceResponse(response, responseHandlers)
        : response
    })

const globalFetch = enhanceFetch(fetch)

export { globalFetch as fetch }

const emptyStack = (fetch, input, options) =>
  fetch(input, options)

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
    return globalFetch

  const stack = createStack(...middleware)

  return enhanceFetch(
    (input, options = {}) =>
      stack(options.fetch || fetch, input, options)
  )
}

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

/**
 * Check agains the final input and options to check if there's missing/misconfigured
 * properties.
 */
export const catchErrors = () => {
  function checkOptions(input, options) {
    [
      {
        name: 'data',
        validate: (input, options) => {
          const verb = (options.method || 'GET').toUpperCase()
          if (verb === 'GET' || verb === 'HEAD') {
            return
          }
          throw new Error(`Did you try to use 'body: ${JSON.stringify(options.data)}'?`)
        }
      },
      {
        name: 'body',
        validate: (input, options) => {
          const verb = (options.method || 'GET').toUpperCase()
          if (verb === 'GET' || verb === 'HEAD') {
            return
          }
          function isPojo(obj) {
            // Just copy for now.
            // https://github.com/nickb1080/is-pojo/blob/master/lib/index.js
            if (obj === null || typeof obj !== 'object') {
              return false
            }
            return Object.getPrototypeOf(obj) === Object.prototype
          }
          // https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch#Parameters
          if (isPojo(options.body)) {
            throw new Error(`Did you forgot to 'JSON.stringify(${JSON.stringify(options.body)})'`)
          }
        }
      }
    ].forEach(({ name, validate }) => {
      if (name in options) {
        validate(input, options)
      }
    })
  }


  return (fetch, input, options = {}) => {
    checkOptions(input, options)

    return fetch(input, options)
  }
}

/**
 * A helper for creating middleware that handles a successful response.
 */
export const onResponse = (handler) =>
  (fetch, input, options = {}) => {
    (options.responseHandlers || (options.responseHandlers = [])).push(handler)
    return fetch(input, options)
  }

// Deprecated.
export const handleResponse = onResponse

/**
 * Adds the text of the response to response[propertyName].
 */
export const parseText = (propertyName = 'textString') =>
  onResponse(response =>
    response.text().then(value => {
      response[propertyName] = value
      return response
    })
  )

/**
 * Adds the JSON of the response to response[propertyName].
 */
export const parseJSON = (propertyName = 'jsonData') =>
  onResponse(response =>
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
