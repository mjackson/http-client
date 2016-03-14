import expect from 'expect'
import { requestInfo } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

const echoError = () =>
  Promise.reject(new Error)

describe('requestInfo', () => {
  describe('when the request succeeds', () => {
    it('sets the requestInput property of the response', () =>
      requestInfo()(echo, '/hello', { the: 'options' }).then(response =>
        expect(response.requestInput).toEqual('/hello')
      )
    )

    it('sets the requestOptions property of the response', () =>
      requestInfo()(echo, '/hello', { the: 'options' }).then(response =>
        expect(response.requestOptions).toEqual({ the: 'options' })
      )
    )
  })

  describe('when the request fails', () => {
    it('sets the requestInput property of the error', () =>
      requestInfo()(echoError, '/hello', { the: 'options' }).then(undefined, (error) =>
        expect(error.requestInput).toEqual('/hello')
      )
    )

    it('sets the requestOptions property of the response', () =>
      requestInfo()(echoError, '/hello', { the: 'options' }).then(undefined, (error) =>
        expect(error.requestOptions).toEqual({ the: 'options' })
      )
    )
  })
})
