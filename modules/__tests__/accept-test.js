import expect from 'expect'
import { accept } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

describe('accept', () => {
  it('sets the value of the Accept request header', () =>
    accept('application/json')(echo).then(({ options }) =>
      expect(options.headers.Accept).toEqual('application/json')
    )
  )
})
