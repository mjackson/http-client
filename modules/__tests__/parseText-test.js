import expect from 'expect'
import { parseText } from '../index'

const echoText = (text) =>
  (url, options) =>
    Promise.resolve({ text: () => Promise.resolve(text) })

describe('parseText', () => {
  it('sets the textString property of the response', () =>
    parseText()(echoText('hello world')).then(response =>
      expect(response.textString).toEqual('hello world')
    )
  )
})
