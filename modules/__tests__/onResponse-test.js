import expect from 'expect'
import { enhanceFetch, createStack, onResponse } from '../index'

const echo = enhanceFetch(
  (input, options) =>
    Promise.resolve({ input, options })
)

const multiply = (n) =>
  (response) => {
    if (!response.value)
      response.value = 1

    response.value *= n

    return response
  }

describe('onResponse', () => {
  it('executes response handlers in the order they were defined', () => {
    const stack = createStack(
      onResponse(multiply(2)),
      onResponse(multiply(3)),
      onResponse(multiply(4))
    )

    return stack(echo).then(
      (response) =>
        expect(response.value).toEqual(1 * 2 * 3 * 4)
    )
  })
})
