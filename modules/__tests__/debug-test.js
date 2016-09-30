import expect from 'expect'
import { debug } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

const echoError = () =>
  Promise.reject(new Error)

describe('debug', () => {
  describe('when the request succeeds', () => {
    it('sets the debug.input property of the response', () =>
      debug()(echo, '/hello', { the: 'options' }).then(response =>
        expect(response.debug.input).toEqual('/hello')
      )
    )

    it('sets the debug.options property of the response', () =>
      debug()(echo, '/hello', { the: 'options' }).then(response =>
        expect(response.debug.options).toEqual({ the: 'options' })
      )
    )
  })

  describe('when the request fails', () => {
    it('sets the debug.input property of the error', () =>
      debug()(echoError, '/hello', { the: 'options' }).then(undefined, (error) =>
        expect(error.debug.input).toEqual('/hello')
      )
    )

    it('sets the debug.options property of the response', () =>
      debug()(echoError, '/hello', { the: 'options' }).then(undefined, (error) =>
        expect(error.debug.options).toEqual({ the: 'options' })
      )
    )
  })
})
