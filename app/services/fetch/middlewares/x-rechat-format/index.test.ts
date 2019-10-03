import withReference from 'fixtures/x-rechat-format/with-reference.json'
import withoutReference from 'fixtures/x-rechat-format/without-reference.json'

import { useReferencedFormat } from '.'

describe('Test Fetch Service X-RECHAT-FORMAT middleware', () => {
  it('Should return nothing when response is 204 or 206', () => {
    expect(useReferencedFormat({} as any)).toEqual({})
  })

  it('Should return correct data after parsing the response', () => {
    expect(useReferencedFormat(withReference as any)).toEqual(
      withoutReference.body.data
    )
  })
})
