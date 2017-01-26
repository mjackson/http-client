import expect from 'expect'
import { params } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('params', () => {
  describe('when used with a GET request', () => {
    it('appends the object to the query string of the request', () =>
      params({ hello: 'world' })(echo, '/').then(({ input }) =>
        expect(input).toEqual('/?hello=world')
      )
    )
  })

  describe('when used with a POST request', () => {
    it('sets the body of the request to a URL-encoded version of the object', () => {
      params({ hello: 'world' })(echo, '/', { method: 'POST' }).then(({ options }) =>
        expect(options.decodedBody).toEqual('hello=world')
      )
    })

    it('sets the Content-Type request header', () =>
      params({ hello: 'world' })(echo, '/', { method: 'POST' }).then(({ options }) =>
        expect(options.headers['Content-Type']).toEqual('application/x-www-form-urlencoded')
      )
    )
  })
})
