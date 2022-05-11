import {
  createSortString,
  parseSortIndex,
  parseToValertSort,
  sortListingsByIndex
} from './sort-utils'

describe('createSortString', () => {
  it('should works with ascending property', () => {
    const actual = createSortString('price', true)
    const expected = 'price'

    expect(actual).toBe(expected)
  })
  it('should works with descending property', () => {
    const actual = createSortString('price', false)
    const expected = '-price'

    expect(actual).toBe(expected)
  })
  it('it should works with Bedrooms sort', () => {
    const actual = createSortString('beds', true)
    const expected = 'beds'

    expect(actual).toBe(expected)
  })
})

describe('parseSortIndex', () => {
  it('should works with ascending property', () => {
    const actual = parseSortIndex('price')
    const expected = {
      index: 'price',
      ascending: true
    }

    expect(actual).toEqual(expected)
  })
  it('should works with descending property', () => {
    const actual = parseSortIndex('-price')
    const expected = {
      index: 'price',
      ascending: false
    }

    expect(actual).toEqual(expected)
  })
  it('it should works with Bedrooms sort', () => {
    const actual = parseSortIndex('beds')
    const expected = {
      index: 'beds',
      ascending: true
    }

    expect(actual).toEqual(expected)
  })
})

describe('parseToValertSort', () => {
  it('should parse price', () => {
    const actual = parseToValertSort('price')
    const expected = 'price'

    expect(actual).toBe(expected)
  })
  it('should parse beds', () => {
    const actual = parseToValertSort('beds')
    const expected = 'bedrooms'

    expect(actual).toBe(expected)
  })
  it('it parse sqft', () => {
    const actual = parseToValertSort('sqft')
    const expected = 'square_feet'

    expect(actual).toBe(expected)
  })
  it('it parse created_at', () => {
    const actual = parseToValertSort('created_at')
    const expected = 'list_date'

    expect(actual).toBe(expected)
  })
  it('it parse builtYear', () => {
    const actual = parseToValertSort('builtYear')
    const expected = 'year_built'

    expect(actual).toBe(expected)
  })
  it('it parse lotSizeArea', () => {
    const actual = parseToValertSort('lotSizeArea')
    const expected = 'lot_size'

    expect(actual).toBe(expected)
  })
})

describe('sortListingsByIndex', () => {
  let compactListings: ICompactListing[] = []

  beforeEach(() => {
    // fake listings to reduce test time
    compactListings = [
      {
        id: '1',
        type: 'compact_listing',
        price: 420,
        close_price: 300,
        compact_property: {
          bedroom_count: 1,
          bathroom_count: 2,
          year_built: 1990,
          lot_size_area: 100,
          sqft: 5000
        }
      },
      {
        id: '2',
        type: 'compact_listing',
        price: 200,
        close_price: 200,
        compact_property: {
          bedroom_count: 5,
          bathroom_count: 1,
          year_built: 1998,
          lot_size_area: 120,
          sqft: 5050
        }
      },
      {
        id: '3',
        type: 'compact_listing',
        price: 300,
        close_price: 500,
        compact_property: {
          bedroom_count: 4,
          bathroom_count: 1,
          year_built: 2010,
          lot_size_area: 90,
          sqft: 1000
        }
      }
    ] as unknown as ICompactListing[]
  })

  it('should sort by price on compact listing type', () => {
    const actual = sortListingsByIndex(compactListings, 'price', true)
    const expected = [
      compactListings[1],
      compactListings[2],
      compactListings[0]
    ]

    expect(actual).toEqual(expected)
  })

  it('should sort by lot size on compact listing type', () => {
    const actual = sortListingsByIndex(compactListings, 'lotSizeArea', true)
    const expected = [
      compactListings[2],
      compactListings[0],
      compactListings[1]
    ]

    expect(actual).toEqual(expected)
  })

  it('should sort by bedrooms on compact listing type', () => {
    const actual = sortListingsByIndex(compactListings, 'beds', true)
    const expected = [
      compactListings[0],
      compactListings[2],
      compactListings[1]
    ]

    expect(actual).toEqual(expected)
  })

  it('should sort by price on compact listing type', () => {
    const listings = compactListings.map(
      listing =>
        ({
          ...listing,
          type: 'listing',
          property: listing.compact_property
        } as unknown as IListing)
    )

    const actual = sortListingsByIndex(listings, 'price', true)
    const expected = [listings[1], listings[2], listings[0]]

    expect(actual).toEqual(expected)
  })

  it('should not include unwanted properties', () => {
    const actual = sortListingsByIndex(compactListings, 'beds', true)

    expect(actual[0].hasOwnProperty('bedroom_count')).toBeFalsy()
    expect(actual[1].hasOwnProperty('bathroom_count')).toBeFalsy()
    expect(actual[2].hasOwnProperty('year_built')).toBeFalsy()
    expect(actual[0].hasOwnProperty('year_built')).toBeFalsy()
    expect(actual[1].hasOwnProperty('lot_size_area')).toBeFalsy()
    expect(actual[2].hasOwnProperty('sqft')).toBeFalsy()
  })
})
