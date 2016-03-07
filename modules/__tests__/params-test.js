import expect from 'expect'
import { params } from '../index'

const echo = (url, options) =>
  Promise.resolve({ url, options })

describe('params', () => {
  describe('when used with a GET request', () => {
    it('appends the object to the query string of the request', () =>
      params({ hello: 'world' })(echo, '/').then(({ url }) =>
        expect(url).toEqual('/?hello=world')
      )
    )
  })

  describe('when used with a POST request', () => {
    it('sets the body of the request to a URL-encoded version of the object', () => {
      params({ hello: 'world' })(echo, '/', { method: 'POST' }).then(({ options }) =>
        expect(options.body).toEqual('hello=world')
      )
    })

    it('sets the Content-Type request header', () =>
      params({ hello: 'world' })(echo, '/', { method: 'POST' }).then(({ options }) =>
        expect(options.headers['Content-Type']).toEqual('application/x-www-form-urlencoded')
      )
    )
  })
})
