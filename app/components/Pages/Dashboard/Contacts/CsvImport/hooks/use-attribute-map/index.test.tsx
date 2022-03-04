import { renderHook, act, cleanup } from '@testing-library/react-hooks'
import nock from 'nock'
import { ParseResult } from 'papaparse'

import { ReactQueryTestBed, queryClient } from 'tests/unit/ReactQueryTestBed'
import { TestBed } from 'tests/unit/TestBed'

import { mockAttributeDefs } from '../../tests/helpers/mock-get-attribute-def'

import { useAttributeMap } from '.'

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

const csv = {
  data: [
    ['First Name', 'Last Name', 'Email'],
    ['John', 'Doe', 'johndoe@hotmail.com']
  ]
} as ParseResult

describe('test Csv Import auto mapping', () => {
  afterEach(() => {
    queryClient.clear()
    cleanup()
  })

  it('should map the columns to the corresponding attributes', async () => {
    nock(/.*/)
      .post('/csv/similarity')
      .reply(200, {
        data: {
          'First Name': {
            attribute: {
              type: 'attribute_def',
              attribute_def: 'a90a7cef-a080-44e3-8c13-eb33da4c0465'
            },
            rate: 0.9
          }
        }
      })

    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeMap(csv),
      {
        wrapper: ({ children }) => (
          <TestBed>
            <ReactQueryTestBed>{children}</ReactQueryTestBed>
          </TestBed>
        )
      }
    )

    await waitForNextUpdate()
    await waitForNextUpdate()

    expect(result.current[0]).toMatchObject({
      'First Name': {
        type: 'attribute_def',
        attribute_def: 'a90a7cef-a080-44e3-8c13-eb33da4c0465'
      }
    })
  })

  it('should not map the column when the rate is low', async () => {
    nock(/.*/)
      .post('/csv/similarity')
      .reply(200, {
        data: {
          'First Name': {
            attribute: {
              type: 'attribute_def',
              attribute_def: 'a90a7cef-a080-44e3-8c13-eb33da4c0465'
            },
            rate: 0.2
          }
        }
      })

    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeMap(csv),
      {
        wrapper: ({ children }) => (
          <TestBed>
            <ReactQueryTestBed>{children}</ReactQueryTestBed>
          </TestBed>
        )
      }
    )

    await waitForNextUpdate()

    expect(result.current[0]).toMatchObject({})
  })

  it('shoud map the column after auto mapping', async () => {
    nock(/.*/).post('/csv/similarity').reply(200, {
      data: {}
    })

    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeMap(csv),
      {
        wrapper: ({ children }) => (
          <TestBed>
            <ReactQueryTestBed>{children}</ReactQueryTestBed>
          </TestBed>
        )
      }
    )

    await waitForNextUpdate()

    act(() => {
      result.current[1]({
        'First Name': {
          type: 'attribute_def',
          attribute_def: 'a90a7cef-a080-44e3-8c13-eb33da4c0465',
          isPartner: false,
          index: 0
        }
      })
    })

    expect(result.current[0]).toMatchObject({
      'First Name': {
        type: 'attribute_def',
        attribute_def: 'a90a7cef-a080-44e3-8c13-eb33da4c0465'
      }
    })
  })

  it('should return status when mapping', async () => {
    nock(/.*/).post('/csv/similarity').reply(200, {
      data: {}
    })

    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeMap(csv),
      {
        wrapper: ({ children }) => (
          <TestBed>
            <ReactQueryTestBed>{children}</ReactQueryTestBed>
          </TestBed>
        )
      }
    )

    await waitForNextUpdate()

    expect(result.current[2]).toBe('doing')

    await waitForNextUpdate()

    expect(result.current[2]).toBe('done')
  })
})
