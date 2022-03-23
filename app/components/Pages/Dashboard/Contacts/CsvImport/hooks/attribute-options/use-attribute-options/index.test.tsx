import { renderHook } from '@testing-library/react-hooks'

import { ReactQueryTestBed, queryClient } from 'tests/unit/ReactQueryTestBed'

import { mockAttributeDefs } from '../../../tests/helpers/mock-get-attribute-def'
import { MappedField } from '../../../types'

import { useOptions } from '.'

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

describe('test Csv Import attribute options', () => {
  afterEach(async () => {
    queryClient.clear()
  })

  it('should create options when mapping is empty', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOptions({}, ''), {
      wrapper: ReactQueryTestBed
    })

    await waitForNextUpdate()
    expect(result.current.length).toBe(44)
  })

  it('should create spouse/partner options', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOptions({}, ''), {
      wrapper: ReactQueryTestBed
    })

    await waitForNextUpdate()

    const list = result.current

    expect(list.filter(item => item.isPartner).length).toBe(5)

    expect(
      list.find(item => item.label === 'Spouse/Partner - Birthday')
    ).toMatchObject({
      index: 0,
      isPartner: true,
      disabled: false
    })
  })

  it('should create new address indexes when there is one mapped address', async () => {
    const fields = {
      Foo: {
        type: 'attribute_def',
        attribute_def: '348e18e8-31f3-423f-b501-8a24a606d83b',
        index: 0,
        multiValued: false,
        isPartner: false
      }
    } as Record<string, MappedField>

    const { result, waitForNextUpdate } = renderHook(
      () => useOptions(fields, ''),
      {
        wrapper: ReactQueryTestBed
      }
    )

    await waitForNextUpdate()

    const list = result.current

    expect(list.length).toBe(55)
    expect(list.filter(item => item.index === 1).length).toBe(11)

    expect(
      list.filter(item => item.label.includes('Full Address')).length
    ).toBe(2)
  })

  it('should create new address indexes when there is two mapped address', async () => {
    const fields = {
      Foo: {
        type: 'attribute_def',
        attribute_def: '348e18e8-31f3-423f-b501-8a24a606d83b',
        index: 0,
        multiValued: false,
        isPartner: false
      },
      Bar: {
        type: 'attribute_def',
        attribute_def: '348e18e8-31f3-423f-b501-8a24a606d83b',
        index: 1,
        multiValued: false,
        isPartner: false
      }
    } as Record<string, MappedField>

    const { result, waitForNextUpdate } = renderHook(
      () => useOptions(fields, ''),
      {
        wrapper: ReactQueryTestBed
      }
    )

    await waitForNextUpdate()

    const list = result.current

    expect(list.length).toBe(66)
    expect(list.filter(item => item.index === 1).length).toBe(11)
    expect(list.filter(item => item.index === 2).length).toBe(11)

    expect(
      list.filter(item => item.label.includes('Full Address')).length
    ).toBe(3)
  })

  it('should search attribute options', async () => {
    const searchTerm = 'spouse'
    const { result, waitForNextUpdate } = renderHook(
      () => useOptions({}, searchTerm),
      {
        wrapper: ReactQueryTestBed
      }
    )

    await waitForNextUpdate()

    const list = result.current

    expect(list.length).toBe(5)

    list.forEach(item => {
      expect(item.label.toLowerCase()).toContain(searchTerm)
    })
  })
})
