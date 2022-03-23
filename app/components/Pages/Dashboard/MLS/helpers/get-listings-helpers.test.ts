import { ListingSearchOptions } from '../ExploreTab/context/reducers'
import { Sort } from '../types'

import {
  createValertQueryString,
  createValertOptions
} from './get-listings-helpers'
import { parseToValertSort } from './sort-utils'

describe('createValertQueryString', () => {
  let brand: IBrand
  let zoom: number
  let proposedAgentZoomLevel: number
  let sort: Sort

  beforeEach(() => {
    zoom = 12
    proposedAgentZoomLevel = 8
    sort = {
      index: 'price',
      ascending: true
    }
    brand = {
      type: 'brand',
      created_at: 1231231,
      updated_at: 123123,
      id: 'brand-id',
      name: 'brand-name',
      offices: ['office1'],
      parent: null,
      settings: null,
      assets: {},
      hostnames: [],
      messages: null,
      brand_type: 'Office',
      training: false,
      base_url: '',
      member_count: 12
    }
  })

  it('should contain office if brand has office', () => {
    const expected =
      'associations=compact_listing.proposed_agent&order_by[]=office&order_by[]=status&office=office1&order_by[]=%2Bprice'

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      brand,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should not contain office if brand has not office', () => {
    brand.offices = []

    const expected =
      'associations=compact_listing.proposed_agent&order_by[]=%2Bprice'

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      brand,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should not contain associations if brand is null', () => {
    const expected = 'order_by[]=%2Bprice'

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      null,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should not contain associations if zoom is less than proposedAgentZoomLevel', () => {
    zoom = 4
    proposedAgentZoomLevel = 8

    const expected = 'order_by[]=%2Bprice'

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      brand,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should contain associations if zoom is equal to proposedAgentZoomLevel', () => {
    zoom = 4
    proposedAgentZoomLevel = 4

    const expected =
      'associations=compact_listing.proposed_agent&order_by[]=office&order_by[]=status&office=office1&order_by[]=%2Bprice'

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      brand,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should has correct sortDirQuery when ascending is true', () => {
    sort = {
      index: 'builtYear',
      ascending: true
    }

    const expected = 'order_by[]=%2Byear_built'

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      null,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should has correct sortDirQuery when ascending is false', () => {
    sort = {
      index: 'builtYear',
      ascending: false
    }

    const expected = 'order_by[]=-year_built'

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      null,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should has correct order when index is beds', () => {
    sort = {
      index: 'beds',
      ascending: false
    }

    const expected = `order_by[]=-${parseToValertSort('beds')}`

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      null,
      sort
    )

    expect(actual).toEqual(expected)
  })

  it('should has correct order when index is baths', () => {
    sort = {
      index: 'baths',
      ascending: false
    }

    const expected = `order_by[]=-${parseToValertSort('baths')}`

    const actual = createValertQueryString(
      zoom,
      proposedAgentZoomLevel,
      null,
      sort
    )

    expect(actual).toEqual(expected)
  })
})

