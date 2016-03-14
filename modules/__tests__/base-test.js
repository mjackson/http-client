import expect from 'expect'
import { base } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('base', () => {
  it('sets the base URL of the request', () =>
    base('https://api.stripe.com')(echo, '/customers').then(({ input }) =>
      expect(input).toEqual('https://api.stripe.com/customers')
    )
  )

  it('sets and uses the base URL of the request if no URI is provided', () =>
    base('https://api.stripe.com/customers')(echo).then(({ input }) =>
      expect(input).toEqual('https://api.stripe.com/customers')
    )
  )
})
