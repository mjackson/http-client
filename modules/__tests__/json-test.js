import expect from 'expect'
import { json } from '../index'

const echo = (url, options) => Promise.resolve({ url, options })

describe('json', () => {
  it('sets the body of the request to JSON', () => {
    json({ hello: 'world' })(echo).then(({ options }) =>
      expect(options.body).toEqual('{"hello":"world"}')
    )
  })

  it('sets the Content-Type request header', () =>
    json({ hello: 'world' })(echo).then(({ options }) =>
      expect(options.headers['Content-Type']).toEqual('application/json')
    )
  )
})
