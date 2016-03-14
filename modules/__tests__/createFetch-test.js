import expect from 'expect'
import {
  fetch as globalFetch,
  createFetch
} from '../index'

const echo = (fetch, input, options) =>
  Promise.resolve({ input, options })

describe('createFetch', () => {
  describe('with no middleware', () => {
    it('returns the global fetch function', () => {
      expect(createFetch()).toBe(globalFetch)
    })
  })
})

describe('a custom fetch function', () => {
  let fetch
  beforeEach(() => {
    fetch = createFetch(echo)
  })

  it('accepts a callback as the 3rd arg', (done) => {
    const outerInput = '/hello'
    const outerOptions = {}

    fetch(outerInput, outerOptions, (error, { input, options }) => {
      expect(error).toNotExist()
      expect(input).toBe(outerInput)
      expect(options).toBe(outerOptions)
      done()
    })
  })

  it('accepts a callback as the 2nd arg', (done) => {
    const outerInput = '/hello'

    fetch(outerInput, (error, { input }) => {
      expect(error).toNotExist()
      expect(input).toBe(outerInput)
      done()
    })
  })

  it('accepts a callback as the 1st arg', (done) => {
    fetch((error) => {
      expect(error).toNotExist()
      done()
    })
  })

  describe('when called with a callback', () => {
    it('returns a promise that always resolves to undefined', (done) => {
      const outerInput = '/hello'
      const outerOptions = {}

      const promise = fetch(outerInput, outerOptions, (error, { input, options }) => {
        expect(error).toNotExist()
        expect(input).toBe(outerInput)
        expect(options).toBe(outerOptions)
      })

      promise.then(value => {
        expect(value).toBe(undefined)
        done()
      })
    })
  })
})
