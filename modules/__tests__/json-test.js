import expect from 'expect'
import { json } from '../index'

const echo = (input, options) =>
  Promise.resolve({ input, options })

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
