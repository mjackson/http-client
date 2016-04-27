import expect from 'expect'
import {
  fetch as globalFetch,
  createFetch
} from '../index'

describe('createFetch', () => {
  describe('with no middleware', () => {
    it('returns the global fetch function', () => {
      expect(createFetch()).toBe(globalFetch)
    })
  })
})
