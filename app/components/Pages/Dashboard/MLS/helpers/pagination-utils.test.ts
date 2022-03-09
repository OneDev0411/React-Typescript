import { getListingsPage } from './pagination-utils'

describe('getListingsPage', () => {
  it('should return empty array when listings is empty', () => {
    const listings = []
    const currentPage = 1
    const pageSize = 10
    const expected = []
    const actual = getListingsPage(listings, currentPage, pageSize)

    expect(actual).toEqual(expected)
  })

  it('should return 1st page when listings size is less than pageSize', () => {
    const listings = [1, 2, 3]
    const currentPage = 1
    const pageSize = 10
    const expected = [1, 2, 3]
    const actual = getListingsPage(listings, currentPage, pageSize)

    expect(actual).toEqual(expected)
  })

  it('should return listings when listings size is euqal to pageSize', () => {
    const listings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const currentPage = 1
    const pageSize = 10
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const actual = getListingsPage(listings, currentPage, pageSize)

    expect(actual).toEqual(expected)
  })

  it('should return listings of 1st page when listings size is more than pageSize', () => {
    const listings = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
    ]
    const currentPage = 1
    const pageSize = 10
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const actual = getListingsPage(listings, currentPage, pageSize)

    expect(actual).toEqual(expected)
  })

  it('should return listings of 3rd page when listings size is more than pageSize', () => {
    const listings = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
    ]
    const currentPage = 3
    const pageSize = 5
    const expected = [11, 12, 13, 14, 15]
    const actual = getListingsPage(listings, currentPage, pageSize)

    expect(actual).toEqual(expected)
  })
  it('should return listings of last page when listings size is more than pageSize', () => {
    const listings = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
    ]
    const currentPage = 5
    const pageSize = 5
    const expected = [21]
    const actual = getListingsPage(listings, currentPage, pageSize)

    expect(actual).toEqual(expected)
  })
})
