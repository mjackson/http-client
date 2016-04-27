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
