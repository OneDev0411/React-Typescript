import { renderHook, act } from '@testing-library/react-hooks'
import attributeDefs from 'fixtures/contacts/attribute-definitions.json'
import csvFile from 'fixtures/contacts/file.csv'
import { ReactQueryTestBed } from 'tests/unit/ReactQueryTestBed'
import nock from 'nock'

import { useParseCsv } from '.'
import { ParseError } from 'papaparse'
import { TestBed } from 'tests/unit/TestBed'

describe('test Csv Import attribute label', () => {
  nock(/.*/)
    .get('/contacts/attribute_defs')
    .reply(200, {
      data: attributeDefs
    })

  it('should parse csv file', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useParseCsv(csvFile, {
        onError: (error: ParseError) => {}
      }), {
      wrapper: ({ children }) => (
        <TestBed>
          <ReactQueryTestBed>{children}</ReactQueryTestBed>
        </TestBed>
      )
    })

    await waitForNextUpdate()

    expect(result.current[0]?.data.length).toBe(2)
    expect(result.current[0]?.data[0]).toEqual(expect.arrayContaining(
      ["First Name", "Last Name", "E-mail Address", "Partner Phone", "Home Address", "Street Address", "Tag"]
    ))
  })
})

export {}