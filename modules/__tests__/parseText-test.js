import expect from 'expect'
import { parseText } from '../index'

const echoText = (text) =>
  (url, options) =>
    Promise.resolve({ text: () => Promise.resolve(text) })

describe('parseText', () => {
  describe('by default', () => {
    it('sets the textString property of the response', () =>
      parseText()(echoText('hello world')).then(response =>
        expect(response.textString).toEqual('hello world')
      )
    )
  })

  describe('when a "custom" property name is provided', () => {
    it('sets the "custom" property of the response', () =>
      parseText('custom')(echoText('hello world')).then(response =>
        expect(response.custom).toEqual('hello world')
      )
    )
  })
})