describe('createValertOptions', () => {
  let search: ListingSearchOptions
  let limit: number

  beforeEach(() => {
    limit = 10
    search = {
      bounds: {
        sw: {
          lat: 28.646776404271037,
          lng: -90.65945819144291
        },
        ne: {
          lat: 35.05207923785588,
          lng: -83.39749530081791
        }
      },
      drawing: [],
      filters: {
        open_house: false,
        property_types: ['Residential'],
        listing_statuses: ['Active'],
        architectural_styles: null,
        school_districts: null,
        elementary_schools: null,
        high_schools: null,
        middle_schools: null,
        junior_high_schools: null,
        senior_high_schools: null,
        primary_schools: null,
        intermediate_schools: null,
        minimum_parking_spaces: null,
        mls_areas: null,
        counties: null,
        subdivisions: null,
        minimum_price: null,
        maximum_price: null,
        minimum_bedrooms: null,
        maximum_bedrooms: null,
        minimum_bathrooms: null,
        maximum_bathrooms: null,
        minimum_square_meters: null,
        maximum_square_meters: null,
        created_by: null,
        minimum_lot_square_meters: null,
        maximum_lot_square_meters: null,
        minimum_year_built: null,
        maximum_year_built: null,
        pool: null,
        pets: null,
        number_of_pets_allowed: null,
        application_fee: null,
        appliances: null,
        furnished: null,
        fenced_yard: null,
        title: null,
        minimum_sold_date: null,
        excluded_listing_ids: null,
        postal_codes: null,
        search: null
      },
      sort: {
        index: 'price',
        ascending: false
      }
    }
  })

  it('should return drawing points when search.drawingPoint does exist', () => {
    search.drawing = [
      {
        lat: 28.646776404271037,
        lng: -90.65945819144291
      },
      {
        lat: 35.05207923785588,
        lng: -83.39749530081791
      },
      {
        lat: 35.05207923785588,
        lng: -83.39749530081791
      }
    ]

    const expected = [
      {
        latitude: 28.646776404271037,
        longitude: -90.65945819144291
      },
      {
        latitude: 35.05207923785588,
        longitude: -83.39749530081791
      },
      {
        latitude: 35.05207923785588,
        longitude: -83.39749530081791
      }
    ]

    const actual = createValertOptions(search, limit)

    expect(actual.points).toEqual(expected)
  })

  it('should return bound points when search.drawingPoint does not exist', () => {
    search.drawing = []

    const expected = [
      {
        latitude: 35.05207923785588,
        longitude: -83.39749530081791
      },
      {
        latitude: 28.646776404271037,
        longitude: -83.39749530081791
      },
      {
        latitude: 28.646776404271037,
        longitude: -90.65945819144291
      },
      {
        latitude: 35.05207923785588,
        longitude: -90.65945819144291
      },
      {
        latitude: 35.05207923785588,
        longitude: -83.39749530081791
      }
    ]

    const actual = createValertOptions(search, limit)

    expect(actual.points).toEqual(expected)
  })

  it('should not return bound points when postal_codes exist', () => {
    search.filters.postal_codes = ['12345']

    const actual = createValertOptions(search, limit)

    expect(actual.points).toBeUndefined()
  })

  it('should not return drawing points when postal_codes exist', () => {
    search.drawing = [
      {
        lat: 28.646776404271037,
        lng: -90.65945819144291
      },
      {
        lat: 35.05207923785588,
        lng: -83.39749530081791
      },
      {
        lat: 35.05207923785588,
        lng: -83.39749530081791
      }
    ]
    search.filters.postal_codes = ['12345']

    const actual = createValertOptions(search, limit)

    expect(actual.points).toBeUndefined()
  })

  it('should return office  if it does exist', () => {
    search.office = 'xofficenumber'

    const actual = createValertOptions(search, limit)

    expect(actual.offices).toStrictEqual(['xofficenumber'])
  })

  it('should not return office if it does not exist', () => {
    search.office = undefined

    const actual = createValertOptions(search, limit)

    expect(actual.offices).toBeUndefined()
  })

  it('should return filters', () => {
    limit = 12

    const actual = createValertOptions(search, limit)

    expect(actual.limit).toBe(12)
  })

  it('should return filters', () => {
    search.filters = {
      open_house: false,
      property_types: ['Residential'],
      listing_statuses: ['Active'],
      pool: true,
      pets: true,
      number_of_pets_allowed: 1,
      furnished: false,
      search: 'texas'
    }

    const actual = createValertOptions(search, limit)
    const expected = {
      limit: 10,
      listing_statuses: ['Active'],
      number_of_pets_allowed: 1,
      pets: true,
      points: [
        { latitude: 35.05207923785588, longitude: -83.39749530081791 },
        { latitude: 28.646776404271037, longitude: -83.39749530081791 },
        { latitude: 28.646776404271037, longitude: -90.65945819144291 },
        { latitude: 35.05207923785588, longitude: -90.65945819144291 },
        { latitude: 35.05207923785588, longitude: -83.39749530081791 }
      ],
      pool: true,
      property_types: ['Residential'],
      search: 'texas'
    }

    expect(actual).toStrictEqual(expected)
  })

  it('should omit null values from filters', () => {
    search.filters = {
      open_house: false,
      property_types: ['Residential'],
      listing_statuses: ['Active'],
      pool: true,
      pets: true,
      number_of_pets_allowed: 1,
      furnished: false,
      search: 'texas',
      maximum_bedrooms: null,
      minimum_bathrooms: null,
      maximum_bathrooms: null,
      minimum_square_meters: null,
      maximum_square_meters: null,
      minimum_sold_date: null,
      excluded_listing_ids: null,
      mls_areas: null,
      postal_codes: null
    }

    const actual = createValertOptions(search, limit)
    const expected = {
      limit: 10,
      listing_statuses: ['Active'],
      number_of_pets_allowed: 1,
      pets: true,
      points: [
        { latitude: 35.05207923785588, longitude: -83.39749530081791 },
        { latitude: 28.646776404271037, longitude: -83.39749530081791 },
        { latitude: 28.646776404271037, longitude: -90.65945819144291 },
        { latitude: 35.05207923785588, longitude: -90.65945819144291 },
        { latitude: 35.05207923785588, longitude: -83.39749530081791 }
      ],
      pool: true,
      property_types: ['Residential'],
      search: 'texas'
    }

    expect(actual).toStrictEqual(expected)
  })
})
