import expect from 'expect'
import { fetch } from '../index'

describe('exports', () => {
  it('has a fetch function', () =>
    expect(fetch).toBeA(Function)
  )
})
