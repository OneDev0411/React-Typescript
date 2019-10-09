import { item1, item2, item3, item4 } from 'fixtures/insights/insight'

import { doSort, SortValues } from './helpers'

describe('Sort in Marketing Insights (List)', () => {
  let mockList

  beforeEach(() => {
    mockList = [item1, item2, item3, item4]
  })

  it('should sort the list by newest date', () => {
    const result = doSort(mockList, SortValues.Newest)
    const expectedResult = [item1, item2, item3, item4]

    expect(result).toEqual(expectedResult)
  })

  it('should sort the list by oldest date', () => {
    const result = doSort(mockList, SortValues.Oldest)
    const expectedResult = [item4, item3, item2, item1]

    expect(result).toEqual(expectedResult)
  })
})
