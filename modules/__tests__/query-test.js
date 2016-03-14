import expect from 'expect'
import { query } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('query', () => {
  describe('when the request does not already have a query string', () => {
    it('sets the query string of the request', () =>
      query({ hello: 'world' })(echo, '/').then(({ input }) =>
        expect(input).toEqual('/?hello=world')
      )
    )
  })

  describe('when the request already has a query string', () => {
    it('appends to the query string of the request', () =>
      query({ hello: 'world' })(echo, '/?search').then(({ input }) =>
        expect(input).toEqual('/?search&hello=world')
      )
    )
  })
})
