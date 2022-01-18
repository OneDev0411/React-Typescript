import { renderHook, act } from '@testing-library/react-hooks'
import { useOptions } from './use-attribute-options'
import attributeDefs from 'fixtures/contacts/attribute-definitions.json'
import { ReactQueryTestBed } from 'tests/unit/ReactQueryTestBed'
import nock from 'nock'
import { MappedField } from '../../types'

describe('test Csv Import attribute options', () => {
  nock(/.*/)
    .get('/contacts/attribute_defs')
    .reply(200, {
      data: attributeDefs
    })

  it('should create options when mapping is empty', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useOptions({}, ''), {
      wrapper: ReactQueryTestBed
    })

    await waitForNextUpdate()
    expect(result.current.length).toBe(44)
  })

  it('should create spouse/partner options', () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useOptions({}, ''), {
      wrapper: ReactQueryTestBed
    })

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
      'Foo': {
        type: 'attribute_def',
        attribute_def: '348e18e8-31f3-423f-b501-8a24a606d83b',
        index: 0,
        multiValued: false,
        isPartner: false
      }
    } as Record<string, MappedField>

    const { result, waitForNextUpdate } = renderHook(() => useOptions(fields, ''), {
      wrapper: ReactQueryTestBed
    })

    const list = result.current
    expect(list.length).toBe(55)
    expect(list.filter(item => item.index === 1).length).toBe(11)

    expect(list.filter(item => item.label.includes('Full Address')).length).toBe(2)
  })

  it('should create new address indexes when there is two mapped address', async () => {
    const fields = {
      'Foo': {
        type: 'attribute_def',
        attribute_def: '348e18e8-31f3-423f-b501-8a24a606d83b',
        index: 0,
        multiValued: false,
        isPartner: false
      },
      'Bar': {
        type: 'attribute_def',
        attribute_def: '348e18e8-31f3-423f-b501-8a24a606d83b',
        index: 1,
        multiValued: false,
        isPartner: false
      }
    } as Record<string, MappedField>

    const { result } = renderHook(() => useOptions(fields, ''), {
      wrapper: ReactQueryTestBed
    })

    const list = result.current
    expect(list.length).toBe(66)
    expect(list.filter(item => item.index === 1).length).toBe(11)
    expect(list.filter(item => item.index === 2).length).toBe(11)

    expect(list.filter(item => item.label.includes('Full Address')).length).toBe(3)
  })

  it('should search attribute options', () => {
    const searchTerm = 'spouse'
    const { result } = renderHook(() => useOptions({}, searchTerm), {
      wrapper: ReactQueryTestBed
    })

    const list = result.current
    expect(list.length).toBe(5)

    for (let item of list) {
      expect(item.label.toLowerCase()).toContain(searchTerm)
    }
  })
})

export {}