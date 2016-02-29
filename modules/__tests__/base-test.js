import expect from 'expect'
import { base } from '../index'

const echo = (url, options) => Promise.resolve({ url, options })

describe('base', () => {
  it('sets the base URL of the request', () =>
    base('https://api.stripe.com')(echo, '/customers').then(({ url }) =>
      expect(url).toEqual('https://api.stripe.com/customers')
    )
  )
})
