import { doSort, SortValues } from './helpers'

describe('Sort in Marketing Insights', function() {
  let mockList
  const item1 = {
    clicked: 0,
    display_name: 'Bahram Nouraei',
    failed: 3,
    id: '8d441b70-96cb-11e9-a9bd-0a95998482ac',
    opened: 2,
    profile_image_url: null,
    to: 'jamesnonat2@outlook.com',
    unsubscribed: 2
  }
  const item2 = {
    clicked: 2,
    display_name: 'Shadmehr Aghili',
    failed: 5,
    id: '1d441b50-96cb-14e1-a9bd-0z95h98s82ac',
    opened: 3,
    profile_image_url: null,
    to: 'shadi@outlook.com',
    unsubscribed: 3
  }
  const item3 = {
    clicked: 4,
    display_name: '',
    failed: 0,
    id: '3d444230-96mb-11e9-a9bd-0an599q482ac',
    opened: 0,
    profile_image_url: null,
    to: 'gentelman@outlook.com',
    unsubscribed: 4
  }
  const item4 = {
    clicked: 1,
    display_name: 'Abbas Ghaderi',
    failed: 4,
    id: '3d444230-96mb-11e9-a9bd-0an599q482ac',
    opened: 4,
    profile_image_url: null,
    to: 'gentelman@outlook.com',
    unsubscribed: 5
  }

  beforeEach(function() {
    mockList = [item1, item2, item3, item4]
  })

  it('should sorting the list alphabetically', function() {
    const result = doSort(mockList, SortValues.ALPHABETICAL)
    const expectedResult = [item4, item1, item2, item3]

    expect(result).toEqual(expectedResult)
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
    const result = doSort(mockList, 'blahblah')
    const expectedResult = [item1, item2, item3, item4]

    expect(result).toEqual(expectedResult)
  })
})
