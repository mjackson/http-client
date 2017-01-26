import expect from 'expect'
import byteLength from 'byte-length'
import { body } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('body', () => {
  describe('with an ASCII string', () => {
    const asciiString = 'hello world'

    it('sets the body of the request', () => {
      body(asciiString)(echo).then(({ options }) =>
        expect(options.decodedBody).toEqual(asciiString)
      )
    })

    describe('when the content has a length property', () => {
      it('sets the Content-Length request header', () =>
        body(asciiString)(echo).then(({ options }) =>
          expect(options.headers['Content-Length']).toEqual(asciiString.length)
        )
      )
    })

    describe('when the contentType argument is given', () => {
      it('sets the Content-Type request header', () =>
        body(asciiString, 'text/plain')(echo).then(({ options }) =>
          expect(options.headers['Content-Type']).toEqual('text/plain')
        )
      )
    })
  })

  describe('with a multi-byte string', () => {
    const multiByteString = 'hello λ world'

    it('sets the body of the request', () => {
      body(multiByteString)(echo).then(({ options }) =>
        expect(options.decodedBody).toEqual(multiByteString)
      )
    })

    describe('when the content has a length property', () => {
      it('sets the Content-Length request header', () =>
        body(multiByteString)(echo).then(({ options }) =>
          expect(options.headers['Content-Length']).toEqual(byteLength(multiByteString))
        )
      )
    })

    describe('when the contentType argument is given', () => {
      it('sets the Content-Type request header', () =>
        body(multiByteString, 'text/plain')(echo).then(({ options }) =>
          expect(options.headers['Content-Type']).toEqual('text/plain')
        )
      )
    })
  })
})
