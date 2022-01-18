import { renderHook, act } from '@testing-library/react-hooks'
import { useOptions } from './use-attribute-options'

import attributeDefs from 'fixtures/contacts/attribute-definitions.json'
import { ReactQueryTestBed } from '../../../../../../../../tests/unit/ReactQueryTestBed'


describe('Teat Csv Import attribute options', ()  => {
  beforeEach(() => {
    // nock(/.*/)
    //   .get('/contacts/attribute_defs')
    //   .reply(200, {
    //     data
    //   })

    jest.mock(
      '@app/models/contacts/get-attribute-defs',
      () => async (data) => {
        // await mockUpdateCampaignModel.fn(superCampaignId, data)
        // await mockUpdateCampaignModel.fn(data)
        console.log('####', data)
        return data
      }
    )
  })

  it('should create options when mapping is empty', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useOptions({}, ''), { wrapper: ReactQueryTestBed })

    await waitForNextUpdate()

    expect(result.current.length).toBe(44)
    expect(result.current.filter(item => item.label.includes('Spouse/Partner')).length).toBe(5)

    console.log(result.current)
  })
})

export {}