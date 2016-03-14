import expect from 'expect'
import { body } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('body', () => {
  it('sets the body of the request', () => {
    body('hello world')(echo).then(({ options }) =>
      expect(options.body).toEqual('hello world')
    )
  })

  describe('when the content has a length property', () => {
    it('sets the Content-Length request header', () =>
      body('hello world')(echo).then(({ options }) =>
        expect(options.headers['Content-Length']).toEqual('hello world'.length)
      )
    )
  })

  describe('when the contentType argument is given', () => {
    it('sets the Content-Type request header', () =>
      body('hello world', 'text/plain')(echo).then(({ options }) =>
        expect(options.headers['Content-Type']).toEqual('text/plain')
      )
    )
  })
})
