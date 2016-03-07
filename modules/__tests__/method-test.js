import expect from 'expect'
import { method } from '../index'

const echo = (url, options) =>
  Promise.resolve({ url, options })

describe('method', () => {
  it('sets the request method', () =>
    method('PUT')(echo).then(({ options }) =>
      expect(options.method).toEqual('PUT')
    )
  )
})
