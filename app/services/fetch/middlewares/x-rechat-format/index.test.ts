import data from './fixture.json'

import { compressResponse } from '.'

describe('Test Fetch Service X-RECHAT-FORMAT middleware', () => {
  it.only('Should return correct data after parsing the response', () => {
    const result = compressResponse(data as any)
  })
})
