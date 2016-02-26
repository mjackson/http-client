import fetch from 'node-fetch'
import { stringify as stringifyQuery } from 'query-string'
import invariant from 'invariant'

function fetchAndEnhanceResponse(url, options) {
  return fetch(url, options)
    .then(response => {
      response.requestURL = url
      response.requestOptions = options
      return response
    }, error => {
      error = error || new Error
      error.requestURL = url
      error.requestOptions = options
      throw error
    })
}

export function createRequest() {
  const middleware = Array.prototype.slice.call(arguments, 0)

  return middleware.reduce((fetch, middleware) => {
    return function (url, options) {
      return middleware(fetch, url, options)
    }
  }, fetchAndEnhanceResponse)
}

function setHeader(options, name, value) {
  const headers = options.headers || (options.headers = {})
  headers[name] = value
}

export function useHeader(name, value) {
  return function (fetch, url, options={}) {
    setHeader(options, name, value)
    return fetch(url, options)
  }
}

export function useAuth(auth) {
  return useHeader('Authorization', auth)
}

export function useBearerToken(token) {
  return useAuth('Bearer ' + token)
}

export function useContent(content, type) {
  invariant(
    typeof content === 'string',
    'useContent needs a content string'
  )

  return function (fetch, url, options={}) {
    options.body = content

    setHeader(options, 'Content-Type', type)
    setHeader(options, 'Content-Length', content.length)

    return fetch(url, options)
  }
}

export function useParams(params) {
  return useContent(
    typeof params === 'string' ? params : stringifyQuery(params),
    'x-www-form-urlencoded'
  )
}

export function useJSON(object) {
  return useContent(
    typeof object === 'string' ? object : JSON.stringify(object),
    'application/json'
  )
}

export function useQuery(query) {
  const queryString = stringifyQuery(query)

  return function (fetch, url, options) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + queryString
    return fetch(url, options)
  }
}

function enhanceResponse(callback) {
  return function (fetch, url, options) {
    return fetch(url, options).then(callback)
  }
}

export function getText(propertyName='textString') {
  return enhanceResponse(response => {
    return response.text().then(text => {
      response[propertyName] = text
      return response
    })
  })
}

export function getJSON(propertyName='jsonString') {
  return enhanceResponse(response => {
    return response.json().then(json => {
      response[propertyName] = json
      return response
    })
  })
}
