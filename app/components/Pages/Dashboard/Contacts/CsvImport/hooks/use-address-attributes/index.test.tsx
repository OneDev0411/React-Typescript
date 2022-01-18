import { renderHook, act } from '@testing-library/react-hooks'
import attributeDefs from 'fixtures/contacts/attribute-definitions.json'
import { ReactQueryTestBed } from 'tests/unit/ReactQueryTestBed'
import nock from 'nock'

import { useAddressAttributes } from '../use-address-attributes'

describe('test Csv Import address attributes', () => {
  nock(/.*/)
    .get('/contacts/attribute_defs')
    .reply(200, {
      data: attributeDefs
    })

  it('should return list of all address attributes', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useAddressAttributes(), {
      wrapper: ReactQueryTestBed
    })

    await waitForNextUpdate()

    act(() => {
      const list = result.current.getAddressAttributes()
      expect(list.length).toBe(11)
      expect(list.filter(item => item.type === 'attribute_def').length).toBe(10)
      expect(list.filter(item => item.type === 'attribute_type').length).toBe(1)
    })
  })

  it('should return "true" when attribute is an address', async () => {
    const { result } = renderHook(
      () => useAddressAttributes(), {
      wrapper: ReactQueryTestBed
    })

    act(() => {
      expect(result.current.isAddressAttribute({
        type: 'attribute_def',
        attribute_def: '348e18e8-31f3-423f-b501-8a24a606d83b'
      })).toBe(true)
    })

    act(() => {
      expect(result.current.isAddressAttribute({
        type: 'attribute_type',
        attribute_type: 'full_address'
      })).toBe(true)
    })
  })

  it('should return "false" when attribute is an address', async () => {
    const { result } = renderHook(
      () => useAddressAttributes(), {
      wrapper: ReactQueryTestBed
    })

    act(() => {
      expect(result.current.isAddressAttribute({
        type: 'attribute_def',
        attribute_def: 'edf3d7e0-440f-439d-ae0c-2226eda3785a'
      })).toBe(false)
    })

    act(() => {
      expect(result.current.isAddressAttribute({
        type: 'attribute_type',
        attribute_type: 'tag'
      })).toBe(false)
    })
  })
})

export {}