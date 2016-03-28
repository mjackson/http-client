import expect from 'expect'
import { init } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('init', () => {
  it('sets the value of a property in the options', () =>
    init('timeout', 5000)(echo).then(({ options }) =>
      expect(options.timeout).toEqual(5000)
    )
  )
})
