import expect from 'expect'
import { query } from '../index'

const echo = (url, options) =>
  Promise.resolve({ url, options })

describe('query', () => {
  describe('when the request does not already have a query string', () => {
    it('sets the query string of the request', () =>
      query({ hello: 'world' })(echo, '/').then(({ url }) =>
        expect(url).toEqual('/?hello=world')
      )
    )
  })

  describe('when the request already has a query string', () => {
    it('appends to the query string of the request', () =>
      query({ hello: 'world' })(echo, '/?search').then(({ url }) =>
        expect(url).toEqual('/?search&hello=world')
      )
    )
  })
})
