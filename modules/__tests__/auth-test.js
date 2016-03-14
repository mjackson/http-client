import expect from 'expect'
import { auth } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('auth', () => {
  it('sets the value of the Authorization request header', () =>
    auth('the-auth')(echo).then(({ options }) =>
      expect(options.headers.Authorization).toEqual('the-auth')
    )
  )
})
