import expect from 'expect'
import { enhanceFetch, parse } from '../index'

const echoText = (text) =>
  enhanceFetch(
    () =>
      Promise.resolve({ text: () => Promise.resolve(text) })
  )

describe('parse("text")', () => {
  describe('by default', () => {
    it('sets the body property of the response', () =>
      parse('text')(echoText('hello world')).then(response =>
        expect(response.body).toEqual('hello world')
      )
    )
  })

  describe('when a "custom" property name is provided', () => {
    it('sets the "custom" property of the response', () =>
      parse('text', 'custom')(echoText('hello world')).then(response =>
        expect(response.custom).toEqual('hello world')
      )
    )
  })
})
