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
})

export {}