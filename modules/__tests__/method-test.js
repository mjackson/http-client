import expect from 'expect'
import { method } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('method', () => {
  it('sets the request method', () =>
    method('PUT')(echo).then(({ options }) =>
      expect(options.method).toEqual('PUT')
    )
  )
})
