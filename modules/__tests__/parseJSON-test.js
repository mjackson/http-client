import expect from 'expect'
import { parseJSON } from '../index'

const echoJSON = (json) =>
  (url, options) =>
    Promise.resolve({ json: () => Promise.resolve(json) })

describe('parseJSON', () => {
  it('sets the jsonData property of the response', () =>
    parseJSON()(echoJSON({ hello: 'world' })).then(response =>
      expect(response.jsonData).toEqual({ hello: 'world' })
    )
  )
})
