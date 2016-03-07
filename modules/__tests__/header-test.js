import expect from 'expect'
import { header } from '../index'

const echo = (url, options) =>
  Promise.resolve({ url, options })

describe('header', () => {
  it('sets the value of a request header', () =>
    header('X-Requested-With', 'XMLHttpRequest')(echo).then(({ options }) =>
      expect(options.headers['X-Requested-With']).toEqual('XMLHttpRequest')
    )
  )
})
