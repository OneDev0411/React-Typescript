import {
  createSortString,
  parseSortIndex,
  parseToValertSort
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
