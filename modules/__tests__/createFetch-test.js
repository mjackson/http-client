import expect from 'expect'
import {
  createFetch
} from '../index'

const global = (1, eval)('this')

describe('createFetch', () => {
  describe('with no middleware', () => {
    it('returns the global fetch function', () => {
      expect(createFetch()).toBe(global.fetch)
    })
  })
})
