import { stringifyFilters } from './stringifyFilters'

// test stringifyFilters function
describe('stringifyFilters', () => {
  it('should return empty string if filters is null', () => {
    const filters = null
    const result = stringifyFilters(filters)

    expect(result).toBe('')
  })

  it('should return empty string if filters is empty', () => {
    const filters = {} as AlertFilters
    const result = stringifyFilters(filters)

    expect(result).toBe('')
  })

  describe('postal codes filters', () => {
    it('should return stringified filters if only 2 postal codes filter', () => {
      const filters = {
        postal_codes: ['12345', '54321']
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('In 12345 - 54321, Any $, Any Beds, Any Baths')
    })

    it('should return stringified filters if only one postal code filter', () => {
      const filters = {
        postal_codes: ['12345']
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('In 12345, Any $, Any Beds, Any Baths')
    })

    it('should return stringified filters if only empty postal code filter ', () => {
      const filters = {
        postal_codes: [] as string[]
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths')
    })
  })

  describe('property types filters', () => {
    it('should return stringified filters if only 2 property types filter', () => {
      const filters = {
        property_types: ['Residential', 'Commercial']
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe(
        'Residential - Commercial, Any $, Any Beds, Any Baths'
      )
    })

    it('should return stringified filters if only one property type filter', () => {
      const filters = {
        property_types: ['Residential Lease']
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Residential Lease, Any $, Any Beds, Any Baths')
    })

    it('should return stringified filters if only empty property type filter ', () => {
      const filters = {
        property_types: [] as string[]
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths')
    })
  })

  describe('price filter', () => {
    it('should return stringified filters if only max price = 0', () => {
      const filters = {
        maximum_price: 0
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths')
    })

    it('should return stringified filters if only min price filter', () => {
      const filters = {
        minimum_price: 2000000
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('+ $2m, Any Beds, Any Baths')
    })

    it('should return stringified filters if only max price filter', () => {
      const filters = {
        maximum_price: 80000000
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('- $80m, Any Beds, Any Baths')
    })
  })

  describe('bedroom filter', () => {
    it('should return stringified filters if only max bedroom = 0', () => {
      const filters = {
        maximum_bedrooms: 0
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths')
    })

    it('should return stringified filters if only min bedroom filter', () => {
      const filters = {
        minimum_bedrooms: 1
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, + 1 Bed, Any Baths')
    })

    it('should return stringified filters if only max bedroom filter', () => {
      const filters = {
        maximum_bedrooms: 5
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, - 5 Beds, Any Baths')
    })
  })

  describe('bathroom filter', () => {
    it('should return stringified filters if only max bathroom = 0', () => {
      const filters = {
        maximum_bathrooms: 0
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths')
    })

    it('should return stringified filters if only min bathroom filter', () => {
      const filters = {
        minimum_bathrooms: 5
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, + 5 Baths')
    })

    it('should return stringified filters if only max bathroom filter', () => {
      const filters = {
        maximum_bathrooms: 1
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, - 1 Bath')
    })
  })

  describe('area filter', () => {
    it('should return stringified filters if only maximum_square_meters = 0', () => {
      const filters = {
        maximum_square_meters: 0
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths')
    })

    it('should return stringified filters if only min square_meters filter', () => {
      const filters = {
        minimum_square_meters: 200
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths, + 200 Square meters')
    })

    it('should return stringified filters if only max square_meters filter', () => {
      const filters = {
        maximum_square_meters: 3000
      } as AlertFilters

      const result = stringifyFilters(filters)

      expect(result).toBe('Any $, Any Beds, Any Baths, - 3000 Square meters')
    })
  })

  it('should return stringified filters when all filters is present', () => {
    const filters = {
      property_types: ['Residential', 'Commercial'],
      minimum_price: 200000,
      maximum_price: 500000,
      minimum_bedrooms: 2,
      maximum_bedrooms: 3,
      minimum_bathrooms: 1,
      maximum_bathrooms: 2,
      minimum_square_meters: 100,
      maximum_square_meters: 200,
      postal_codes: ['12345', '54321']
    } as AlertFilters

    const result = stringifyFilters(filters)

    expect(result).toBe(
      'Residential - Commercial, In 12345 - 54321, $200k-$500k, 2-3 Beds, 1-2 Baths, 100-200 Square meters'
    )
  })
})
