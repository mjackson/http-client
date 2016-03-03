import expect from 'expect'
import { createStack } from '../index'

const echo = (url, options) =>
  Promise.resolve({ url, options })

const push = (n) =>
  (fetch, url, options = {}) => {
    (options.pushed || (options.pushed = [])).push(n)
    return fetch(url, options)
  }

describe('createStack', () => {
  it('creates a new middleware that applies all middleware in the order they were used', () => {
    const stack = createStack(
      push(1),
      push(2),
      push(3)
    )

    expect(stack).toBeA(Function)

    return stack(echo).then(
      ({ options }) =>
        expect(options.pushed).toEqual([ 1, 2, 3 ])
    )
  })
})
