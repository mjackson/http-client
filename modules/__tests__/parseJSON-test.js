import expect from 'expect'
import { enhanceFetch, parse } from '../index'

const echoJSON = (json) =>
  enhanceFetch(
    () =>
      Promise.resolve({ json: () => Promise.resolve(json) })
  )

describe('parse("json")', () => {
  describe('by default', () => {
    it('sets the body property of the response', () =>
      parse('json')(echoJSON({ hello: 'world' })).then(response =>
        expect(response.body).toEqual({ hello: 'world' })
      )
    )
  })

  describe('when a "custom" property name is provided', () => {
    it('sets the "custom" property of the response', () =>
      parse('json', 'custom')(echoJSON({ hello: 'world' })).then(response =>
        expect(response.custom).toEqual({ hello: 'world' })
      )
    )
  })
})
