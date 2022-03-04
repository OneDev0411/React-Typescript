import { renderHook } from '@testing-library/react-hooks'
import { ParseError } from 'papaparse'

import csvFile from 'fixtures/contacts/file.csv'
import { ReactQueryTestBed, queryClient } from 'tests/unit/ReactQueryTestBed'
import { TestBed } from 'tests/unit/TestBed'

import { mockAttributeDefs } from '../../tests/helpers/mock-get-attribute-def'

import { useParseCsv } from '.'

jest.mock('@app/models/contacts/get-attribute-defs', () => {
  const originalModule = jest.requireActual(
    '@app/models/contacts/get-attribute-defs'
  )

  return {
    __esModule: true,
    ...originalModule,
    getAttributeDefs: jest.fn(() => mockAttributeDefs)
  }
})

describe('test Csv Import attribute label', () => {
  afterEach(() => {
    queryClient.clear()
  })

  it('should parse csv file', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () =>
        useParseCsv(csvFile, {
          onError: (error: ParseError) => {}
        }),
      {
        wrapper: ({ children }) => (
          <TestBed>
            <ReactQueryTestBed>{children}</ReactQueryTestBed>
          </TestBed>
        )
      }
    )

    await waitForNextUpdate()

    expect(result.current[0]?.data.length).toBe(2)
    expect(result.current[0]?.data[0]).toEqual(
      expect.arrayContaining([
        'First Name',
        'Last Name',
        'E-mail Address',
        'Partner Phone',
        'Home Address',
        'Street Address',
        'Tag'
      ])
    )
  })
})
