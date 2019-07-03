import withReference from 'fixtures/x-rechat-format/with-reference'
import withoutReference from 'fixtures/x-rechat-format/without-reference'

import { useReferencedFormat } from '.'

describe('Test Fetch Service X-RECHAT-FORMAT middleware', () => {
  it('Should return nothing when response is 206', () => {
    expect(useReferencedFormat({})).toBeNull()
  })

  it('Should return correct data after parsing the response', () => {
    expect(useReferencedFormat(withReference as any)).toEqual(
      withoutReference.body.data
    )
  })
})
