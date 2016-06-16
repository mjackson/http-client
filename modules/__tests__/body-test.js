import expect from 'expect'
import { body } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

const str = 'hello λ world'

describe('body', () => {
  it('sets the body of the request', () => {
    body(str)(echo).then(({ options }) =>
      expect(options.body).toEqual(str)
    )
  })

  describe('when the content has a length property', () => {
    it('sets the Content-Length request header', () =>
      body(str)(echo).then(({ options }) =>
        expect(options.headers['Content-Length']).toEqual(Buffer.byteLength(str))
      )
    )
  })

  describe('when the contentType argument is given', () => {
    it('sets the Content-Type request header', () =>
      body(str, 'text/plain')(echo).then(({ options }) =>
        expect(options.headers['Content-Type']).toEqual('text/plain')
      )
    )
  })
})
