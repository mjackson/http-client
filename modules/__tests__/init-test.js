import expect from 'expect'
import { init } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('init', () => {
  it('sets the value of a property in the options', () =>
    init('credentials', 'include')(echo).then(({ options }) =>
      expect(options.credentials).toEqual('include')
    )
  )
})
