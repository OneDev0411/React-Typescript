import { item1, item2, item3, item4 } from 'fixtures/insights/insight'

import { doSort, SortValues } from './helpers'

describe('Sort in Marketing Insights', function() {
  let mockList

  beforeEach(function() {
    mockList = [item1, item2, item3, item4]
  })

  it('should sorting the list alphabetically', function() {
    /*
      The incoming object from server has a full_name object
      instead of display_name, it seems server renamed the field
      recently so the old codes are depends on display_name and
      it can not be changed easily, for this test we are testing the output of 
      `contactsList` which is returning display_name.
    */
    function normalizeInsightItem(item) {
      const { full_name, ...rest } = item

      return {
        display_name: full_name,
        ...rest
      }
    }

    const result = doSort(
      mockList.map(normalizeInsightItem),
      SortValues.ALPHABETICAL
    )
    const expectedResult = [item4, item1, item2, item3]

    expect(result).toEqual(expectedResult.map(normalizeInsightItem))
  })

  it('should sorting the list by bounced numbers', function() {
    const result = doSort(mockList, SortValues.BOUNCED)
    const expectedResult = [item2, item4, item1, item3]

    expect(result).toEqual(expectedResult)
  })

  it('should sorting the list by clicked', function() {
    const result = doSort(mockList, SortValues.MOST_CLICKED)
    const expectedResult = [item3, item2, item4, item1]

    expect(result).toEqual(expectedResult)
  })

  it('should sorting the list by opened', function() {
    const result = doSort(mockList, SortValues.MOST_OPENED)
    const expectedResult = [item4, item2, item1, item3]

    expect(result).toEqual(expectedResult)
  })

  it('should sorting the list by unsubscribed', function() {
    const result = doSort(mockList, SortValues.UNSUBSCRIBED)
    const expectedResult = [item4, item3, item2, item1]

    expect(result).toEqual(expectedResult)
  })

  it('should return itself when we are passing a undefined sort ', function() {
    const result = doSort(mockList, 'blahblah' as SortValues)
    const expectedResult = [item1, item2, item3, item4]

    expect(result).toEqual(expectedResult)
  })
})
