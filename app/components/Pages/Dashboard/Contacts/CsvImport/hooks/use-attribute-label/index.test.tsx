import { renderHook, act } from '@testing-library/react-hooks'

import { ReactQueryTestBed, queryClient } from 'tests/unit/ReactQueryTestBed'

import { mockAttributeDefs } from '../../tests/helpers/mock-get-attribute-def'

import { useAttributeLabel } from '.'

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

  it('should return correct label of the attributes', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeLabel(),
      {
        wrapper: ReactQueryTestBed
      }
    )

    await waitForNextUpdate()

    act(() => {
      const label = result.current({
        type: 'attribute_def',
        attribute_def: 'edf3d7e0-440f-439d-ae0c-2226eda3785a'
      })

      expect(label).toBe('Instagram')
    })

    act(() => {
      const label = result.current({
        type: 'attribute_type',
        attribute_type: 'full_address'
      })

      expect(label).toBe('Full Address')
    })
  })

  it('should return correct label of the spouse attribute', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeLabel(),
      {
        wrapper: ReactQueryTestBed
      }
    )

    await waitForNextUpdate()

    act(() => {
      const label = result.current({
        type: 'attribute_def',
        attribute_def: '074c9902-23d9-4352-8b74-5a5531bd03f9',
        isPartner: true
      })

      expect(label).toBe('Spouse/Partner - Phone')
    })
  })

  it('should return correct label of the indexed attribute', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeLabel(),
      {
        wrapper: ReactQueryTestBed
      }
    )

    await waitForNextUpdate()

    act(() => {
      const label = result.current({
        type: 'attribute_def',
        attribute_def: '3759623d-c5d5-461d-8e15-c0b6662d718a',
        isPartner: false,
        index: 1
      })

      expect(label).toBe('Street Number 1')
    })
  })

  it('should return correct label of the indexed spouse attribute', async () => {
    const { result, waitForNextUpdate } = renderHook(
      () => useAttributeLabel(),
      {
        wrapper: ReactQueryTestBed
      }
    )

    await waitForNextUpdate()

    act(() => {
      const label = result.current({
        type: 'attribute_def',
        attribute_def: '3759623d-c5d5-461d-8e15-c0b6662d718a',
        isPartner: true,
        index: 1
      })

      expect(label).toBe('Spouse/Partner - Street Number 1')
    })
  })
})
